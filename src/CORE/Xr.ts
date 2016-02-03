/// <reference path="../mz.ts" />
/// <reference path="Promise.ts" />
/// <reference path="../AUTH/OAuth2.ts" />

module mz {
    var res = function res(xhr): xr.XrResponse {
        return {
            status: xhr.status,
            response: xhr.response,
            xhr: xhr,
            url: '',
            data: null
        };
    };

    var getParams = function getParams(data, url?) {
        var ret = [];
        for (var k in data) {
            ret.push('' + encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
        }
        if (url && url.split('?').length > 1)
            ret.push(url.split('?')[1]);
        return ret.join('&');
    };

    var promise = function promise(args, fn): Promise<xr.XrResponse> {
        return (args && args.promise ? args.promise : xr.defaults.promise)(fn);
    };

    /**
      * xr (c) James Cleveland 2015
      * URL: https://github.com/radiosilence/xr
      * License: BSD
      */
    export function xr(args): Promise<xr.XrResponse> {

        if (!args.skipAuthorization && !args.promise) {
            mz.oauth2.applyAuthorizationHeaders(args);
        }

        return promise(args, function(resolve, reject) {
            var opts: xr.IXrArgs = mz.copy({}, xr.defaults);
            
            // avoid copying headers to default's headers object
            opts.headers = mz.copy(opts.headers);

            mz.copy(opts, args);

            var xhr = opts.xmlHttpRequest();

            var originalURL = opts.url;
            var fileProtocol = false;

            if (opts.url) {
                opts.url = mz.getPath(opts.url);
                fileProtocol = xr.urlResolve(opts.url).protocol == "file";
            }

            var data = typeof opts.data === 'object' && !opts.raw ? opts.dump.call(opts, opts.data) : opts.data;


            if (opts.url && opts.url.contains("//") && opts.withCredentials == null) {
                xhr.withCredentials = true;
            } else if (opts.withCredentials) {
                xhr.withCredentials = opts.withCredentials;
            }

            let queryString = opts.params ? getParams(opts.params) : null;

            xhr.open(opts.method, queryString && queryString.length ? '' + opts.url.split('?')[0] + '?' + queryString : opts.url, true);

            xhr.addEventListener(xr.Events.READY_STATE_CHANGE, function(e) {
                if (xhr.readyState == 4) {
                    try {
                        if (xhr.status >= 500 && xhr.getResponseHeader("jsonerror") == "true") {
                            var json = JSON.parse(xhr.responseText);
                            console.error ? console.error('JsonError: ' + json.Message, json) : console.log('JsonError: ' + json.Message, json);
                        }
                    } catch (e) {

                    }
                    var resultado = mz.copy(res(xhr), {
                        data: xhr.response ? !opts.raw ? opts.load(xhr.response, xhr) : xhr.response : null,
                        url: originalURL
                    });

                    if (resultado.data && resultado.data instanceof Promise) {
                        resultado.data.then(ok => {
                            resultado.data = ok;
                            return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                        }, err => {
                            resultado.data = err;
                            return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                        })
                    } else {
                        return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                    }
                }
            });

            xhr.addEventListener(xr.Events.ABORT, function() {
                return reject(res(xhr));
            });
            xhr.addEventListener(xr.Events.ERROR, function() {

                var resultado = res(xhr);

                if (xhr.response) {
                    try {
                        mz.copy(resultado, {
                            data: xhr.response ? !opts.raw ? opts.load(xhr.response, xhr) : xhr.response : null,
                            url: originalURL
                        });
                    } catch (e) { }
                }

                return reject(resultado);
            });
            xhr.addEventListener(xr.Events.TIMEOUT, function() {
                return reject(res(xhr));
            });

            for (var header in opts.headers) {
                xhr.setRequestHeader(header, opts.headers[header]);
            }


            for (var _event in opts.events) {
                xhr.addEventListener(_event, opts.events[_event].bind(null, xhr), false);
            }



            data !== undefined ? xhr.send(data) : xhr.send();
        });
    };
}

module mz.xr {

    export var Methods = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        PATCH: 'PATCH',
        OPTIONS: 'OPTIONS'
    };
    export var Events = {
        READY_STATE_CHANGE: 'readystatechange',
        LOAD_START: 'loadstart',
        PROGRESS: 'progress',
        ABORT: 'abort',
        ERROR: 'error',
        LOAD: 'load',
        TIMEOUT: 'timeout',
        LOAD_END: 'loadend'
    };


    export interface IXrEvents {
        readystatechange?: (e: ProgressEvent) => void;
        loadstart?: (e: Event) => void;
        progress?: (e: ProgressEvent) => void;
        abort?: (e: UIEvent) => void;
        error?: (e: ErrorEvent) => void;
        load?: (e: Event) => void;
        timeout?: (e: ProgressEvent) => void;
        loadend?: (e: ProgressEvent) => void;
    }


    export interface IXrArgs {
        /**
         * process the response with this function
         */
        load?(x: any, xhr?: XMLHttpRequest): any;

        /**
         *  process the data before send it
         */
        dump?(dataToSend: any): any;

        /**
         * the data sould be sended as raw content
         */
        raw?: boolean;

        /**
         * data to be sent
         */
        data?: any;

        xmlHttpRequest?(): XMLHttpRequest;
        promise?(fn): Promise<xr.XrResponse>;

        // query string params
        params?: mz.Dictionary<any>;
        url?: string;

        skipAuthorization?: boolean;

        headers?: mz.Dictionary<any>;

        events?: IXrEvents;

        // GET,PUT,POST,OPTIONS,DELETE,PATCH
        method?: string;

        withCredentials?: boolean;
    }


    var readJSONFromString = (x, xhr: XMLHttpRequest) => {
        if (typeof x == "string") {
            return mz.promise.parseJSON(x).then(x => {
                if ('d' in x)
                    return x.d;
                return x;
            }).then(mz.promise.parseStringDates);
        }

        return x;
    }

    export namespace formatters {
        export var json = function(x) {
            if (x instanceof FormData) {
                if ('Content-Type' in this.headers)
                    delete this.headers['Content-Type'];
                return x;
            }

            this.headers['Content-Type'] = 'application/json';

            return JSON.stringify(x);
        };
        export var raw = x => x.toString();

        export var urlEncoded = function(obj) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';

            var t = [];

            for (var i in obj) {
                if (obj.hasOwnProperty(i) && typeof obj[i] != 'undefined') {
                    if (typeof obj[i] == "object" && obj[i] instanceof Date && !isNaN(obj[i]))
                        t.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i].toISOString()));
                    else
                        t.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
                }
            }
            return t.join("&");
        };

        export var multipart = function(obj) {
            if ('Content-Type' in this.headers)
                delete this.headers['Content-Type'];

            var t = new FormData();

            for (var i in obj)
                if (obj.hasOwnProperty(i))
                    t.append(i, obj[obj]);

            return t;
        };


    }

    export var defaults: IXrArgs = {
        method: xr.Methods.GET,
        data: undefined,
        headers: {
            'Accept': 'application/json'
        },
        dump: formatters.json,
        load: readJSONFromString,
        xmlHttpRequest: function xmlHttpRequest() {
            return new XMLHttpRequest();
        },
        promise: function promise(fn): Promise<xr.XrResponse> {
            return new Promise(fn);
        },
        params: {},
        url: null,
        raw: false,
        events: {},
        withCredentials: null
    };

    export interface XrResponse {
        status: number;
        xhr: XMLHttpRequest;
        response: any;
        data: any;
        url: string;
    }


    var urlParsingNode = document.createElement("a");
    var originUrl = urlResolve(location.href);

    /**
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @kind function
     * @param {string} url The URL to be parsed.
     * @description Normalizes and parses a URL.
     * @returns {object} Returns the normalized URL as a dictionary.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *   | search        | The search params, minus the question mark                             |
     *   | hash          | The hash string, minus the hash symbol
     *   | hostname      | The hostname
     *   | port          | The port, without ":"
     *   | pathname      | The pathname, beginning with "/"
     *
     */
    export function urlResolve(url: string) {
        var href = url;

        //if (msie) {
        // Normalize before parse.  Refer Implementation Notes on why this is
        // done in two steps on IE.
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
        //}

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/')
                ? urlParsingNode.pathname
                : '/' + urlParsingNode.pathname
        };
    }
    
    /**
     * Parse a request URL and determine whether this is a same-origin request as the application document.
     *
     * @param {string|object} requestUrl The url of the request as a string that will be resolved
     * or a parsed URL object.
     * @returns {boolean} Whether the request is for the same origin as the application document.
     */
    export function urlIsSameOrigin(requestUrl) {
        var parsed = (typeof requestUrl == "string") ? urlResolve(requestUrl) : requestUrl;
        return (parsed.protocol === originUrl.protocol &&
            parsed.host === originUrl.host);
    }
    
    /**
     * var moviles = 'Los Moviles/Autos'
     * mz.xr.urlEncode `@api/v1/${moviles}/1` -> '@api/v1/Los%20Moviles%2FAutos/1'  
     */
    export function urlEncode(literalSections: TemplateStringsArray, ...substs): string {
        var raw = literalSections.raw;

        var result = '';

        substs.forEach((subst, i) => {
            var lit = raw[i];

            if (Array.isArray(subst)) {
                subst = subst.join('');
            }

            if (!lit.endsWith('$')) {
                subst = encodeURIComponent(subst);
            } else {
                lit = lit.slice(0, -1);
            }

            result += lit;
            result += subst;
        });

        result += raw[raw.length - 1]; // (A)
    
        return result;
    }

    export var getAbsoluteUrl: (path: string) => string = (function() {
        var a;

        return function(url) {
            if (!a) a = document.createElement('a');
            a.href = getPath(url);

            return a.href;
        };
    })();


    export function get(url: string, params?: any, args?: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.GET, params: params }, args));
    };
    export function put(url: string, data?: any, args?: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.PUT, data: data || {} }, args));
    };
    export function post(url: string, data?: any, args?: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.POST, data: data || {} }, args));
    };
    export function patch(url: string, data?: any, args?: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.PATCH, data: data || {} }, args));
    };
    export function del(url: string, args: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.DELETE }, args));
    };
    export function options(url: string, args: IXrArgs) {
        return xr(mz.copy({ url: url, method: Methods.OPTIONS }, args));
    };
}

