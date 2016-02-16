/// <reference path="TSD/JQuery.d.ts" />
/// <reference path="TSD/Promise.d.ts" />
if (typeof this.jQuery === "undefined") {
    throw new Error("jQuery not present");
}
function isDef(b) {
    return typeof b != "undefined";
}
;
if (!('Promise' in window)) {
    /*! promise-polyfill 2.1.0 */
    eval("!function(a){function b(a,b){return function(){a.apply(b,arguments)}}function c(a){if(\"object\"!=typeof this)throw new TypeError(\"Promises must be constructed via new\");if(\"function\"!=typeof a)throw new TypeError(\"not a function\");this._state=null,this._value=null,this._deferreds=[],i(a,b(e,this),b(f,this))}function d(a){var b=this;return null===this._state?void this._deferreds.push(a):void j(function(){var c=b._state?a.onFulfilled:a.onRejected;if(null===c)return void(b._state?a.resolve:a.reject)(b._value);var d;try{d=c(b._value)}catch(e){return void a.reject(e)}a.resolve(d)})}function e(a){try{if(a===this)throw new TypeError(\"A promise cannot be resolved with itself.\");if(a&&(\"object\"==typeof a||\"function\"==typeof a)){var c=a.then;if(\"function\"==typeof c)return void i(b(c,a),b(e,this),b(f,this))}this._state=!0,this._value=a,g.call(this)}catch(d){f.call(this,d)}}function f(a){this._state=!1,this._value=a,g.call(this)}function g(){for(var a=0,b=this._deferreds.length;b>a;a++)d.call(this,this._deferreds[a]);this._deferreds=null}function h(a,b,c,d){this.onFulfilled=\"function\"==typeof a?a:null,this.onRejected=\"function\"==typeof b?b:null,this.resolve=c,this.reject=d}function i(a,b,c){var d=!1;try{a(function(a){d||(d=!0,b(a))},function(a){d||(d=!0,c(a))})}catch(e){if(d)return;d=!0,c(e)}}var j=\"function\"==typeof setImmediate&&setImmediate||function(a){setTimeout(a,1)},k=Array.isArray||function(a){return\"[object Array]\"===Object.prototype.toString.call(a)};c.prototype[\"catch\"]=function(a){return this.then(null,a)},c.prototype.then=function(a,b){var e=this;return new c(function(c,f){d.call(e,new h(a,b,c,f))})},c.all=function(){var a=Array.prototype.slice.call(1===arguments.length&&k(arguments[0])?arguments[0]:arguments);return new c(function(b,c){function d(f,g){try{if(g&&(\"object\"==typeof g||\"function\"==typeof g)){var h=g.then;if(\"function\"==typeof h)return void h.call(g,function(a){d(f,a)},c)}a[f]=g,0===--e&&b(a)}catch(i){c(i)}}if(0===a.length)return b([]);for(var e=a.length,f=0;f<a.length;f++)d(f,a[f])})},c.resolve=function(a){return a&&\"object\"==typeof a&&a.constructor===c?a:new c(function(b){b(a)})},c.reject=function(a){return new c(function(b,c){c(a)})},c.race=function(a){return new c(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})},c._setImmediateFn=function(a){j=a},\"undefined\"!=typeof module&&module.exports?module.exports=c:a.Promise||(a.Promise=c)}(this);");
}
var mz;
(function (mz) {
    mz.globalContext = window || typeof global != "undefined" && global;
    (function () {
        var UID = 1;
        mz.globalContext.Symbol = mz.globalContext.Symbol || function (a) {
            return "[[" + a + "-" + UID++ + "]]";
        };
    })();
    mz._debug = window._debug || window.location.search.match('(\\?|&)mz-debug') !== null;
    var scripts = document.getElementsByTagName('script'), test, mzcorePath, i, ln, scriptSrc, match, lang;
    var jquery = true;
    var jqueryVer = null;
    for (i = 0, ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;
        match = scriptSrc.match(/mz(\.min){0,1}\.js/);
        if (match) {
            if (scriptSrc.match('(\\?|&)no-jquery') !== null) {
                jquery = false;
            }
            mzcorePath = scriptSrc.substring(0, scriptSrc.indexOf(match[0]));
            break;
        }
    }
    mz.scriptBase = '';
    // Path helpers
    mz.core_path = (mzcorePath || '').toString();
    (mz.core_path.substr(-1) !== '/') && (mz.core_path += '/');
    function alias(clave, ruta) {
        (ruta.substr(-1) !== '/') && (ruta += '/');
        alias_routes[clave] = ruta;
    }
    mz.alias = alias;
    ;
    var alias_routes = {
        mz: mz.core_path
    };
    function getPath(path, root) {
        var io = 0, clave = null, base = root || mz.core_path;
        (base.substr(-1) !== '/') && (base += '/');
        if (path) {
            if (path.substr(0, 1) == '@' && (io = path.indexOf('/')) != -1 && (clave = path.substr(1, io - 1)) && alias_routes.hasOwnProperty(clave)) {
                path = path.replace('@' + clave + '/', alias_routes[clave]);
            }
            return path.substr(0, 2) in { './': 1, '~/': 1 } ? base + path.substr(2) : path;
        }
        return base;
    }
    mz.getPath = getPath;
    ;
    // element helpers
    function getElementPosition(element) {
        var elm = element;
        if (element instanceof jQuery)
            elm = element[0];
        var x = 0;
        var y = 0;
        if (elm) {
            x = elm.offsetLeft; // set x to elm’s offsetLeft
            y = elm.offsetTop; // set y to elm’s offsetTop
            elm = elm.offsetParent; // set elm to its offsetParent
            //use while loop to check if elm is null
            // if not then add current elm’s offsetLeft to x
            //offsetTop to y and set elm to its offsetParent
            while (elm != null) {
                x = (x | 0) + elm.offsetLeft | 0;
                y = (y | 0) + elm.offsetTop | 0;
                elm = elm.offsetParent;
            }
        }
        return {
            x: x,
            y: y
        };
    }
    mz.getElementPosition = getElementPosition;
    ;
    mz.emptyFn = function () { };
    mz.oldCopy = function (b, c) {
        b = b || {};
        c = c || {};
        function extend(a, b) {
            for (var i in b) {
                a[i] = b[i];
            }
            return a;
        }
        b = extend(b, c);
        if (c.hasOwnProperty && c.hasOwnProperty('toString') && (typeof c.toString != 'undefined') && (b.toString !== c.toString))
            b.toString = c.toString;
        return b;
    };
    function copy(Destination) {
        var dest = arguments[0] || {};
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                dest = mz.oldCopy(dest, arguments[i]);
            }
            return dest;
        }
        if (arguments.length == 1) {
            return mz.oldCopy({}, arguments[0]);
        }
        return dest;
    }
    mz.copy = copy;
    ;
    function mapXInto(propiedades, destino) {
        var n_args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            n_args[_i - 2] = arguments[_i];
        }
        if (arguments.length) {
            for (var i = 1; i < arguments.length; i++) {
                for (var prop in propiedades) {
                    if (arguments[i] && (propiedades[prop] in arguments[i]))
                        destino[propiedades[prop]] = arguments[i][propiedades[prop]];
                }
            }
        }
        return destino;
    }
    mz.mapXInto = mapXInto;
    ;
    function mapInto(destino) {
        var n_args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            n_args[_i - 1] = arguments[_i];
        }
        var argumentos = Array.prototype.slice.call(arguments);
        argumentos.unshift(Object.keys(destino));
        return mapXInto.apply(null, argumentos);
    }
    mz.mapInto = mapInto;
    ;
    function isIterable(a) {
        if (!a || (typeof a != 'object'))
            return false;
        if ('toString' in a && a.toString() == "[object Object]")
            return true;
        if (!('length' in a))
            return false;
        if (a instanceof Array || ('callee' in a) || ('push' in a && 'pop' in a))
            return true;
        return false;
    }
    mz.isIterable = isIterable;
    function trim(text) {
        try {
            return String(text.toString()).trim();
        }
        catch (ignored) {
            return "";
        }
    }
    mz.trim = trim;
    var contador_doms = 0;
    function getDOMID() {
        return "mz-elem-" + (contador_doms++);
    }
    mz.getDOMID = getDOMID;
    function genUID() {
        return (contador_doms++);
    }
    mz.genUID = genUID;
    mz.intval = mz.globalContext.intval = function (mixed_var, base) {
        var tmp;
        var type = typeof (mixed_var);
        if (type === 'boolean') {
            return +mixed_var;
        }
        else if (type === 'string') {
            tmp = parseInt(mixed_var, base || 10);
            return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
        }
        else if (type === 'number' && isFinite(mixed_var)) {
            return mixed_var | 0;
        }
        else {
            return 0;
        }
    };
    //console.log('MZCORE: /--==<{[One Script To Rule Them All ಠ_ಠ]}>==--/');
    mz.CBool = mz.globalContext.CBool = function (val) {
        if (!val || val == null || val == undefined)
            return false;
        if (typeof val == 'string') {
            if (val.toLowerCase() == "false")
                return false;
            if (val.toLowerCase() == "0")
                return false;
            if (val.trim().length)
                return true;
        }
        if (mz.intval(val) != 0)
            return true;
        return false;
    };
    var theQueryString = {};
    window.location && window.location.search.toString().replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
        theQueryString[$1] = $3;
        return $0;
    });
    /**
    Obtiene el valor de la clave del query string

    @method queryString
    @param {String} key
    */
    mz.queryString = function (key) {
        if (key in theQueryString)
            return theQueryString[key];
        return null;
    };
    /**
    Devuelve un valor booleano en base a la expresion. Si __expr__ es una función, la llama.

    @method readBool
    @param {Expression} expr
    */
    mz.readBool = function (cosa, datos, datos2) {
        if (typeof cosa == 'function')
            return !!cosa(datos, datos2);
        return !!cosa;
    };
    /**
    Devuelve un valor tipo string en base a la expresion. Si __expr__ es una función, la llama.

    @method readString
    @param {Expression} expr
    */
    mz.readString = function (cosa, datos, datos2) {
        if (typeof cosa == 'function') {
            var a = cosa(datos, datos2);
            if (a != null)
                return '' + a;
            return '';
        }
        return '' + isDef(cosa) && cosa !== null ? cosa : '';
    };
    /**
    Devuelve un valor en base a la expresion. Si __expr__ es una función, la llama.

    @method readVar
    @param {Expression} expr
    */
    mz.readVar = function (cosa, datos, datos2) {
        if (typeof cosa == 'function')
            return cosa(datos, datos2);
        return cosa;
    };
    /**
    Crea un delayer para la función

    @method delayer
    @param {Function} callback
    @param {Int} defTimeout
    @return {Function} FunctionDelayer
    */
    mz.delayer = function (fn, defTimeout, thisp) {
        var timer = null;
        defTimeout = defTimeout || 16;
        var ret = function () {
            timer && clearTimeout(timer);
            var a = arguments;
            thisp = thisp || this;
            timer = setTimeout(function () {
                fn.apply(thisp || null, a);
                timer = null;
            }, defTimeout);
            return timer;
        };
        ret.now = function () {
            timer && clearTimeout(timer);
            timer = null;
            return fn.apply(thisp || null, arguments);
        };
        ret.cancel = function () {
            timer && clearTimeout(timer);
            timer = null;
        };
        return ret;
    };
    /**
    Debounces the current call until the next frame

    @method delayer
    @param {Function} fn
    @return {Function} FunctionDelayer
    */
    mz.screenDelayer = function (fn, thisp) {
        var timer = null;
        var ret = function () {
            timer && cancelAnimationFrame(timer);
            var a = arguments;
            thisp = thisp || this;
            timer = requestAnimationFrame(function () {
                fn.apply(thisp || null, a);
                timer = null;
            });
            return timer;
        };
        ret.now = function () {
            timer && cancelAnimationFrame(timer);
            timer = null;
            return fn.apply(thisp || null, arguments);
        };
        ret.cancel = function () {
            timer && cancelAnimationFrame(timer);
            timer = null;
        };
        return ret;
    };
    mz.traspose = function (a) {
        return Object.keys(a[0]).map(function (c) {
            return a.map(function (r) {
                return r[c];
            });
        });
    };
    /**
    Obtiene el valor del Performance Counter

    @method now
    @return {Number} PerformanceCounter
    */
    mz.now = 'performance' in window && window.performance.now ?
        function () {
            return window.performance.now();
        } :
        function () {
            return (new Date()).getTime();
        };
    mz.blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
    mz.transformTag = null;
    var data;
    (function (data) {
        var order;
        (function (order) {
            function null_arriba(a, b, campo) {
                var aTieneNulo = !(campo in a) || a[campo] == null;
                var bTieneNulo = !(campo in b) || b[campo] == null;
                if (aTieneNulo != bTieneNulo) {
                    if (bTieneNulo)
                        return -1;
                    return 1;
                }
                if (aTieneNulo == true || a[campo] == b[campo])
                    return 0;
                return +(a[campo] > b[campo]) * 2 - 1;
            }
            order.null_arriba = null_arriba;
            function null_abajo(a, b, campo) {
                var aTieneNulo = !(campo in a) || a[campo] == null;
                var bTieneNulo = !(campo in b) || b[campo] == null;
                if (aTieneNulo != bTieneNulo) {
                    if (bTieneNulo)
                        return 1;
                    return -1;
                }
                if (aTieneNulo == true || a[campo] == b[campo])
                    return 0;
                return +(a[campo] > b[campo]) * 2 - 1;
            }
            order.null_abajo = null_abajo;
            function build(elems) {
                if (typeof elems == 'function')
                    return elems;
                var null_abajo = this.null_abajo, null_arriba = this.null_arriba;
                if (typeof elems == 'string') {
                    elems = elems.split(',');
                    for (var i in elems) {
                        elems[i] = mz.trim(elems[i]);
                        var t = elems[i].toUpperCase();
                        if (/(( ASC)|( DESC))$/.test(t)) {
                            elems[i] = {
                                invertir: /( DESC)$/.test(t),
                                campo: elems[i].replace(/( ASC)$|( DESC)$/, '')
                            };
                        }
                    }
                }
                return function (a, b) {
                    var tmp = 0;
                    for (var i in elems) {
                        if (typeof elems[i] == "string") {
                            tmp = null_abajo(a, b, elems[i]);
                        }
                        else {
                            if (elems[i].null_abajo) {
                                tmp = null_abajo(a, b, elems[i].campo);
                            }
                            else {
                                tmp = null_arriba(a, b, elems[i].campo);
                            }
                            if (elems[i].invertir)
                                tmp *= -1;
                        }
                        if (tmp != 0)
                            return tmp;
                    }
                    return tmp;
                };
            }
            order.build = build;
        })(order = data.order || (data.order = {}));
    })(data = mz.data || (mz.data = {}));
    mz.hardCodedFiles = {};
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    mz.escapeRegExp = escapeRegExp;
    var cssCargados = {};
    function loadCss(url) {
        url = getPath(url);
        if (url in cssCargados)
            return cssCargados[url];
        var estilos = document.getElementsByTagName('link'), i, ln;
        for (i = 0, ln = estilos.length; i < ln; i++) {
            if (estilos[i].rel == 'stylesheet' && estilos[i].href.split('?')[0] == url)
                return;
        }
        if ('createStyleSheet' in document) {
            return cssCargados[url] = document.createStyleSheet(url);
        }
        else {
            var style = $("<link rel='stylesheet' href='" + url + "' type='text/css' />");
            //$(function () {
            style.appendTo($("head"));
            //});
            return cssCargados[url] = style;
        }
    }
    mz.loadCss = loadCss;
    function fnInfo(fn) {
        var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
        var matches = fn.toString().match(fnRegex);
        return {
            params: matches[1].split(","),
            body: matches[2]
        };
    }
    mz.fnInfo = fnInfo;
    function compileFilter(filter) {
        var filterInfo = fnInfo(filter);
        var filterBody = filterInfo.body
            .replace(/return false[;}]/gi, "{ continue _coreloop; }")
            .replace(/return true[;}]/gi, "{ _retval.push($item$); continue _coreloop; }")
            .replace(/return ([^;}]+?)/gi, "{ if ($1) { _retval.push($item$) }; continue _coreloop; }");
        var tpl = [
            //"function(_items, _args) { ",
            "var _retval = new Array(), _idx = 0; ",
            "var $item$, $args$ = _args; ",
            "_coreloop: ",
            "for (var _i = 0, _il = _items.length; _i < _il; _i++) { ",
            "$item$ = _items[_i]; ",
            "$filter$; ",
            "} ",
            "return _retval; "
        ].join("");
        tpl = tpl.replace(/\$filter\$/gi, filterBody);
        tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
        tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);
        var fn = new Function("_items,_args", tpl);
        fn.displayName = fn.name = "compiledFilter";
        return fn;
    }
    mz.compileFilter = compileFilter;
    function getWindowSize() {
        var winW = 630, winH = 460;
        if (document.body && document.body.offsetWidth) {
            winW = document.body.offsetWidth;
            winH = document.body.offsetHeight;
        }
        if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
            winW = document.documentElement.offsetWidth;
            winH = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        return {
            width: winW,
            height: winH
        };
    }
    mz.getWindowSize = getWindowSize;
    ;
    var uid = 0;
    function globalCallback(cb) {
        uid++;
        mz["__" + uid] = cb;
        return "mz.__" + uid;
    }
    mz.globalCallback = globalCallback;
    function buscarArgumentoTipo(tipo, argu) {
        var args = argu || arguments.callee.caller.arguments;
        if (typeof tipo == 'string') {
            for (var i in args) {
                if (typeof args[i] == tipo) {
                    return args[i];
                }
            }
        }
        else if (typeof tipo == 'function') {
            for (var i in args) {
                if (args[i] instanceof tipo) {
                    return args[i];
                }
            }
        }
    }
    mz.buscarArgumentoTipo = buscarArgumentoTipo;
})(mz || (mz = {}));
var mz;
(function (mz) {
    var view;
    (function (view) {
        // riot!.js
        var brackets = (function (orig) {
            var cachedBrackets, r, b, re = /[{}]/g;
            return function (x) {
                // make sure we use the current setting
                var s = orig;
                // recreate cached vars if needed
                if (cachedBrackets !== s) {
                    cachedBrackets = s;
                    b = s.split(' ');
                    r = b.map(function (e) { return e.replace(/(?=.)/g, '\\'); });
                }
                // if regexp given, rewrite it with current brackets (only if differ from default)
                return x instanceof RegExp ? (s === orig ? x :
                    new RegExp(x.source.replace(re, function (b) { return r[~~(b === '}')]; }), x.global ? 'g' : '')) :
                    // else, get specific bracket
                    b[x];
            };
        })('{ }');
        var cache = {}, reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi;
        //           [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
        // find variable names:
        // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
        // 2. skip object properties: .name
        // 3. skip object literals: name:
        // 4. skip javascript keywords
        // 5. match var name
        // build a template (or get it from cache), render with data
        function tmpl(str, context, scope) {
            return str && (cache[str] = cache[str] || tmpl.internalTmpl(str)).call(context, scope || context);
        }
        view.tmpl = tmpl;
        var tmpl;
        (function (tmpl) {
            tmpl.debug = false;
            // create a template instance
            function internalTmpl(s, p) {
                if (tmpl.debug) {
                    console.groupCollapsed(s);
                }
                var orig = s;
                // default template string to {}
                s = (s || (brackets(0) + brackets(1)))
                    .replace(brackets(/\\{/g), '\uFFF0')
                    .replace(brackets(/\\}/g), '\uFFF1');
                // split string to expression and non-expresion parts
                p = split(s, extract(s, brackets(/{/), brackets(/}/)));
                var body = (
                // is it a single expression or a template? i.e. {x} or <b>{x}</b>
                !p[0] && !p[2] && !p[3]
                    ? expr(p[1])
                    : '[' + p.map(function (s, i) {
                        // is it an expression or a string (every second part is an expression)
                        return i % 2
                            ? expr(s, true)
                            : '"' + s
                                .replace(/\r\n/g, '\\n')
                                .replace(/\r/g, '\\n')
                                .replace(/\n/g, '\\n')
                                .replace(/"/g, '\\"')
                                + '"';
                    }).join(',') + '].join("")')
                    .replace(/\uFFF0/g, brackets(0))
                    .replace(/\uFFF1/g, brackets(1));
                if (body.trim().length == 0)
                    body = 'void 0';
                if (tmpl.debug) {
                    console.log(body);
                    console.groupEnd();
                }
                var a = new Function('scope', 'return (' + body + ')');
                a.mzt = orig;
                return a;
            }
            tmpl.internalTmpl = internalTmpl;
            // parse { ... } expression
            function expr(s, n) {
                if (tmpl.debug)
                    console.log('expr:', s);
                s = s
                    .replace(/\n/g, ' ')
                    .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '');
                // is it an object literal? i.e. { key : value }
                return /^\s*[\w-#\. "']+ *:/.test(s)
                    ? '[' +
                        // extract key:val pairs, ignoring any nested objects
                        extract(s, 
                        // name part: name:, "name":, 'name':, name :
                        /["' ]*[\w-#\. ]+["' ]*:/, 
                        // expression part: everything upto a comma followed by a name (see above) or end of line
                        /,(?=["' ]*[\w-#\. ]+["' ]*:)|}|$/).map(function (pair) {
                            // get key, val parts
                            return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function (_, k, v) {
                                // wrap all conditional parts to ignore errors
                                return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",';
                            });
                        }).join('')
                        + '].join(" ").trim()'
                    : wrap(s, n);
            }
            tmpl.expr = expr;
            ;
            // execute js w/o breaking on errors or undefined vars
            function wrap(s, nonull) {
                s = s.trim();
                return !s ? '' : "\n                (function(){ \n                    var v; \n                    try { \n                        v = "
                    + (s.replace(reVars, function (s, _, v) {
                        return v ?
                            "\n                            (typeof " + v + " === \"undefined\" ? typeof this." + v + " === \"undefined\" ? this.get && this.get(\"" + v + "\") : this." + v + " : " + v + ")"
                            :
                                s;
                    }) || '[][0]')
                    + ("\n                    } catch(e) { }\n                    return " + (nonull === true ? ' !v && v !== 0 ? "" : v' : 'v') + ";\n                }).call(this)");
            }
            tmpl.wrap = wrap;
            // split string by an array of substrings
            function split(str, substrings) {
                var parts = [];
                substrings.map(function (sub, i) {
                    // push matched expression and part before it
                    i = str.indexOf(sub);
                    parts.push(str.slice(0, i), sub);
                    str = str.slice(i + sub.length);
                });
                // push the remaining part
                return parts.concat(str);
            }
            tmpl.split = split;
            // match strings between opening and closing regexp, skipping any inner/nested matches
            function extract(str, open, close) {
                var start, level = 0, matches = [], re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g');
                str.replace(re, function (_, open, close, pos) {
                    // if outer inner bracket, mark position
                    if (!level && open)
                        start = pos;
                    // in(de)crease bracket level
                    level += open ? 1 : -1;
                    // if outer closing bracket, grab the match
                    if (!level && close != null)
                        matches.push(str.slice(start, pos + close.length));
                });
                return matches;
            }
            tmpl.extract = extract;
        })(tmpl = view.tmpl || (view.tmpl = {}));
    })(view = mz.view || (mz.view = {}));
})(mz || (mz = {}));
var mz;
(function (mz) {
    mz.HIDDEN_PROP = (function getHiddenProp() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];
        if (typeof document == "undefined")
            return null;
        // if 'hidden' is natively supported just return it
        if ('hidden' in document)
            return 'hidden';
        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
                return prefixes[i] + 'Hidden';
        }
        // otherwise it's not supported
        return null;
    })();
    mz.hiddenProp = mz.HIDDEN_PROP;
    var tmp;
    if (typeof document != "undefined")
        tmp = document.createElement("div");
    mz.TRANSFORM_STYLE = (function getTransformTag() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];
        if (!tmp)
            return null;
        if ('transform' in tmp.style)
            return 'transform';
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Transform') in tmp.style)
                return prefixes[i] + 'Transform';
        }
        return null;
    })();
    mz.TRANSFORM_CSS = (function getTransformTag() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];
        if (!tmp)
            return null;
        if ('transform' in tmp.style)
            return 'transform';
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Transform') in tmp.style)
                return '-' + prefixes[i] + '-transform';
        }
        return null;
    })();
})(mz || (mz = {}));
var mz;
(function (mz) {
    var eventSplitter = /\s+/g;
    var EventDispatcherBinding = (function () {
        function EventDispatcherBinding() {
            this.cb = null;
            this.evento = null;
            this.sharedList = null;
            this.object = null;
        }
        EventDispatcherBinding.prototype.off = function () {
            if (this.object) {
                this.cb && this.object.off(this);
                this.cb = null;
                this.object = null;
            }
        };
        return EventDispatcherBinding;
    })();
    mz.EventDispatcherBinding = EventDispatcherBinding;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.ed_bindeos = {};
            this.ed_bindeosTotales = [];
            this.ed_bindCount = 0;
            this.trigger = this.emit;
        }
        EventDispatcher.prototype.on = function (event, callback, once) {
            var _this = this;
            this.ed_bindCount++;
            var events = event.split(eventSplitter);
            var tmp;
            var listaBindeos = [];
            events.forEach(function (evt) {
                tmp = new EventDispatcherBinding();
                tmp.id = _this.ed_bindCount;
                tmp.cb = null;
                tmp.evento = evt;
                tmp.sharedList = listaBindeos;
                tmp.object = _this;
                listaBindeos.push(tmp);
                if (once) {
                    tmp.cb = function () {
                        callback.apply(this, arguments);
                        tmp.cb = null;
                    };
                }
                else {
                    tmp.cb = callback;
                }
                tmp.cb = tmp.cb.bind(_this);
                _this.ed_bindeosTotales[tmp.id] = tmp;
                _this.ed_bindeos[evt] = _this.ed_bindeos[evt] || [];
                _this.ed_bindeos[evt].push(tmp);
            });
            return tmp;
        };
        EventDispatcher.prototype.once = function (event, callback) {
            return this.on(event, callback, true);
        };
        EventDispatcher.prototype.off = function (bindeo, callback) {
            if (arguments.length == 0) {
                for (var i in this.ed_bindeos) {
                    delete this.ed_bindeos[i].cb;
                }
                this.ed_bindeos.length = 0;
            }
            else if (bindeo instanceof EventDispatcherBinding) {
                bindeo.cb = null;
                bindeo.sharedList && bindeo.sharedList.length && bindeo.sharedList.forEach(function (f) { f.cb = null; });
            }
            else if (typeof bindeo == 'string') {
                if (typeof callback == 'function') {
                    for (var i in this.ed_bindeos) {
                        if (this.ed_bindeos[i].cb === callback) {
                            this.ed_bindeos[i].cb = null;
                        }
                    }
                }
                else if (typeof bindeo == 'string') {
                    this.ed_bindeos[bindeo] = [];
                }
            }
            else if (typeof bindeo === 'function') {
                for (var i in this.ed_bindeos) {
                    if (this.ed_bindeos[i].cb === bindeo) {
                        this.ed_bindeos[i].cb = null;
                    }
                }
            }
        };
        EventDispatcher.prototype.emit = function (event) {
            if (event in this.ed_bindeos) {
                if (arguments.length == 1) {
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb();
                        }
                    }
                }
                else if (arguments.length == 2) {
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb(arguments[1]);
                        }
                    }
                }
                else if (arguments.length == 3) {
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb(arguments[1], arguments[2]);
                        }
                    }
                }
                else if (arguments.length == 4) {
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb(arguments[1], arguments[2], arguments[3]);
                        }
                    }
                }
                else if (arguments.length == 5) {
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb(arguments[1], arguments[2], arguments[3], arguments[4]);
                        }
                    }
                }
                else if (arguments.length > 4) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            this.ed_bindeos[event][i].cb.call(this, args);
                        }
                    }
                }
            }
        };
        EventDispatcher.EVENTS = {};
        return EventDispatcher;
    })();
    mz.EventDispatcher = EventDispatcher;
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
/// <reference path="EventDispatcher.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mz;
(function (mz) {
    var MVCObject = (function (_super) {
        __extends(MVCObject, _super);
        function MVCObject(args) {
            _super.call(this);
            this.data = {};
            args && this.setValues(args);
        }
        MVCObject.prototype.getAll = function () { return this.data; };
        MVCObject.prototype.setValues = function (values, emit) {
            if (values instanceof MVCObject) {
                values = values.getAll();
            }
            for (var i in values) {
                this.set(i, values[i], !emit);
            }
            this.emit(MVCObject.EVENTS.setValues, this.data, values);
        };
        MVCObject.prototype.set = function (field, value, NoTrigerearChanged) {
            if (!isDef(field))
                return;
            var viejo = this.data[field];
            this.data[field] = value;
            var ch = field + '_changed';
            if (ch in this && typeof this[ch] === 'function')
                var result = this[ch](value, viejo);
            if (typeof result !== "undefined") {
                value = this.data[field] = result;
            }
            this.emit(ch, this.data[field], viejo);
            !NoTrigerearChanged && this.emit(MVCObject.EVENTS.valueChanged, this.data, field, this.data[field], viejo);
        };
        MVCObject.prototype.get = function (field) {
            return this.data[field];
        };
        MVCObject.EVENTS = mz.copy({
            /// Triggered when the method setValues is called
            setValues: "setValues",
            /// Triggered when a value is setted
            valueChanged: "valueChanged"
        }, mz.EventDispatcher.EVENTS);
        return MVCObject;
    })(mz.EventDispatcher);
    mz.MVCObject = MVCObject;
})(mz || (mz = {}));
var mz;
(function (mz) {
    var MVCObject;
    (function (MVCObject) {
        function proxy(target, propertyKey) {
            if (delete target[propertyKey]) {
                Object.defineProperty(target, propertyKey.toString(), {
                    get: function () {
                        return this.data[propertyKey];
                    },
                    set: function (value) {
                        this.set(propertyKey, value);
                    },
                    enumerable: true
                });
            }
        }
        MVCObject.proxy = proxy;
    })(MVCObject = mz.MVCObject || (mz.MVCObject = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
var mz;
(function (mz) {
    var core;
    (function (core) {
        var decorators;
        (function (decorators) {
            function LogResult(target, key, value) {
                return {
                    value: function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        var a = args.map(function (a) { return JSON.stringify(a); }).join();
                        var result = value.value.apply(this, args);
                        var r = JSON.stringify(result);
                        console.log("LogResult: " + key + "(" + a + ") => " + r);
                        return result;
                    }
                };
            }
            decorators.LogResult = LogResult;
            function noEnumerable(target, propertyKey, descriptor) {
                descriptor.enumerable = false;
                return descriptor;
            }
            decorators.noEnumerable = noEnumerable;
            var delayerCount = 0;
            function delayer(timeout) {
                return function (target, propertyKey, descriptor) {
                    /*let theDelayer = mz.delayer(descriptor.value, timeout);
                    
                    descriptor.value = function(){
                        theDelayer.apply(this, arguments);
                    };
                    */
                    console.error(propertyKey + ": !!ALERTA, LOS DECORADORES mz.core.decorators.delayer & screenDelayer NO FUNCIONAN AUN");
                    return descriptor;
                };
            }
            decorators.delayer = delayer;
            function screenDelayer(target, propertyKey, descriptor) {
                /*let theDelayer = mz.screenDelayer(descriptor.value);
                    
                    descriptor.value = <any>function(){
                        return (<any>theDelayer).apply(this, arguments);
                    };
                  */
                var originalValue = descriptor.value;
                var delayerID = "[[delayer-" + delayerCount++ + "]]";
                console.error(propertyKey + ": !!ALERTA, LOS DECORADORES mz.core.decorators.delayer & screenDelayer NO FUNCIONAN AUN");
                descriptor.value = function () {
                    var theDelayer = this[delayerID] = this[delayerID] || mz.screenDelayer(originalValue, this);
                    return theDelayer.apply(this, arguments);
                };
                return descriptor;
            }
            decorators.screenDelayer = screenDelayer;
        })(decorators = core.decorators || (core.decorators = {}));
    })(core = mz.core || (mz.core = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
/// <reference path="../VIEW/Tmpl.ts" />
/// <reference path="../VIEW/Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var TextNode = (function () {
            function TextNode(value, component, scope) {
                this.value = value;
                this.component = component;
                this.scope = scope;
                this.listening = [];
                var t = mz.view.tmpl(value, component, scope);
                if (typeof t === "undefined")
                    t = '';
                this.rootNode = mz.dom.adapter.createTextNode(t);
                this.rootNode.$tmpl = value;
                this.rootNode.$component = component;
                this.rootNode.$scope = scope;
                this.rootNode.$widget = this;
            }
            TextNode.prototype.setup = function (value, component, scope) {
                this.value = value;
                this.component = component;
                this.scope = scope;
                var t = mz.view.tmpl(value, component, scope);
                if (typeof t === "undefined" || t === null)
                    t = '';
                //this.rootNode.textContent = t;
                mz.dom.microqueue.setText(this.rootNode, t);
                this.rootNode.$tmpl = value;
                this.rootNode.$component = component;
                this.rootNode.$scope = scope;
                this.rootNode.$widget = this;
            };
            TextNode.prototype.unmount = function () {
                this.rootNode.remove();
                this.rootNode.$tmpl = null;
                this.rootNode.$component = null;
                this.rootNode.$scope = null;
                this.rootNode.$widget = null;
                for (var _i = 0, _a = this.listening; _i < _a.length; _i++) {
                    var i = _a[_i];
                    i && i.off && i.off();
                }
                this.listening.length = 0;
                this.value = this.component = this.scope = null;
                TextNode.returnToPoll(this);
            };
            TextNode.prototype.refreshScope = function () {
                var t = mz.view.tmpl(this.value, this.component, this.scope);
                if (typeof t === "undefined" || t === null)
                    t = '';
                mz.dom.microqueue.setText(this.rootNode, t);
                //if (this.rootNode.textContent != t) {
                //    this.rootNode.textContent = t;
                //}
            };
            TextNode.returnToPoll = function (val) {
                if (val)
                    this.pollObjects.push(val);
            };
            TextNode.getFromPoll = function (value, component, scope) {
                var elem = null;
                if (this.pollObjects.length) {
                    elem = this.pollObjects.pop();
                    elem.setup(value, component, scope);
                    return elem;
                }
                else {
                    return new TextNode(value, component, scope);
                }
            };
            TextNode.pollObjects = [];
            return TextNode;
        })();
        widgets.TextNode = TextNode;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
var mz;
(function (mz) {
    var dom;
    (function (dom) {
        function setRootDomAdapter(theAdapter) {
            if (!dom.adapter) {
                mz.scriptBase = theAdapter.getBaseHref() || '';
                dom.adapter = theAdapter;
            }
        }
        dom.setRootDomAdapter = setRootDomAdapter;
    })(dom = mz.dom || (mz.dom = {}));
})(mz || (mz = {}));
/// <reference path="../../mz.ts" />
/// <reference path="../DOM.ts" />
var mz;
(function (mz) {
    var dom;
    (function (dom) {
        /* tslint:disable:requireParameterType */
        /**
         * Provides DOM operations in an environment-agnostic way.
         */
        var AbstractDomAdapter = (function () {
            function AbstractDomAdapter() {
            }
            return AbstractDomAdapter;
        })();
        dom.AbstractDomAdapter = AbstractDomAdapter;
    })(dom = mz.dom || (mz.dom = {}));
})(mz || (mz = {}));
/// <reference path="DOM.ts" />
var mz;
(function (mz) {
    var dom;
    (function (dom) {
        var _attrToPropMap = {
            'class': 'className',
            'innerHtml': 'innerHTML',
            'readonly': 'readOnly',
            'tabindex': 'tabIndex'
        };
        var DOM_KEY_LOCATION_NUMPAD = 3;
        // Map to convert some key or keyIdentifier values to what will be returned by getEventKey
        var _keyMap = {
            // The following values are here for cross-browser compatibility and to match the W3C standard
            // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
            '\b': 'Backspace',
            '\t': 'Tab',
            '\x7F': 'Delete',
            '\x1B': 'Escape',
            'Del': 'Delete',
            'Esc': 'Escape',
            'Left': 'ArrowLeft',
            'Right': 'ArrowRight',
            'Up': 'ArrowUp',
            'Down': 'ArrowDown',
            'Menu': 'ContextMenu',
            'Scroll': 'ScrollLock',
            'Win': 'OS'
        };
        // There is a bug in Chrome for numeric keypad keys:
        // https://code.google.com/p/chromium/issues/detail?id=155654
        // 1, 2, 3 ... are reported as A, B, C ...
        var _chromeNumKeyPadMap = {
            'A': '1',
            'B': '2',
            'C': '3',
            'D': '4',
            'E': '5',
            'F': '6',
            'G': '7',
            'H': '8',
            'I': '9',
            'J': '*',
            'K': '+',
            'M': '-',
            'N': '.',
            'O': '/',
            '\x60': '0',
            '\x90': 'NumLock'
        };
        /**
         * Provides DOM operations in any browser environment.
         */
        var GenericBrowserDomAdapter = (function (_super) {
            __extends(GenericBrowserDomAdapter, _super);
            function GenericBrowserDomAdapter() {
                _super.call(this);
                this._animationPrefix = null;
                this._transitionEnd = null;
                try {
                    var element = this.createElement('div', this.defaultDoc());
                    if ((this.getStyle(element, 'animationName'))) {
                        this._animationPrefix = '';
                    }
                    else {
                        var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                        for (var i = 0; i < domPrefixes.length; i++) {
                            if ((this.getStyle(element, domPrefixes[i] + 'AnimationName'))) {
                                this._animationPrefix = '-' + (domPrefixes[i].toLowerCase()) + '-';
                                break;
                            }
                        }
                    }
                    var transEndEventNames = {
                        WebkitTransition: 'webkitTransitionEnd',
                        MozTransition: 'transitionend',
                        OTransition: 'oTransitionEnd otransitionend',
                        transition: 'transitionend'
                    };
                    for (var key in transEndEventNames) {
                        if (this.getStyle(element, key)) {
                            this._transitionEnd = transEndEventNames[key];
                        }
                    }
                    ;
                }
                catch (e) {
                    this._animationPrefix = null;
                    this._transitionEnd = null;
                }
            }
            GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) { return el.getDistributedNodes(); };
            GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
                el.href = href == null ? baseUrl : baseUrl + '/../' + href;
            };
            GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () { return true; };
            GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
                return typeof (this.defaultDoc().body.createShadowRoot) == "function";
            };
            GenericBrowserDomAdapter.prototype.getAnimationPrefix = function () {
                return (!!this._animationPrefix) ? this._animationPrefix : "";
            };
            GenericBrowserDomAdapter.prototype.getTransitionEnd = function () { return (!!this._transitionEnd) ? this._transitionEnd : ""; };
            GenericBrowserDomAdapter.prototype.supportsAnimation = function () {
                return (!!this._animationPrefix) && (!!this._transitionEnd);
            };
            GenericBrowserDomAdapter.prototype.getXHR = function () { return new XMLHttpRequest; };
            return GenericBrowserDomAdapter;
        })(dom.AbstractDomAdapter);
        dom.GenericBrowserDomAdapter = GenericBrowserDomAdapter;
        /* tslint:disable:requireParameterType */
        var BrowserDomAdapter = (function (_super) {
            __extends(BrowserDomAdapter, _super);
            function BrowserDomAdapter() {
                _super.apply(this, arguments);
            }
            BrowserDomAdapter.prototype.parse = function (templateHtml) { throw new Error("parse not implemented"); };
            BrowserDomAdapter.makeCurrent = function () { dom.setRootDomAdapter(new BrowserDomAdapter()); };
            BrowserDomAdapter.prototype.hasProperty = function (element, name) { return name in element; };
            BrowserDomAdapter.prototype.setProperty = function (el, name, value) { el[name] = value; };
            BrowserDomAdapter.prototype.getProperty = function (el, name) { return el[name]; };
            BrowserDomAdapter.prototype.invoke = function (el, methodName, args) {
                el[methodName].apply(el, args);
            };
            // TODO(tbosch): move this into a separate environment class once we have it
            BrowserDomAdapter.prototype.logError = function (error) {
                if (console.error) {
                    console.error(error);
                }
                else {
                    console.log(error);
                }
            };
            BrowserDomAdapter.prototype.log = function (error) { console.log(error); };
            BrowserDomAdapter.prototype.logGroup = function (error) {
                if (console.group) {
                    console.group(error);
                    this.logError(error);
                }
                else {
                    console.log(error);
                }
            };
            BrowserDomAdapter.prototype.logGroupEnd = function () {
                if (console.groupEnd) {
                    console.groupEnd();
                }
            };
            Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
                get: function () { return _attrToPropMap; },
                enumerable: true,
                configurable: true
            });
            BrowserDomAdapter.prototype.query = function (selector) { return document.querySelector(selector); };
            BrowserDomAdapter.prototype.querySelector = function (el, selector) { return el.querySelector(selector); };
            BrowserDomAdapter.prototype.querySelectorAll = function (el, selector) { return el.querySelectorAll(selector); };
            BrowserDomAdapter.prototype.on = function (el, evt, listener) { el.addEventListener(evt, listener, false); };
            BrowserDomAdapter.prototype.onAndCancel = function (el, evt, listener) {
                el.addEventListener(evt, listener, false);
                // Needed to follow Dart's subscription semantic, until fix of
                // https://code.google.com/p/dart/issues/detail?id=17406
                return function () { el.removeEventListener(evt, listener, false); };
            };
            BrowserDomAdapter.prototype.dispatchEvent = function (el, evt) { el.dispatchEvent(evt); };
            BrowserDomAdapter.prototype.createMouseEvent = function (eventType) {
                var evt = document.createEvent('MouseEvent');
                evt.initEvent(eventType, true, true);
                return evt;
            };
            BrowserDomAdapter.prototype.createEvent = function (eventType) {
                var evt = document.createEvent('Event');
                evt.initEvent(eventType, true, true);
                return evt;
            };
            BrowserDomAdapter.prototype.preventDefault = function (evt) {
                evt.preventDefault();
                evt.returnValue = false;
            };
            BrowserDomAdapter.prototype.isPrevented = function (evt) {
                return evt.defaultPrevented || !!(evt.returnValue) && !evt.returnValue;
            };
            BrowserDomAdapter.prototype.getInnerHTML = function (el) { return el.innerHTML; };
            BrowserDomAdapter.prototype.getOuterHTML = function (el) { return el.outerHTML; };
            BrowserDomAdapter.prototype.nodeName = function (node) { return node.nodeName; };
            BrowserDomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
            BrowserDomAdapter.prototype.type = function (node) { return node.type; };
            BrowserDomAdapter.prototype.content = function (node) {
                if (this.hasProperty(node, "content")) {
                    return node.content;
                }
                else {
                    return node;
                }
            };
            BrowserDomAdapter.prototype.firstChild = function (el) { return el.firstChild; };
            BrowserDomAdapter.prototype.nextSibling = function (el) { return el.nextSibling; };
            BrowserDomAdapter.prototype.parentElement = function (el) { return el.parentNode; };
            BrowserDomAdapter.prototype.childNodes = function (el) { return el.childNodes; };
            BrowserDomAdapter.prototype.childNodesAsList = function (el) {
                var childNodes = el.childNodes;
                var res = [];
                res.length = childNodes.length;
                for (var i = 0; i < childNodes.length; i++) {
                    res[i] = childNodes[i];
                }
                return res;
            };
            BrowserDomAdapter.prototype.clearNodes = function (el) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            };
            BrowserDomAdapter.prototype.appendChild = function (el, node) { el.appendChild(node); };
            BrowserDomAdapter.prototype.removeChild = function (el, node) { el.removeChild(node); };
            BrowserDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) { el.replaceChild(newChild, oldChild); };
            BrowserDomAdapter.prototype.remove = function (node) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
                return node;
            };
            BrowserDomAdapter.prototype.insertBefore = function (el, node) { el.parentNode.insertBefore(node, el); };
            BrowserDomAdapter.prototype.insertAllBefore = function (el, nodes) { nodes.forEach(function (n) { return el.parentNode.insertBefore(n, el); }); };
            BrowserDomAdapter.prototype.insertAfter = function (el, node) { el.parentNode.insertBefore(node, el.nextSibling); };
            BrowserDomAdapter.prototype.setInnerHTML = function (el, value) { el.innerHTML = value; };
            BrowserDomAdapter.prototype.getText = function (el) { return el.textContent; };
            // TODO(vicb): removed Element type because it does not support StyleElement
            BrowserDomAdapter.prototype.setText = function (el, value) { el.textContent = value; };
            BrowserDomAdapter.prototype.getValue = function (el) { return el.value; };
            BrowserDomAdapter.prototype.setValue = function (el, value) { el.value = value; };
            BrowserDomAdapter.prototype.getChecked = function (el) { return el.checked; };
            BrowserDomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
            BrowserDomAdapter.prototype.createComment = function (text) { return document.createComment(text); };
            BrowserDomAdapter.prototype.createTemplate = function (html) {
                var t = document.createElement('template');
                t.innerHTML = html;
                return t;
            };
            BrowserDomAdapter.prototype.createElement = function (tagName, doc) {
                if (doc === void 0) { doc = document; }
                return doc.createElement(tagName);
            };
            BrowserDomAdapter.prototype.createElementNS = function (ns, tagName, doc) {
                if (doc === void 0) { doc = document; }
                return doc.createElementNS(ns, tagName);
            };
            BrowserDomAdapter.prototype.createTextNode = function (text, doc) {
                if (doc === void 0) { doc = document; }
                return doc.createTextNode(text);
            };
            BrowserDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
                if (doc === void 0) { doc = document; }
                var el = doc.createElement('SCRIPT');
                el.setAttribute(attrName, attrValue);
                return el;
            };
            BrowserDomAdapter.prototype.createStyleElement = function (css, doc) {
                if (doc === void 0) { doc = document; }
                var style = doc.createElement('style');
                this.appendChild(style, this.createTextNode(css));
                return style;
            };
            BrowserDomAdapter.prototype.createShadowRoot = function (el) { return el.createShadowRoot(); };
            BrowserDomAdapter.prototype.getShadowRoot = function (el) { return el.shadowRoot; };
            BrowserDomAdapter.prototype.getHost = function (el) { return el.host; };
            BrowserDomAdapter.prototype.clone = function (node) { return node.cloneNode(true); };
            BrowserDomAdapter.prototype.getElementsByClassName = function (element, name) {
                return element.getElementsByClassName(name);
            };
            BrowserDomAdapter.prototype.getElementsByTagName = function (element, name) {
                return element.getElementsByTagName(name);
            };
            BrowserDomAdapter.prototype.classList = function (element) { return Array.prototype.slice.call(element.classList, 0); };
            BrowserDomAdapter.prototype.addClass = function (element, classname) { element.classList.add(classname); };
            BrowserDomAdapter.prototype.removeClass = function (element, classname) { element.classList.remove(classname); };
            BrowserDomAdapter.prototype.hasClass = function (element, classname) { return element.classList.contains(classname); };
            BrowserDomAdapter.prototype.setStyle = function (element, stylename, stylevalue) {
                element.style[stylename] = stylevalue;
            };
            BrowserDomAdapter.prototype.removeStyle = function (element, stylename) { element.style[stylename] = null; };
            BrowserDomAdapter.prototype.getStyle = function (element, stylename) { return element.style[stylename]; };
            BrowserDomAdapter.prototype.tagName = function (element) { return element.tagName; };
            BrowserDomAdapter.prototype.attributeMap = function (element) {
                var res = {};
                var elAttrs = element.attributes;
                for (var i = 0; i < elAttrs.length; i++) {
                    var attrib = elAttrs[i];
                    res[attrib.name] = attrib.value;
                }
                return res;
            };
            BrowserDomAdapter.prototype.hasAttribute = function (element, attribute) { return element.hasAttribute(attribute); };
            BrowserDomAdapter.prototype.getAttribute = function (element, attribute) { return element.getAttribute(attribute); };
            BrowserDomAdapter.prototype.setAttribute = function (element, name, value) { element.setAttribute(name, value); };
            BrowserDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) {
                element.setAttributeNS(ns, name, value);
            };
            BrowserDomAdapter.prototype.removeAttribute = function (element, attribute) { element.removeAttribute(attribute); };
            BrowserDomAdapter.prototype.templateAwareRoot = function (el) { return this.isTemplateElement(el) ? this.content(el) : el; };
            BrowserDomAdapter.prototype.createHtmlDocument = function () {
                return document.implementation.createHTMLDocument('fakeTitle');
            };
            BrowserDomAdapter.prototype.defaultDoc = function () { return document; };
            BrowserDomAdapter.prototype.getBoundingClientRect = function (el) {
                try {
                    return el.getBoundingClientRect();
                }
                catch (e) {
                    return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
                }
            };
            BrowserDomAdapter.prototype.getTitle = function () { return document.title; };
            BrowserDomAdapter.prototype.setTitle = function (newTitle) { document.title = newTitle || ''; };
            BrowserDomAdapter.prototype.elementMatches = function (n, selector) {
                var matches = false;
                if (n instanceof HTMLElement) {
                    if (n.matches) {
                        matches = n.matches(selector);
                    }
                    else if (n.msMatchesSelector) {
                        matches = n.msMatchesSelector(selector);
                    }
                    else if (n.webkitMatchesSelector) {
                        matches = n.webkitMatchesSelector(selector);
                    }
                }
                return matches;
            };
            BrowserDomAdapter.prototype.isTemplateElement = function (el) {
                return el instanceof HTMLElement && el.nodeName == "TEMPLATE";
            };
            BrowserDomAdapter.prototype.isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
            BrowserDomAdapter.prototype.isCommentNode = function (node) { return node.nodeType === Node.COMMENT_NODE; };
            BrowserDomAdapter.prototype.isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
            BrowserDomAdapter.prototype.hasShadowRoot = function (node) { return node instanceof HTMLElement && node.shadowRoot; };
            BrowserDomAdapter.prototype.isShadowRoot = function (node) { return node instanceof DocumentFragment; };
            BrowserDomAdapter.prototype.importIntoDoc = function (node) {
                var toImport = node;
                if (this.isTemplateElement(node)) {
                    toImport = this.content(node);
                }
                return document.importNode(toImport, true);
            };
            BrowserDomAdapter.prototype.adoptNode = function (node) { return document.adoptNode(node); };
            BrowserDomAdapter.prototype.getHref = function (el) { return el.href; };
            BrowserDomAdapter.prototype.getEventKey = function (event) {
                var key = event.key;
                if (!key) {
                    key = event.keyIdentifier;
                    // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
                    // Safari
                    // cf
                    // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
                    if (!key) {
                        return 'Unidentified';
                    }
                    if (key.startsWith('U+')) {
                        key = String.fromCharCode(parseInt(key.substring(2), 16));
                        if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                            // There is a bug in Chrome for numeric keypad keys:
                            // https://code.google.com/p/chromium/issues/detail?id=155654
                            // 1, 2, 3 ... are reported as A, B, C ...
                            key = _chromeNumKeyPadMap[key];
                        }
                    }
                }
                if (_keyMap.hasOwnProperty(key)) {
                    key = _keyMap[key];
                }
                return key;
            };
            BrowserDomAdapter.prototype.getGlobalEventTarget = function (target) {
                if (target == "window") {
                    return mz.globalContext.window;
                }
                else if (target == "document") {
                    return document;
                }
                else if (target == "body") {
                    return document.body;
                }
            };
            BrowserDomAdapter.prototype.getHistory = function () { return history; };
            BrowserDomAdapter.prototype.getLocation = function () { return location; };
            BrowserDomAdapter.prototype.getBaseHref = function () {
                var href = getBaseElementHref();
                if (!(href)) {
                    return null;
                }
                return relativePath(href);
            };
            BrowserDomAdapter.prototype.resetBaseElement = function () { baseElement = null; };
            BrowserDomAdapter.prototype.getUserAgent = function () { return navigator.userAgent; };
            BrowserDomAdapter.prototype.setData = function (element, name, value) {
                this.setAttribute(element, 'data-' + name, value);
            };
            BrowserDomAdapter.prototype.getData = function (element, name) { return this.getAttribute(element, 'data-' + name); };
            BrowserDomAdapter.prototype.getComputedStyle = function (element) { return getComputedStyle(element); };
            BrowserDomAdapter.prototype.requestAnimationFrame = function (callback) { return requestAnimationFrame(callback); };
            BrowserDomAdapter.prototype.cancelAnimationFrame = function (id) { cancelAnimationFrame(id); };
            BrowserDomAdapter.prototype.performanceNow = function () {
                // performance.now() is not available in all browsers, see
                // http://caniuse.com/#search=performance.now
                if (typeof performance != 'undefined' && performance.now) {
                    return performance.now();
                }
                else {
                    return (new Date).getTime() * 1000;
                }
            };
            return BrowserDomAdapter;
        })(GenericBrowserDomAdapter);
        dom.BrowserDomAdapter = BrowserDomAdapter;
        var baseElement = null;
        function getBaseElementHref() {
            if (!(baseElement)) {
                baseElement = document.querySelector('base');
                if (!(baseElement)) {
                    return null;
                }
            }
            return baseElement.getAttribute('href');
        }
        // based on urlUtils.js in AngularJS 1
        var urlParsingNode = null;
        function relativePath(url) {
            if (!(urlParsingNode)) {
                urlParsingNode = document.createElement("a");
            }
            urlParsingNode.setAttribute('href', url);
            return (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname :
                '/' + urlParsingNode.pathname;
        }
        BrowserDomAdapter.makeCurrent();
    })(dom = mz.dom || (mz.dom = {}));
})(mz || (mz = {}));
/// <reference path="../DOM.ts" />
/// <reference path="DOM_BrowserImpl.ts" />
var mz;
(function (mz) {
    var dom;
    (function (dom) {
        var microqueue;
        (function (microqueue) {
            var hasSetImmediate = typeof setImmediate === 'function';
            function makeRequestFlushFromMutationObserver(flush) {
                var toggle = 1;
                var observer = new (mz.globalContext.MutationObserver || mz.globalContext.WebKitMutationObserver)(flush);
                var node = dom.adapter.createTextNode('');
                observer.observe(node, { characterData: true });
                return function requestFlush() {
                    toggle = -toggle;
                    node.data = toggle.toString();
                };
            }
            function makeRequestFlushFromTimer(flush) {
                return function requestFlush() {
                    // We dispatch a timeout with a specified delay of 0 for engines that
                    // can reliably accommodate that request. This will usually be snapped
                    // to a 4 milisecond delay, but once we're flushing, there's no delay
                    // between events.
                    var timeoutHandle = setTimeout(handleFlushTimer, 0);
                    // However, since this timer gets frequently dropped in Firefox
                    // workers, we enlist an interval handle that will try to fire
                    // an event 20 times per second until it succeeds.
                    var intervalHandle = setInterval(handleFlushTimer, 50);
                    function handleFlushTimer() {
                        // Whichever timer succeeds will cancel both timers and request the
                        // flush.
                        clearTimeout(timeoutHandle);
                        clearInterval(intervalHandle);
                        flush();
                    }
                };
            }
            function onError(error) {
                if (hasSetImmediate) {
                    setImmediate(function () { throw error; });
                }
                else {
                    setTimeout(function () { throw error; }, 0);
                }
            }
            /**
            * Implements an asynchronous task queue.
            */
            var MicroTaskQueue = (function () {
                function MicroTaskQueue() {
                    var _this = this;
                    /**
                     * Creates an instance of TaskQueue.
                    */
                    this.microTaskQueue = [];
                    this.taskQueue = [];
                    this.microTaskQueueCapacity = 1024;
                    if (mz.globalContext.MutationObserver || mz.globalContext.WebKitMutationObserver) {
                        this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function () { return _this.flushMicroTaskQueue(); });
                    }
                    else {
                        this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function () { return _this.flushMicroTaskQueue(); });
                    }
                }
                /**
                 * Queues a task on the micro task queue for ASAP execution.
                * @param task The task to queue up for ASAP execution.
                */
                MicroTaskQueue.prototype.queueMicroTask = function (task) {
                    if (this.microTaskQueue.length < 1) {
                        this.requestFlushMicroTaskQueue();
                    }
                    this.microTaskQueue.push(task);
                };
                /**
                 * Immediately flushes the micro task queue.
                */
                MicroTaskQueue.prototype.flushMicroTaskQueue = function () {
                    var queue = this.microTaskQueue;
                    var capacity = this.microTaskQueueCapacity;
                    var index = 0;
                    var task;
                    try {
                        while (index < queue.length) {
                            task = queue[index];
                            switch (task.type) {
                                case MicroQueueOpKind.APPEND:
                                    dom.adapter.appendChild(task.destination, task.parameters);
                                    break;
                                case MicroQueueOpKind.DETACH:
                                    dom.adapter.remove(task.destination);
                                    break;
                                case MicroQueueOpKind.SET_TEXT:
                                    if (task.destination.textContent != task.parameters)
                                        dom.adapter.setText(task.destination, task.parameters);
                                    break;
                                case MicroQueueOpKind.SET_ATTR:
                                    dom.adapter.setAttribute(task.destination, task.parameters[0], task.parameters[1]);
                                    break;
                                case MicroQueueOpKind.CALLBACK:
                                    task.destination();
                                    break;
                            }
                            index++;
                            // Prevent leaking memory for long chains of recursive calls to `queueMicroTask`.
                            // If we call `queueMicroTask` within a MicroTask scheduled by `queueMicroTask`, the queue will
                            // grow, but to avoid an O(n) walk for every MicroTask we execute, we don't
                            // shift MicroTasks off the queue after they have been executed.
                            // Instead, we periodically shift 1024 MicroTasks off the queue.
                            if (index > capacity) {
                                // Manually shift all values starting at the index back to the
                                // beginning of the queue.
                                for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                                    queue[scan] = queue[scan + index];
                                }
                                queue.length -= index;
                                index = 0;
                            }
                        }
                    }
                    catch (error) {
                        onError(error);
                    }
                    queue.length = 0;
                };
                return MicroTaskQueue;
            })();
            var MicroQueueOpKind;
            (function (MicroQueueOpKind) {
                MicroQueueOpKind[MicroQueueOpKind["APPEND"] = 0] = "APPEND";
                MicroQueueOpKind[MicroQueueOpKind["DETACH"] = 1] = "DETACH";
                MicroQueueOpKind[MicroQueueOpKind["SET_TEXT"] = 2] = "SET_TEXT";
                MicroQueueOpKind[MicroQueueOpKind["SET_ATTR"] = 3] = "SET_ATTR";
                MicroQueueOpKind[MicroQueueOpKind["CALLBACK"] = 4] = "CALLBACK";
            })(MicroQueueOpKind || (MicroQueueOpKind = {}));
            microqueue.enabled = true;
            var theMicroDomTaskQueue = new MicroTaskQueue;
            function flush() {
                theMicroDomTaskQueue.flushMicroTaskQueue();
            }
            microqueue.flush = flush;
            function appendChild(el, node) {
                if (!microqueue.enabled) {
                    dom.adapter.appendChild(el, node);
                    return;
                }
                theMicroDomTaskQueue.queueMicroTask({
                    type: MicroQueueOpKind.APPEND,
                    destination: el,
                    parameters: node
                });
            }
            microqueue.appendChild = appendChild;
            function callback(cb) {
                if (!microqueue.enabled) {
                    cb();
                }
                theMicroDomTaskQueue.queueMicroTask({
                    type: MicroQueueOpKind.CALLBACK,
                    destination: cb
                });
            }
            microqueue.callback = callback;
            function remove(el) {
                if (!microqueue.enabled) {
                    dom.adapter.remove(el);
                    return;
                }
                theMicroDomTaskQueue.queueMicroTask({
                    type: MicroQueueOpKind.DETACH,
                    destination: el
                });
            }
            microqueue.remove = remove;
            function setText(el, text) {
                if (!microqueue.enabled) {
                    dom.adapter.setText(el, text);
                    return;
                }
                theMicroDomTaskQueue.queueMicroTask({
                    type: MicroQueueOpKind.SET_TEXT,
                    destination: el,
                    parameters: text
                });
            }
            microqueue.setText = setText;
            function setAttribute(el, attr, value) {
                if (!microqueue.enabled) {
                    dom.adapter.setAttribute(el, attr, value);
                    return;
                }
                theMicroDomTaskQueue.queueMicroTask({
                    type: MicroQueueOpKind.SET_ATTR,
                    destination: el,
                    parameters: [attr, value]
                });
            }
            microqueue.setAttribute = setAttribute;
        })(microqueue = dom.microqueue || (dom.microqueue = {}));
    })(dom = mz.dom || (mz.dom = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
/// <reference path="Tmpl.ts" />
/// <reference path="Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="../CORE/Decorators.ts" />
/// <reference path="TextNode.ts" />
/// <reference path="../CORE/DOM/MicroQueue.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var mz;
(function (mz) {
    var AttributeDirective = (function () {
        function AttributeDirective(widget, component, value) {
            this.widget = widget;
            this.component = component;
            this.value = value;
            this.mount();
        }
        AttributeDirective.prototype.mount = function () {
        };
        AttributeDirective.prototype.unmount = function () {
            delete this.widget;
            delete this._value;
        };
        AttributeDirective.prototype.changed = function (value, prevValue) {
        };
        Object.defineProperty(AttributeDirective.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (value !== this._value) {
                    var prevValue = this._value;
                    this._value = value;
                    this.changed(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        return AttributeDirective;
    })();
    mz.AttributeDirective = AttributeDirective;
    var AttributeDirective;
    (function (AttributeDirective) {
        function Register(attrName) {
            return function (target) {
                var lowerCaseName = attrName.toLowerCase();
                if (lowerCaseName in AttributeDirective.directives) {
                    console.warn("There is alredy a directive for '" + lowerCaseName + "'. It would be replaced.");
                }
                AttributeDirective.directives[lowerCaseName] = target;
            };
        }
        AttributeDirective.Register = Register;
        AttributeDirective.directives = {};
    })(AttributeDirective = mz.AttributeDirective || (mz.AttributeDirective = {}));
    var templateCache = {};
    var paramRegex = /^__(\d+)$/;
    var tieneLlaves = /\{|\}/;
    var testScope = /^{scope\./;
    var containsScope = /[\{|\s|\(|\[]scope[\.|\s|\[|\(]/;
    var parser = new DOMParser();
    var errorDoc, errorNs;
    try {
        errorDoc = parser.parseFromString('INVALID', 'text/xml');
        errorNs = errorDoc.getElementsByTagName("parsererror")[0].namespaceURI;
    }
    catch (e) { }
    // turns the array of string parts into a DOM
    // throws if the result is an invalid XML document.
    function quasiToDom(parts) {
        // turn ["<div class='", "'>Hi</div>"]
        // into "<div class='__0'>Hi</div>"
        var xmlstr = parts.reduce(function (xmlstr, part, i) {
            xmlstr += part;
            if (i != parts.length - 1) {
                xmlstr += "__" + i;
            }
            return xmlstr;
        }, "");
        // parse into DOM, check for a parse error
        // browser's DOMParser is neat, but error handling is awful
        var doc = parser.parseFromString(xmlstr, 'text/xml');
        var errors = doc.getElementsByTagNameNS(errorNs, 'parsererror');
        var error = '';
        if (errors.length > 0) {
            error = errors[0].textContent.split('\n')[0];
            throw "invalid jsx: " + error + "\n" + xmlstr;
        }
        return doc;
    }
    var lonelyProperty = /^\{([A-Za-z0-9_$\-]+)\}$/;
    var lonelyPropertyThis = /^\{this\.([A-Za-z0-9_$\-]+)\}$/;
    /**
    * Esta función es usada para bindear un atributo a los cambios de MVCObject que pueden llegar a modificar el valor del atributo
    */
    function bindWidgetAttr(attrName, attrValue, observable, widget, scope) {
        var match;
        // attr="{hola}" 
        // mando directamente Val(hola) a el atributo
        if ((match = lonelyProperty.exec(attrValue)) || (match = lonelyPropertyThis.exec(attrValue))) {
            return observable.on(match[1] + '_changed', function (a, b) {
                if (a !== b) {
                    if (widget.attr(attrName) != a)
                        widget.attr(attrName, a);
                }
            });
        }
        else {
            return observable.on('valueChanged', function (data, elem, a, b) {
                if (a !== b && attrValue.indexOf(elem) != -1) {
                    var t = mz.view.tmpl(attrValue, observable, scope);
                    if (widget.attr(attrName) != t)
                        widget.attr(attrName, t);
                }
            });
        }
    }
    var boolAttrs = ('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,' +
        'defaultchecked,defaultmuted,defaultselected,defer,disabled,draggable,enabled,formnovalidate,hidden,' +
        'indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,' +
        'pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,spellcheck,translate,truespeed,' +
        'typemustmatch,visible').split(',');
    boolAttrs.forEach(function (a) { return boolAttrs[a] = true; });
    /**
    * Local template's document caché
    */
    mz.widgetTemplateSource = {};
    var tmpl_pointer = mz.view.tmpl;
    function domToWidgets(node, params, component, scope) {
        var match;
        // text node, comment, etc
        if (node instanceof CDATASection) {
            return mz.dom.adapter.createTextNode(node.nodeValue);
        }
        if (node.nodeValue) {
            var value = node.nodeValue;
            if (value.trim().length === 0) {
                return;
            }
            match = value.match(paramRegex);
            if (match)
                return params[parseInt(match[1])];
            // detect if we have {} on the text
            if (tieneLlaves.test(value)) {
                var childWidget = mz.widgets.TextNode.getFromPoll(value, component, scope);
                // We don't mess with "{scope.hola}" expr
                // But we do with 
                if (component && !(testScope.test(value))) {
                    // If the expr is "{prop}" or "{this.prop}" we assume a proxy
                    if ((match = lonelyProperty.exec(value)) || (match = lonelyPropertyThis.exec(value))) {
                        childWidget.listening.push(component.on(match[1] + '_changed', function (a, b) {
                            if (a != b) {
                                if (typeof a === "undefined" || a === null)
                                    a = '';
                                //if (childWidget.rootNode.textContent != a)
                                //    childWidget.rootNode.textContent = a;
                                mz.dom.microqueue.setText(childWidget.rootNode, a);
                            }
                        }));
                    }
                    else {
                        // catch other samples, ex: "$ {this.value + scope.value} {currency}"
                        childWidget.listening.push(component.on('valueChanged', function (data, elem, a, b) {
                            if (a != b && value.indexOf(elem) != -1) {
                                var t = mz.view.tmpl(value, component, scope);
                                if (typeof t === "undefined" || t === null)
                                    t = '';
                                //if (childWidget.rootNode.textContent != t) {
                                //    childWidget.rootNode.textContent = t;
                                //}
                                mz.dom.microqueue.setText(childWidget.rootNode, t);
                            }
                        }));
                    }
                }
                return childWidget;
            }
            if (typeof value == "string")
                return document.createTextNode(value);
            return value;
        }
        var widgetCtor;
        match = node.localName.match(paramRegex);
        widgetCtor = match ? params[parseInt(match[1])] : mz.widgets[node.localName.toLowerCase()];
        var name = null;
        // attributes of the node
        var attrs = {};
        /**
         * Guardo en este diccionario los atributos del widget que puedo llegar a bindear al objeto (los que tienne llaves)
         * */
        var bindeableAttrs = {};
        var listenersConLlaves = [];
        for (var i = node.attributes.length - 1; i >= 0; i--) {
            var attr = node.attributes[i];
            attrs[attr.name] = attr.value;
            match = attr.value.match(paramRegex);
            // __0, __1
            if (match) {
                attrs[attr.name] = params[parseInt(match[1])];
            }
            else {
                if (typeof attr.value === "string") {
                    attrs[attr.name] = mz.view.tmpl(attr.value, component, scope);
                    if (typeof attrs[attr.name] === "function") {
                        attrs[attr.name] = attrs[attr.name].bind(component);
                    }
                    else if (tieneLlaves.test(attr.value)) {
                        bindeableAttrs[attr.name] = attr.value;
                        listenersConLlaves.push({
                            name: attr.name,
                            fn: (function (value, component, scope) {
                                return function () {
                                    return tmpl_pointer(value, component, scope);
                                };
                            })(attr.value, component, scope)
                        });
                    }
                }
            }
            if (attr.name == 'name') {
                name = attrs[attr.name];
            }
            if (attr.name == 'scope') {
                scope = attrs[attr.name];
            }
        }
        widgetCtor = widgetCtor || mz.widgets.BaseElement;
        var hijos = widgetCtor.EMPTY_TAG ? [] : getChildNodes(node, params, component, scope);
        var ret = new widgetCtor(node, attrs, hijos, params, component, scope);
        if (listenersConLlaves.length)
            ret.mustUpdateOnScopeChange = listenersConLlaves;
        for (var at in bindeableAttrs) {
            if (typeof bindeableAttrs[at] == "string" && component)
                ret.listening.push(bindWidgetAttr(at, bindeableAttrs[at], component, ret, scope));
        }
        if (node.nodeName == "content" && (!component._contentSelector || component._contentSelector == "content")) {
            component.contentNode = ret.rootNode;
        }
        if (name && component) {
            component[name] = ret;
        }
        return ret;
    }
    function getChildNodes(node, params, component, scope) {
        // recursively turn children into components
        var childNodes = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var childWidget = domToWidgets(node.childNodes[i], params, component, scope);
            if (childWidget) {
                childNodes.push(childWidget);
            }
        }
        return childNodes;
    }
    function getJQueryEventWrapper(originalCallback, widget) {
        return function (event) {
            var eventObject = {
                event: event.originalEvent,
                data: widget.scope,
                element: widget.rootNode
            };
            return originalCallback.call(widget, eventObject);
        };
    }
    function errorLoadingTemplate(ev) {
        console.error("Error loading template. ", this, ev);
    }
    var regexpOn = /^on[_]{0,1}(.*)$/;
    var regexpAttrBinded = /^:(.*)_upd$/;
    var ignoredAttrs = { tag: 1 };
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(originalNode, attr, children, _params, _parentComponent, scope) {
            var _this = this;
            if (_params === void 0) { _params = null; }
            if (_parentComponent === void 0) { _parentComponent = null; }
            _super.call(this);
            this._params = _params;
            this._parentComponent = _parentComponent;
            this.listening = [];
            this.innerWidget = null;
            this.originalNode = originalNode;
            this.contentFragment = document.createDocumentFragment();
            this.contentNode = this.rootNode = document.createElement(attr && attr["tag"] || originalNode && originalNode.nodeName || this["constructor"].nodeName || this["constructor"].name || 'div');
            this.rootNode.$widget = this;
            this.rootNode.$component = _parentComponent;
            this.scope = scope || null;
            this.children = children;
            if (this.defaultTemplate) {
                this.startComponent([this.defaultTemplate]);
                mz.dom.microqueue.callback(function () { return _this.emit(Widget.EVENTS.ComponentMounted); });
            }
            if (attr) {
                this.initAttr(attr);
            }
            if (this.defaultTemplate) {
                this.appendChildrens();
            }
        }
        Widget.prototype.scope_changed = function (scope) {
            this.rootNode.$scope = scope;
        };
        Object.defineProperty(Widget.prototype, "DOM", {
            get: function () {
                return this._cachedDOM || (this._cachedDOM = $(this.rootNode));
            },
            enumerable: true,
            configurable: true
        });
        Widget.prototype.generateScopedContent = function (scope) {
            return getChildNodes(this.originalNode, this._params, this._parentComponent, scope || this);
        };
        Widget.prototype.attr = function (attrName, value) {
            var attrNameLower = attrName.toLowerCase();
            if (arguments.length == 1) {
                if (this.attrDirectives && attrNameLower in this.attrDirectives)
                    return this.attrDirectives[attrNameLower].value;
                return this.data[attrName];
            }
            else {
                var boolAttr = attrNameLower in boolAttrs;
                var typeofValue = typeof value;
                if (boolAttr) {
                    if (typeofValue === "function")
                        value = value();
                    value = mz.CBool(value);
                    typeofValue = "boolean";
                }
                this.set(attrName, value);
                if (attrNameLower in AttributeDirective.directives && AttributeDirective.directives[attrNameLower]) {
                    if (!this.attrDirectives)
                        this.attrDirectives = {};
                    if (attrNameLower in this.attrDirectives)
                        this.attrDirectives[attrNameLower].value = value;
                    else
                        this.attrDirectives[attrNameLower] = new AttributeDirective.directives[attrNameLower](this, this._parentComponent, value);
                }
                else if (boolAttr) {
                    if (value) {
                        if (!mz.dom.adapter.hasAttribute(this.rootNode, attrName))
                            mz.dom.adapter.setAttribute(this.rootNode, attrName, attrName);
                    }
                    else {
                        if (mz.dom.adapter.hasAttribute(this.rootNode, attrName))
                            mz.dom.adapter.removeAttribute(this.rootNode, attrName);
                    }
                }
                else if (regexpOn.test(attrName) && typeofValue === "function") {
                    var cbName = regexpOn.exec(attrName)[1];
                    if (/^on_/.test(attrName))
                        this.listening.push(this.on(cbName, value));
                    else
                        this.DOM.on(cbName, getJQueryEventWrapper(value, this));
                }
                else {
                    if ((typeofValue === "string" || typeofValue === "number" || typeofValue === "boolean") && !(/^:/.test(attrName))) {
                        if (attrNameLower in ignoredAttrs)
                            return;
                        mz.dom.microqueue.setAttribute(this.rootNode, attrName, value);
                    }
                }
            }
        };
        Widget.prototype.refreshScope = function () {
            // the attrs who has the form ":(attName)_upd" (regexpAttrBinded) are attr generators for "attrName"
            if (this.mustUpdateOnScopeChange) {
                for (var i = 0; i < this.mustUpdateOnScopeChange.length; i++) {
                    var e = this.mustUpdateOnScopeChange[i];
                    this.attr(e.name, e.fn());
                }
            }
            for (var index = 0; index < this.children.length; index++) {
                var e = this.children[index];
                if (e && typeof e == "object") {
                    e.refreshScope && e.refreshScope();
                }
            }
        };
        // Finds an element within this component
        Widget.prototype.find = function (selector) {
            mz.dom.microqueue.flush();
            return mz.dom.adapter.querySelectorAll(this.rootNode, selector);
        };
        Widget.prototype.loadTemplate = function (url, forceSync) {
            var _this = this;
            if (forceSync === void 0) { forceSync = false; }
            if (url in mz.widgetTemplateSource) {
                this.startComponent(mz.widgetTemplateSource[url]);
                this.componentInitialized();
                //this.emit(Widget.EVENTS.ComponentMounted);
                //requestAnimationFrame(() => this.resize());
                mz.dom.microqueue.callback(function () {
                    _this.resize();
                    _this.emit(Widget.EVENTS.ComponentMounted);
                });
                return;
            }
            var xhr = new XMLHttpRequest();
            var transformedUrl = mz.getPath(url);
            xhr.addEventListener('load', function (ev) {
                if (xhr.responseXML && xhr.responseXML instanceof Document) {
                    mz.widgetTemplateSource[url] = xhr.responseXML;
                    _this.startComponent(xhr.responseXML);
                    _this.componentInitialized();
                    //this.emit(Widget.EVENTS.ComponentMounted);
                    mz.dom.microqueue.callback(function () {
                        _this.resize();
                        _this.emit(Widget.EVENTS.ComponentMounted);
                    });
                }
                else if (xhr.responseText && xhr.responseText.length) {
                    mz.widgetTemplateSource[url] = [xhr.responseText];
                    _this.startComponent([xhr.responseText], []);
                    _this.componentInitialized();
                    //this.emit(Widget.EVENTS.ComponentMounted);
                    mz.dom.microqueue.callback(function () {
                        _this.resize();
                        _this.emit(Widget.EVENTS.ComponentMounted);
                    });
                }
                else {
                    throw new TypeError("Unexpected response for mz.Widget.loadTemplate. Url: " + transformedUrl + ' (' + url + ')');
                }
            });
            xhr.onerror = errorLoadingTemplate;
            xhr.open("GET", transformedUrl, !forceSync);
            xhr.send();
        };
        Widget.prototype.componentInitialized = function () {
        };
        Widget.prototype.startComponent = function (parts) {
            var _this = this;
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (parts) {
                var doc = parts instanceof Array ? quasiToDom(parts) : parts;
                params = params || [];
                params.forEach(function (e, i) {
                    if (typeof e === "function")
                        params[i] = e.bind(_this);
                });
                if (doc.childNodes.length > 1)
                    console.warn("Only one child node is allowed per widget.", doc, this);
                this.innerWidget = domToWidgets(doc.firstChild, params, this, this.scope);
            }
            if (this._unwrapedComponent) {
                var originalNode = this.rootNode;
                if (this.innerWidget) {
                    this.rootNode = this.innerWidget.rootNode;
                    if (this.rootNode != originalNode) {
                        for (var i = 0; i < originalNode.attributes.length; i++) {
                            var attrib = originalNode.attributes[i];
                            if (!('specified' in attrib) || attrib.specified) {
                                if (attrib.name.toLowerCase() == "class")
                                    mz.dom.adapter.addClass(this.rootNode, attrib.value);
                                else
                                    mz.dom.adapter.setAttribute(this.rootNode, attrib.name, attrib.value);
                            }
                        }
                        if (originalNode && originalNode.parentElement) {
                            mz.dom.adapter.replaceChild(originalNode.parentElement, this.rootNode, originalNode);
                        }
                    }
                }
            }
            else {
                this.innerWidget && mz.dom.adapter.appendChild(this.rootNode, this.innerWidget.rootNode);
            }
            if (!this.contentNode)
                this.contentNode = this.rootNode || this.contentNode;
            var apendeado = false;
            if (this._contentSelector)
                apendeado = this.findContentSelector();
            if (!apendeado)
                this.appendChildrens();
            return this.innerWidget;
        };
        Widget.prototype.appendChildrens = function () {
            var _this = this;
            this.children.forEach(function (element) {
                if (element && typeof element == "object") {
                    if ('rootNode' in element && element.rootNode instanceof Node)
                        _this.contentFragment.appendChild(element.rootNode);
                    else if ('DOM' in element && element.DOM)
                        element.DOM.appendTo(_this.contentFragment);
                    else if ('node' in element && element.node)
                        _this.contentFragment.appendChild(element.node);
                    else if (element instanceof Node)
                        _this.contentFragment.appendChild(element);
                    else if (mz._debug)
                        console.warn("Trying to add unknown child ", element, " to Widget!", _this);
                }
                else if (element && typeof element == "string" && element.length > 0) {
                    _this.contentFragment.appendChild(document.createTextNode(element));
                }
            });
            if (this.contentNode) {
                this.contentNode.appendChild(this.contentFragment);
            }
            else if (this.contentFragment.firstChild) {
                console.error("There is child elements on a Widget with wrong or without contentSelector ", this);
            }
        };
        Widget.prototype.findContentSelector = function () {
            var prevContent = this.contentNode;
            this.contentNode = this._contentSelector == ":root" ? this.rootNode : mz.dom.adapter.querySelector(this.rootNode, this._contentSelector);
            if (prevContent !== this.contentNode && this.contentNode) {
                this.appendChildrens();
                return true;
            }
            return false;
        };
        Widget.prototype.append = function (element) {
            if (element && typeof element == "object") {
                if (element instanceof Node) {
                    this.contentNode.appendChild(element);
                }
                else if (element instanceof Widget) {
                    this.contentNode.appendChild(element.rootNode);
                }
                else if (element instanceof mz.widgets.TextNode) {
                    this.contentNode.appendChild(element.rootNode);
                }
                else if (element instanceof $) {
                    return element.appendTo($(this.contentNode));
                }
                else if ('DOM' in element && element.DOM instanceof $) {
                    return element.DOM.appendTo($(this.contentNode));
                }
                else {
                    return this.contentNode && $(element).appendTo(this.contentNode);
                }
            }
        };
        Widget.prototype.appendTo = function (element) {
            if (element && element instanceof Widget) {
                return element.append(this);
            }
            else if (element && typeof element == "object" && 'DOM' in element && element.DOM instanceof $) {
                return element.DOM.append(this.rootNode);
            }
            else if (element && element instanceof $) {
                return element.append(this.rootNode);
            }
            else {
                return $(element).append(this.rootNode);
            }
        };
        Widget.prototype.initAttr = function (attr) {
            if (attr) {
                for (var i in attr) {
                    this.attr(i, attr[i]);
                }
            }
        };
        /**
         * Resizes the current widget, it also sends a signal "resize" to all the childrens
         */
        Widget.prototype.resize = function () {
            this.emit(Widget.EVENTS.ComponentResized);
            this.innerWidget && this.innerWidget.resize && this.innerWidget.resize();
            this.children.forEach(function (e) { return e && typeof e == 'object' && e.resize && e.resize(); });
        };
        /**
         *  Destroys the current widget and it's children
         */
        Widget.prototype.unmount = function () {
            if (this.attrDirectives)
                for (var i in this.attrDirectives)
                    ('unmount' in this.attrDirectives) && this.attrDirectives[i].unmount();
            mz.dom.adapter.remove(this.rootNode);
            this._cachedDOM && this._cachedDOM.remove();
            this.emit(Widget.EVENTS.ComponentUnmounted);
            this.off();
            for (var _i = 0, _a = this.listening; _i < _a.length; _i++) {
                var i = _a[_i];
                i && i.off && i.off();
            }
            this.listening.length = 0;
            delete this.data;
            for (var _b = 0, _c = this.children; _b < _c.length; _b++) {
                var e = _c[_b];
                if ('unmount' in e)
                    e.unmount();
            }
            this.children.length = 0;
        };
        Widget.RegisterComponent = function (componentName) {
            return function (target) {
                if (componentName.toLowerCase() in mz.widgets)
                    console.warn("Component ", componentName, " alredy registered");
                target.nodeName = componentName;
                mz.widgets[componentName.toLowerCase()] = target;
            };
        };
        Widget.ConfigureEmptyTag = function (target) {
            target.EMPTY_TAG = true;
        };
        Widget.Template = function (template, contentSelector) {
            return function (target) {
                target.prototype.defaultTemplate = template;
                if (contentSelector && contentSelector.length)
                    target.prototype._contentSelector = contentSelector;
            };
        };
        Widget.ConfigureUnwrapped = function (target) {
            target.prototype._unwrapedComponent = true;
        };
        Widget.ConfigureTag = function (tagName) {
            return function (target) {
                target.prototype.tagName = true;
            };
        };
        Widget.Attribute = function (target, propertyKey) {
            if (delete target[propertyKey]) {
                var propertyKeyString = propertyKey.toString();
                Object.defineProperty(target, propertyKey.toString(), {
                    get: function () {
                        return this.attr(propertyKey);
                    },
                    set: function (value) {
                        this.attr(propertyKey, value);
                    },
                    enumerable: true
                });
            }
        };
        Widget.EMPTY_TAG = false;
        Widget.props = {};
        Widget.nodeName = null;
        Widget.EVENTS = mz.copy({
            ComponentUnmounted: 'unmount',
            ComponentResized: 'resize',
            ComponentMounted: 'mount'
        }, mz.MVCObject.EVENTS);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Object)
        ], Widget.prototype, "scope", void 0);
        return Widget;
    })(mz.MVCObject);
    mz.Widget = Widget;
})(mz || (mz = {}));
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var BaseElement = (function (_super) {
            __extends(BaseElement, _super);
            function BaseElement(rootNode, attr, children, _params, _parentComponent, scope) {
                if (_params === void 0) { _params = null; }
                if (_parentComponent === void 0) { _parentComponent = null; }
                if (scope === void 0) { scope = null; }
                if (rootNode)
                    attr['tag'] = rootNode.nodeName;
                _super.call(this, rootNode, attr, children, _params, _parentComponent, scope);
                this.appendChildrens();
            }
            return BaseElement;
        })(mz.Widget);
        widgets.BaseElement = BaseElement;
        var BasePagelet = (function (_super) {
            __extends(BasePagelet, _super);
            function BasePagelet(attr) {
                _super.call(this, null, attr || {}, [], this, this, null);
            }
            return BasePagelet;
        })(mz.Widget);
        widgets.BasePagelet = BasePagelet;
        var InlinePagelet = (function (_super) {
            __extends(InlinePagelet, _super);
            function InlinePagelet(template, attr) {
                _super.call(this, null, attr || {}, [], this, this, null);
                this.startComponent([template]);
            }
            return InlinePagelet;
        })(mz.Widget);
        widgets.InlinePagelet = InlinePagelet;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../view/Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var MzSwitcher = (function (_super) {
            __extends(MzSwitcher, _super);
            function MzSwitcher(rootNode, attr, children, a, b, scope) {
                var _this = this;
                _super.call(this, rootNode, attr, [], a, b, scope);
                this.panels = new mz.Collection();
                var first = null;
                // Set the parent panel to the children
                children.forEach(function (child) {
                    if (child instanceof MzSwitcherPanel) {
                        first = first || child;
                        child.parent = _this;
                    }
                });
                if (first)
                    this.show(first);
            }
            MzSwitcher.prototype.show = function (panel) {
                if (!panel)
                    return;
                if (this.panelVisible === panel)
                    return;
                if (!this.panels.contains(panel)) {
                    this.panels.push(panel);
                    panel.appendTo(this.contentNode);
                    if (panel instanceof MzSwitcherPanel) {
                        panel.parent = this;
                    }
                }
                if (this.panelVisible) {
                    mz.dom.adapter.remove(this.panelVisible.rootNode);
                }
                this.panelVisible = panel;
                mz.dom.adapter.appendChild(this.contentNode, this.panelVisible.rootNode);
                this.panelVisible.show();
                panel.resize();
            };
            MzSwitcher.prototype.resize = function () {
                if (this.panelVisible) {
                    this.panelVisible.resize();
                }
                _super.prototype.resize.call(this);
            };
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', MzSwitcherPanel)
            ], MzSwitcher.prototype, "panelVisible", void 0);
            MzSwitcher = __decorate([
                mz.Widget.RegisterComponent("mz-switcher"), 
                __metadata('design:paramtypes', [Node, Object, Array, Object, Object, Object])
            ], MzSwitcher);
            return MzSwitcher;
        })(mz.Widget);
        widgets.MzSwitcher = MzSwitcher;
        var MzSwitcherPanel = (function (_super) {
            __extends(MzSwitcherPanel, _super);
            function MzSwitcherPanel() {
                _super.apply(this, arguments);
            }
            MzSwitcherPanel.prototype.show = function () {
                if (this.parent)
                    this.parent.show(this);
            };
            MzSwitcherPanel.prototype.isVisible = function () {
                return this.DOM.is(':visible');
            };
            MzSwitcherPanel = __decorate([
                mz.Widget.RegisterComponent("mz-switcher-panel"), 
                __metadata('design:paramtypes', [])
            ], MzSwitcherPanel);
            return MzSwitcherPanel;
        })(mz.Widget);
        widgets.MzSwitcherPanel = MzSwitcherPanel;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../WIDGETS/mz-switcher.ts" />
var mz;
(function (mz) {
    var app;
    (function (app) {
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page(appController) {
                _super.call(this, null, { tag: 'div', }, [], this, this, this);
                this.routeHandler = {};
                this.parent = appController;
            }
            Page.prototype.handleRoute = function (routeName) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
            };
            Page.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this);
                this.parent.actualPage = this;
                requestAnimationFrame(function () { return _this.resize(); });
                // phonegap!
                document.addEventListener("resetScrollView", function () {
                    _this.resize();
                });
            };
            return Page;
        })(mz.widgets.MzSwitcherPanel);
        app.Page = Page;
        var PageCoordinator = (function (_super) {
            __extends(PageCoordinator, _super);
            function PageCoordinator(opc) {
                var _this = this;
                _super.call(this, null, { tag: 'div', class: 'mz-page-coordinator' }, [], this, this, undefined);
                this.loadingPage = true;
                this.pages = opc.pagesCollection || new mz.Collection(null, { key: "name" });
                if (opc.templateHtml && opc.templateUrl) {
                    throw new Error("You must set only templateUrl or templateHtml, not both.");
                }
                if (!opc.pages) {
                    throw new Error("You must provide 'pages: Url(.json) | Array[]' option.");
                }
                if (typeof opc.pages == "string") {
                    mz.xr.get(opc.pages).then(function (x) { return _this.setPages(x.data); });
                }
                else if (opc.pages instanceof Array) {
                    this.setPages(opc.pages);
                }
                else {
                    throw new TypeError("opc.pages must be an Array or Url(.json)");
                }
                if (opc.templateHtml)
                    this.startComponent([opc.templateHtml]);
                else if (opc.templateUrl)
                    this.loadTemplate(opc.templateUrl);
                else
                    $(function () {
                        var frag = document.createElement("app");
                        frag.appendChild(document.querySelector(opc.templateSelector || "body *"));
                        _this.startComponent(frag);
                    });
                $(function () {
                    _this.appendTo("body");
                });
            }
            PageCoordinator.prototype.setPages = function (pages) {
                var _this = this;
                var routes = {};
                var bindRoutes = {};
                this.pages.clear();
                for (var _i = 0; _i < pages.length; _i++) {
                    var page = pages[_i];
                    if (page.routes && page.routes.length) {
                        for (var _a = 0, _b = page.routes; _a < _b.length; _a++) {
                            var route_1 = _b[_a];
                            if (route_1.route in bindRoutes)
                                console.warn("Route " + route_1.route + " duplicated on page " + page.name + ".");
                            routes[route_1.name] = {
                                page: page,
                                route: route_1.route,
                                name: route_1.name
                            };
                            bindRoutes[route_1.route] = route_1.name;
                        }
                    }
                    this.pages.push(page);
                }
                var routerParam = {
                    routes: bindRoutes
                };
                this.routeHistory = [];
                var that = this;
                for (var i in routes) {
                    (function (route) {
                        routerParam[route.name] = function () {
                            var t = arguments;
                            that.loadingPage = true;
                            that.getPage(route.page.name).then(function (modulo) {
                                if (route.name in modulo.routeHandler) {
                                    modulo.routeHandler[route.name].apply(modulo, t);
                                }
                                modulo.handleRoute.apply(modulo, [route.name].concat(t));
                                that.show(modulo);
                                that.routeHistory.push(Backbone.history.getFragment());
                                that.loadingPage = false;
                            });
                        };
                    })(routes[i]);
                }
                ;
                mz.route.start(routerParam, function () {
                    _this.emit('loaded');
                    _this.loaded();
                });
            };
            PageCoordinator.prototype.loaded = function () {
            };
            PageCoordinator.prototype.show = function (page) {
                if (page instanceof Page) {
                    _super.prototype.show.call(this, page);
                    this.actualPage = page;
                }
                else
                    throw new Error("App only shows instances of Page");
            };
            PageCoordinator.prototype.navigate = function (route, trigger) {
                if (trigger === void 0) { trigger = true; }
                mz.route.navigate(route, trigger);
            };
            PageCoordinator.prototype.getPage = function (pageName) {
                var _this = this;
                var page = this.pages.indexedGet(pageName);
                if (page == null)
                    return Promise.reject(Error("Page not found"));
                return new Promise(function (ok) {
                    mz.require(page.module, function (modulo) {
                        if (modulo.instance)
                            return ok(modulo.instance);
                        ok(modulo.instance = new modulo(_this));
                    });
                });
            };
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', Page)
            ], PageCoordinator.prototype, "actualPage", void 0);
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', Boolean)
            ], PageCoordinator.prototype, "loadingPage", void 0);
            PageCoordinator = __decorate([
                mz.Widget.ConfigureUnwrapped,
                mz.Widget.Template(null, 'content'), 
                __metadata('design:paramtypes', [Object])
            ], PageCoordinator);
            return PageCoordinator;
        })(mz.widgets.MzSwitcher);
        app.PageCoordinator = PageCoordinator;
    })(app = mz.app || (mz.app = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
var mz;
(function (mz) {
    var auth;
    (function (auth) {
        var jwt;
        (function (jwt) {
            function urlBase64Decode(str) {
                var output = str.replace(/-/g, '+').replace(/_/g, '/');
                switch (output.length % 4) {
                    case 0: {
                        break;
                    }
                    case 2: {
                        output += '==';
                        break;
                    }
                    case 3: {
                        output += '=';
                        break;
                    }
                    default: {
                        throw 'Illegal base64url string!';
                    }
                }
                return mz.globalContext.decodeURIComponent(mz.globalContext.escape(mz.globalContext.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
            }
            jwt.urlBase64Decode = urlBase64Decode;
            function decodeToken(token) {
                var parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('JWT must have 3 parts');
                }
                var decoded = urlBase64Decode(parts[1]);
                if (!decoded) {
                    throw new Error('Cannot decode the token');
                }
                return JSON.parse(decoded);
            }
            jwt.decodeToken = decodeToken;
            function getTokenExpirationDate(token) {
                var decoded = decodeToken(token);
                if (typeof decoded.exp === "undefined") {
                    return null;
                }
                var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
                d.setUTCSeconds(decoded.exp);
                return d;
            }
            jwt.getTokenExpirationDate = getTokenExpirationDate;
            ;
            function isTokenExpired(token, offsetSeconds) {
                var d = getTokenExpirationDate(token);
                offsetSeconds = offsetSeconds || 0;
                if (d === null) {
                    return false;
                }
                // Token expired?
                return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
            }
            jwt.isTokenExpired = isTokenExpired;
            ;
        })(jwt = auth.jwt || (auth.jwt = {}));
    })(auth = mz.auth || (mz.auth = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
var mz;
(function (mz) {
    var mzLang = mz.mzLang || {};
    var idioma = mz.globalContext.idioma = mz.globalContext.idioma || {};
    var erroresEncontradosIdioma = {};
    mz.translate = function (claveIdioma, defaultValue) {
        if (!(claveIdioma in idioma)) {
            if (claveIdioma in mzLang)
                return idioma[claveIdioma] = mzLang[claveIdioma];
            if (!(claveIdioma in erroresEncontradosIdioma)) {
                mz._debug && console.warn('ñ: ' + claveIdioma, defaultValue);
                erroresEncontradosIdioma[claveIdioma] = defaultValue || claveIdioma;
                idioma[claveIdioma] = defaultValue || claveIdioma;
            }
        }
        return idioma[claveIdioma];
    };
    mz.translate.faltantes = erroresEncontradosIdioma;
    mz.translate.idioma = idioma;
    mz.globalContext["ñ"] = mz.translate;
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
/// <reference path="I18n.ts" />
/// <reference path="Xr.ts" />
Date.prototype.add = function (sInterval, iNum) {
    var dTemp = this;
    if (!sInterval || iNum == 0)
        return dTemp;
    switch (sInterval.toLowerCase()) {
        case "ms":
            dTemp.setMilliseconds(dTemp.getMilliseconds() + iNum);
            break;
        case "s":
        case "ss":
            dTemp.setSeconds(dTemp.getSeconds() + iNum);
            break;
        case "mi":
        case "m":
        case "mm":
            dTemp.setMinutes(dTemp.getMinutes() + iNum);
            break;
        case "h":
        case "hh":
            dTemp.setHours(dTemp.getHours() + iNum);
            break;
        case "d":
        case "dd":
            dTemp.setDate(dTemp.getDate() + iNum);
            break;
        case "mo":
            dTemp.setMonth(dTemp.getMonth() + iNum);
            break;
        case "y":
        case "yyyy":
            dTemp.setFullYear(dTemp.getFullYear() + iNum);
            break;
    }
    return dTemp;
};
Date.prototype.part = function (sInterval) {
    var dTemp = this;
    if (!sInterval)
        return dTemp;
    switch (sInterval.toLowerCase()) {
        case "ms":
            return ('0000' + (dTemp.getMilliseconds().toString())).substr(-4);
        case "s":
        case "ss":
            return ('00' + (dTemp.getSeconds()).toString()).substr(-2);
        case "mi":
        case "m":
        case "mm":
            return ('00' + (dTemp.getMinutes()).toString()).substr(-2);
        case "h":
        case "hh":
            return ('00' + (dTemp.getHours()).toString()).substr(-2);
        case "d":
        case "dd":
            return ('00' + (dTemp.getDate()).toString()).substr(-2);
        case "mo":
            return ('00' + (dTemp.getMonth() + 1).toString()).substr(-2);
        case "y":
        case "yyyy":
            return dTemp.getFullYear().toString();
    }
    return sInterval;
};
var mz;
(function (mz) {
    var date;
    (function (date_1) {
        var regexpISO8601 = /^[0-9]{4}(.{1})[0-9]{1,2}\1[0-9]{1,2}\T/;
        function parseObject(json) {
            if (typeof json == "object") {
                var out;
                if (json instanceof Array)
                    out = [];
                else
                    out = {};
                for (var i in json) {
                    if (typeof json[i] == "string") {
                        if (json[i].substr(0, 6) === "/Date(" && json[i].substr(-2) === ")/") {
                            out[i] = parse(json[i]);
                        }
                        else if (json[i].substr(10, 1) === "T" && (json[i].length < 32) && regexpISO8601.test(json[i])) {
                            var a = new Date(json[i]);
                            if (!isNaN(a))
                                out[i] = a;
                            else
                                out[i] = json[i];
                        }
                        else {
                            out[i] = json[i];
                        }
                    }
                    else {
                        if (mz.isIterable(json[i])) {
                            out[i] = parseObject(json[i]);
                        }
                        else {
                            out[i] = json[i];
                        }
                    }
                }
                return out;
            }
            return json;
        }
        date_1.parseObject = parseObject;
        /**
        * An Array of day names starting with Sunday.
        *
        * @example dayNames[0]
        * @result 'Sunday'
        *
        * @name dayNames
        * @type Array
        * @cat Plugins/Methods/Date
        */
        date_1.dayNames = mz.translate('#dayNames', 'Domingo|Lunes|Martes|Miercoles|Jueves|Viernes|Sabado').split('|');
        /**
        * An Array of abbreviated day names starting with Sun.
        *
        * @example abbrDayNames[0]
        * @result 'Sun'
        *
        * @name abbrDayNames
        * @type Array
        * @cat Plugins/Methods/Date
        */
        date_1.abbrDayNames = mz.translate('#abbrDayNames', 'Dom|Lun|Mar|Mie|Jue|Vie|Sab').split('|');
        /**
        * An Array of month names starting with Janurary.
        *
        * @example monthNames[0]
        * @result 'January'
        *
        * @name monthNames
        * @type Array
        * @cat Plugins/Methods/Date
        */
        date_1.monthNames = mz.translate('#monthNames', 'Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre').split('|');
        /**
        * An Array of abbreviated month names starting with Jan.
        *
        * @example abbrMonthNames[0]
        * @result 'Jan'
        *
        * @name monthNames
        * @type Array
        * @cat Plugins/Methods/Date
        */
        date_1.abbrMonthNames = mz.translate('#abbrMonthNames', 'Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic').split('|');
        /**
        * The first day of the week for this locale.
        *
        * @name firstDayOfWeek
        * @type Number
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        date_1.firstDayOfWeek = 0;
        /**
        * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
        *
        * @name format
        * @type String
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        date_1.format = mz.translate('#DateFormat', 'dd/mm/yyyy');
        //Date.format = 'mm/dd/yyyy';
        //Date.format = 'yyyy-mm-dd';
        //Date.format = 'dd mmm yy';
        /**
        * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
        * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
        *
        * @name format
        * @type String
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        date_1.fullYearStart = '20';
        /**
        * Adds a given method under the given name
        * to the Date prototype if it doesn't
        * currently exist.
        *
        * @private
        */
        function addFeature(name, method) {
            if (!Date.prototype[name]) {
                Date.prototype[name] = method;
            }
        }
        ;
        /**
        * Checks if the year is a leap year.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.isLeapYear();
        * @result true
        *
        * @name isLeapYear
        * @type Boolean
        * @cat Plugins/Methods/Date
        */
        addFeature("isLeapYear", function () {
            var y = this.getFullYear();
            return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
        });
        /**
        * Checks if the day is a weekend day (Sat or Sun).
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.isWeekend();
        * @result false
        *
        * @name isWeekend
        * @type Boolean
        * @cat Plugins/Methods/Date
        */
        addFeature("isWeekend", function () {
            return this.getDay() == 0 || this.getDay() == 6;
        });
        /**
        * Check if the day is a day of the week (Mon-Fri)
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.isWeekDay();
        * @result false
        *
        * @name isWeekDay
        * @type Boolean
        * @cat Plugins/Methods/Date
        */
        addFeature("isWeekDay", function () {
            return !this.isWeekend();
        });
        /**
        * Gets the number of days in the month.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getDaysInMonth();
        * @result 31
        *
        * @name getDaysInMonth
        * @type Number
        * @cat Plugins/Methods/Date
        */
        addFeature("getDaysInMonth", function () {
            return [31, (this.isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()];
        });
        /**
        * Gets the name of the day.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getDayName();
        * @result 'Saturday'
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getDayName(true);
        * @result 'Sat'
        *
        * @param abbreviated Boolean When set to true the name will be abbreviated.
        * @name getDayName
        * @type String
        * @cat Plugins/Methods/Date
        */
        addFeature("getDayName", function (abbreviated) {
            return abbreviated ? mz.date.abbrDayNames[this.getDay()] : mz.date.dayNames[this.getDay()];
        });
        /**
        * Gets the name of the month.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getMonthName();
        * @result 'Janurary'
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getMonthName(true);
        * @result 'Jan'
        *
        * @param abbreviated Boolean When set to true the name will be abbreviated.
        * @name getDayName
        * @type String
        * @cat Plugins/Methods/Date
        */
        addFeature("getMonthName", function (abbreviated) {
            return abbreviated ? mz.date.abbrMonthNames[this.getMonth()] : mz.date.monthNames[this.getMonth()];
        });
        /**
        * Get the number of the day of the year.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getDayOfYear();
        * @result 11
        *
        * @name getDayOfYear
        * @type Number
        * @cat Plugins/Methods/Date
        */
        addFeature("getDayOfYear", function () {
            var tmpdtm = new Date("1/1/" + this.getFullYear());
            return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
        });
        /**
        * Get the number of the week of the year.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.getWeekOfYear();
        * @result 2
        *
        * @name getWeekOfYear
        * @type Number
        * @cat Plugins/Methods/Date
        */
        addFeature("getWeekOfYear", function () {
            return Math.ceil(this.getDayOfYear() / 7);
        });
        /**
        * Set the day of the year.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.setDayOfYear(1);
        * dtm.toString();
        * @result 'Tue Jan 01 2008 00:00:00'
        *
        * @name setDayOfYear
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("setDayOfYear", function (day) {
            this.setMonth(0);
            this.setDate(day);
            return this;
        });
        /**
        * Add a number of years to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addYears(1);
        * dtm.toString();
        * @result 'Mon Jan 12 2009 00:00:00'
        *
        * @name addYears
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addYears", function (num) {
            this.setFullYear(this.getFullYear() + num);
            return this;
        });
        /**
        * Add a number of months to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addMonths(1);
        * dtm.toString();
        * @result 'Tue Feb 12 2008 00:00:00'
        *
        * @name addMonths
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addMonths", function (num) {
            var tmpdtm = this.getDate();
            this.setMonth(this.getMonth() + num);
            if (tmpdtm > this.getDate())
                this.addDays(-this.getDate());
            return this;
        });
        /**
        * Add a number of days to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addDays(1);
        * dtm.toString();
        * @result 'Sun Jan 13 2008 00:00:00'
        *
        * @name addDays
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addDays", function (num) {
            //this.setDate(this.getDate() + num);
            this.setTime(this.getTime() + (num * 86400000));
            return this;
        });
        /**
        * Add a number of hours to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addHours(24);
        * dtm.toString();
        * @result 'Sun Jan 13 2008 00:00:00'
        *
        * @name addHours
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addHours", function (num) {
            this.setHours(this.getHours() + num);
            return this;
        });
        /**
        * Add a number of minutes to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addMinutes(60);
        * dtm.toString();
        * @result 'Sat Jan 12 2008 01:00:00'
        *
        * @name addMinutes
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addMinutes", function (num) {
            this.setMinutes(this.getMinutes() + num);
            return this;
        });
        /**
        * Add a number of seconds to the date object.
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.addSeconds(60);
        * dtm.toString();
        * @result 'Sat Jan 12 2008 00:01:00'
        *
        * @name addSeconds
        * @type Date
        * @cat Plugins/Methods/Date
        */
        addFeature("addSeconds", function (num) {
            this.setSeconds(this.getSeconds() + num);
            return this;
        });
        /**
        * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
        *
        * @example var dtm = new Date();
        * dtm.zeroTime();
        * dtm.toString();
        * @result 'Sat Jan 12 2008 00:01:00'
        *
        * @name zeroTime
        * @type Date
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        addFeature("zeroTime", function () {
            this.setMilliseconds(0);
            this.setSeconds(0);
            this.setMinutes(0);
            this.setHours(0);
            return this;
        });
        /**
        * Returns a string representation of the date object according to Date.format.
        * (Date.toString may be used in other places so I purposefully didn't overwrite it)
        *
        * @example var dtm = new Date("01/12/2008");
        * dtm.asString();
        * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
        *
        * @name asString
        * @type Date
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        addFeature("asString", function (format) {
            var r = format || mz.date.format;
            if (r.split('mm').length > 1) {
                r = r.split('mmmm').join(this.getMonthName(false))
                    .split('mmm').join(this.getMonthName(true))
                    .split('mm').join(_zeroPad(this.getMonth() + 1));
            }
            else {
                r = r.split('m').join(this.getMonth() + 1);
            }
            r = r.split('yyyy').join(this.getFullYear())
                .split('yy').join((this.getFullYear() + '').substring(2))
                .split('dd').join(_zeroPad(this.getDate()))
                .split('d').join(this.getDate());
            return r;
        });
        /**
        * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
        * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
        *
        * @example var dtm = Date.fromString("12/01/2008");
        * dtm.toString();
        * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
        *
        * @name fromString
        * @type Date
        * @cat Plugins/Methods/Date
        * @author Kelvin Luck
        */
        function fromString(s, f) {
            f = f || date_1.format;
            f.replace('mo', 'mm');
            var d = new Date('01/01/1970');
            if (s == '')
                return d;
            s = s.toLowerCase();
            var matcher = '';
            var order = [];
            var r = /(dd?d?|mm?m?|yy?yy?)+([^(m|d|y)])?/g;
            var results;
            while ((results = r.exec(f)) != null) {
                switch (results[1]) {
                    case 'd':
                    case 'dd':
                    case 'm':
                    case 'mm':
                    case 'yy':
                    case 'yyyy':
                        matcher += '(\\d+\\d?\\d?\\d?)+';
                        order.push(results[1].substr(0, 1));
                        break;
                    case 'mmm':
                        matcher += '([a-z]{3})';
                        order.push('M');
                        break;
                }
                if (results[2]) {
                    matcher += results[2];
                }
            }
            var dm = new RegExp(matcher);
            var result = s.match(dm);
            if (!result)
                return d;
            for (var i = 0; i < order.length; i++) {
                var res = result[i + 1];
                switch (order[i]) {
                    case 'd':
                        d.setDate(res);
                        break;
                    case 'm':
                        d.setMonth(Number(res) - 1);
                        break;
                    case 'M':
                        for (var j = 0; j < date_1.abbrMonthNames.length; j++) {
                            if (date_1.abbrMonthNames[j].toLowerCase() == res)
                                break;
                        }
                        d.setMonth(j);
                        break;
                    case 'y':
                        d.setFullYear(res);
                        break;
                }
            }
            return d;
        }
        date_1.fromString = fromString;
        ;
        // utility method
        var _zeroPad = function (num) {
            var s = '0' + num;
            return s.substring(s.length - 2);
            //return ('0'+num).substring(-2); // doesn't work on IE :(
        };
        date_1._offsetServer = 0;
        function newSyncro() {
            var date = new Date();
            date.setTime(date.getTime() + date_1._offsetServer);
            return date;
        }
        date_1.newSyncro = newSyncro;
        function sync(url) {
            mz.xr.get(url).then(function (x) {
                var xhr = x.xhr;
                var date = xhr.getResponseHeader("Date") || xhr.getResponseHeader("date");
                var serverTimeMillisGMT = Date.parse(new Date(Date.parse(date)).toUTCString());
                var localMillisUTC = Date.parse(new Date().toUTCString());
                date_1._offsetServer = serverTimeMillisGMT - localMillisUTC;
                if (mz._debug) {
                    console.log('Timer sincronizados con el servidor: offset=' + date_1._offsetServer);
                    console.log('Timer local:', new Date());
                    console.log('Timer remoto:', newSyncro());
                }
            });
        }
        date_1.sync = sync;
        function parse(date, format) {
            function parseJsonDate(d) {
                if (!d)
                    return null;
                if (d instanceof Date)
                    return new Date(d);
                //return eval("new " + d.substr(1).replace("/",""));
                if (d.indexOf("/Date(") == 0 && d.lastIndexOf("/") == (d.length - 1))
                    return new Date(mz.intval(d.substr(6)));
                return new Date(d);
            }
            function convertirAFechaHora(s) {
                if (s instanceof Date)
                    return s;
                var date = null;
                if (s.match(/^\d{4}([./-])\d{1,2}\1\d{1,2}[ ]\d{1,2}:\d{1,2}/)) {
                    date = new Date(s);
                }
                else if (format && s.match(/^\d{2}([./-])\d{2}\1\d{4}[ ]\d{2}:\d{2}/) && format.startsWith('dd')) {
                    var mes = s.substring(3, 5);
                    var dia = s.substring(0, 2);
                    var anio = s.substring(6, 10);
                    if (mes > 12) {
                        var a = dia;
                        dia = mes;
                        mes = a;
                    }
                    var hora = s.substring(11, 13);
                    var min = s.substring(14, 16);
                    date = new Date(mes + "/" + dia + "/" + anio + " " + hora + ":" + min);
                }
                else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}[ ]\d{2}:\d{2}/)) {
                    var mes = s.substring(3, 5);
                    var dia = s.substring(0, 2);
                    var anio = s.substring(6, 10);
                    if (mes > 12) {
                        var a = dia;
                        dia = mes;
                        mes = a;
                    }
                    var hora = s.substring(11, 13);
                    var min = s.substring(14, 16);
                    date = new Date(mes + "/" + dia + "/" + anio + " " + hora + ":" + min);
                }
                else {
                    var tmp = new Date(date);
                    if (!isNaN(tmp))
                        date = tmp;
                }
                return date;
            }
            function convertirAFecha(s) {
                if (s instanceof Date)
                    return s;
                var date = null;
                if (s.match(/^\d{4}([./-])\d{1,2}\1\d{1,2}/)) {
                    date = new Date(s);
                }
                else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}/) && format && (format.startsWith('mm') || format.startsWith('mo'))) {
                    var dia = s.substring(3, 5);
                    var mes = s.substring(0, 2);
                    var anio = s.substring(6, 10);
                    if (mes > 12) {
                        var a = dia;
                        dia = mes;
                        mes = a;
                    }
                    date = new Date(anio, mes, dia);
                }
                else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}/)) {
                    var mes = s.substring(3, 5);
                    var dia = s.substring(0, 2);
                    var anio = s.substring(6, 10);
                    if (mes > 12) {
                        var a = dia;
                        dia = mes;
                        mes = a;
                    }
                    date = new Date(anio, mes, dia);
                }
                else {
                    var tmp = new Date(date);
                    if (!isNaN(tmp))
                        date = tmp;
                }
                return date;
            }
            if (date == null)
                return null;
            if (date instanceof Date)
                return date;
            if (typeof date === 'string') {
                date = mz.trim(date);
                if (date.indexOf("/Date(") == 0 && date.lastIndexOf("/") == (date.length - 1)) {
                    return parseJsonDate(date);
                }
                else if (date.indexOf("T") == 10 && date.lastIndexOf("Z") == (date.length - 1)) {
                    var a = new Date(date);
                    if (!isNaN(a))
                        return a;
                }
                else if (date.indexOf("UTC") != -1) {
                    date = date.replace(/-/, "/").replace(/-/, "/");
                    date = date.replace(/T/, " ").replace(/Z/, " UTC");
                    date = date.replace(/([\+-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
                    return new Date(date);
                }
                else if (date.indexOf("/") != -1) {
                    if (date.indexOf(":") != -1) {
                        return convertirAFechaHora(date);
                    }
                    return convertirAFecha(date);
                }
                else {
                    return new Date(date);
                }
            }
            else if (typeof date == "number") {
                return new Date(date);
            }
            return date;
        }
        date_1.parse = parse;
        function add(date, intervalo, numero) {
            return this.parse(date).add(intervalo, numero);
        }
        date_1.add = add;
        function fmt_date(obj_date) {
            if (obj_date === null)
                return '';
            if (!(obj_date instanceof Date)) {
                obj_date = this.parse(obj_date);
            }
            if (!(obj_date instanceof Date)) {
                return '';
            }
            if ('asString' in obj_date)
                return obj_date.asString();
            var d = obj_date.getDate();
            var m = obj_date.getMonth() + 1;
            var a = obj_date.getFullYear();
            if (m < 10)
                m = "0" + m.toString();
            if (d < 10)
                d = "0" + d.toString();
            return a.toString() + '/' + m.toString() + '/' + d.toString();
        }
        date_1.fmt_date = fmt_date;
        function fmt_time(obj_date, segundos) {
            if (obj_date === null)
                return '';
            if (!(obj_date instanceof Date)) {
                obj_date = this.parse(obj_date);
            }
            if (!(obj_date instanceof Date)) {
                return '';
            }
            var hr = obj_date.getHours();
            var min = obj_date.getMinutes();
            var seg = obj_date.getSeconds();
            if (min < 10)
                min = "0" + min.toString();
            if (hr < 10)
                hr = "0" + hr.toString();
            if (seg < 10)
                seg = "0" + seg.toString();
            segundos = segundos || false;
            return hr.toString() + ':' + min.toString() + (segundos != false ? ":" + seg.toString() : '');
        }
        date_1.fmt_time = fmt_time;
        function fmt_date_time(obj_date, segundos) {
            if (obj_date === null)
                return '';
            segundos = segundos || false;
            return this.fmt_date(obj_date) + ' ' + this.fmt_time(obj_date, segundos);
        }
        date_1.fmt_date_time = fmt_date_time;
        function toString(date, fmt) {
            if (date && date instanceof Date) {
                return (fmt || 'yyyy/mo/dd hh:mm').replace(/(\w{4}|\w{2}|\w{1})/g, function (a) {
                    return date.part(a);
                });
            }
            else {
                return '';
            }
        }
        date_1.toString = toString;
        function fmt_duracion(segundos, segs) {
            segundos = Number(segundos || 0);
            var negativo = segundos < 0;
            if (negativo)
                segundos = -segundos;
            var h = Math.floor(segundos / 3600);
            var m = Math.floor(segundos / 60 - h * 60);
            var s = Math.floor(segundos % 60);
            if (m < 10)
                m = "0" + m.toString();
            if (s < 10)
                s = "0" + s.toString();
            if (h < 10)
                h = "0" + h.toString();
            return (negativo ? '-' : '') + (segs ? "{0}:{1}:{2}" : "{0}:{1}").format(h, m, s);
        }
        date_1.fmt_duracion = fmt_duracion;
        function parseDuracion(val) {
            if (val == null || val instanceof Number)
                return val;
            if (typeof val == 'string' && val.indexOf(':') != -1) {
                var s = val.split(':');
                var hr = mz.intval(s[0]);
                return (hr < 0 ? -1 : 1) * Math.abs(hr) * 3600 + mz.intval(s[1]) * 60 + (s.length == 3 ? mz.intval(s[2]) : 0);
            }
            return mz.intval(val);
        }
        date_1.parseDuracion = parseDuracion;
    })(date = mz.date || (mz.date = {}));
})(mz || (mz = {}));
;
/// <reference path="../mz.ts" />
/// <reference path="Date.ts" />
var mz;
(function (mz) {
    var promise;
    (function (promise) {
        function wait(time) {
            return function (data) {
                return new Promise(function (ok) { return setTimeout(function () { return ok(data); }, time); });
            };
        }
        promise.wait = wait;
        ;
        function yield(data) {
            return new Promise(function (ok) { return setImmediate(function () { return ok(data); }); });
        }
        promise.yield = yield;
        ;
        function nextFrame(data) {
            return new Promise(function (ok) { return requestAnimationFrame(function () { return ok(data); }); });
        }
        promise.nextFrame = nextFrame;
        ;
        function parseStringDates(data) {
            var tipo = typeof data;
            if (!(tipo == "boolean" || tipo == "number" || tipo == "string"))
                return Promise.resolve(mz.date.parseObject(data));
            return Promise.resolve(data);
        }
        promise.parseStringDates = parseStringDates;
        ;
        if ('Response' in mz.globalContext && 'fetch' in mz.globalContext) {
            promise.parseJSON = function (data) {
                return (new mz.globalContext.Response(data)).json();
            };
        }
        else {
            promise.parseJSON = function (data) {
                var result;
                try {
                    result = JSON.parse(data);
                }
                catch (error) {
                    return Promise.reject(error);
                }
                return Promise.resolve(result);
            };
        }
    })(promise = mz.promise || (mz.promise = {}));
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
/// <reference path="Promise.ts" />
/// <reference path="../AUTH/OAuth2.ts" />
var mz;
(function (mz) {
    var res = function res(xhr) {
        return {
            status: xhr.status,
            response: xhr.response,
            xhr: xhr,
            url: '',
            data: null
        };
    };
    var getParams = function getParams(data, url) {
        var ret = [];
        for (var k in data) {
            ret.push('' + encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
        }
        if (url && url.split('?').length > 1)
            ret.push(url.split('?')[1]);
        return ret.join('&');
    };
    var promise = function promise(args, fn) {
        return (args && args.promise ? args.promise : xr.defaults.promise)(fn);
    };
    /**
      * xr (c) James Cleveland 2015
      * URL: https://github.com/radiosilence/xr
      * License: BSD
      */
    function xr(args) {
        if (!args.skipAuthorization && !args.promise) {
            mz.oauth2.applyAuthorizationHeaders(args);
        }
        return promise(args, function (resolve, reject) {
            var opts = mz.copy({}, xr.defaults);
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
            }
            else if (opts.withCredentials) {
                xhr.withCredentials = opts.withCredentials;
            }
            var queryString = opts.params ? getParams(opts.params) : null;
            xhr.open(opts.method, queryString && queryString.length ? '' + opts.url.split('?')[0] + '?' + queryString : opts.url, true);
            xhr.addEventListener(xr.Events.READY_STATE_CHANGE, function (e) {
                if (xhr.readyState == 4) {
                    try {
                        if (xhr.status >= 500 && xhr.getResponseHeader("jsonerror") == "true") {
                            var json = JSON.parse(xhr.responseText);
                            console.error ? console.error('JsonError: ' + json.Message, json) : console.log('JsonError: ' + json.Message, json);
                        }
                    }
                    catch (e) {
                    }
                    var resultado = mz.copy(res(xhr), {
                        data: xhr.response ? !opts.raw ? opts.load(xhr.response, xhr) : xhr.response : null,
                        url: originalURL
                    });
                    if (resultado.data && resultado.data instanceof Promise) {
                        resultado.data.then(function (ok) {
                            resultado.data = ok;
                            return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                        }, function (err) {
                            resultado.data = err;
                            return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                        });
                    }
                    else {
                        return (xhr.status == 0 && fileProtocol || xhr.status >= 200 && xhr.status < 300) ? resolve(resultado, false) : reject(resultado);
                    }
                }
            });
            xhr.addEventListener(xr.Events.ABORT, function () {
                return reject(res(xhr));
            });
            xhr.addEventListener(xr.Events.ERROR, function () {
                var resultado = res(xhr);
                if (xhr.response) {
                    try {
                        mz.copy(resultado, {
                            data: xhr.response ? !opts.raw ? opts.load(xhr.response, xhr) : xhr.response : null,
                            url: originalURL
                        });
                    }
                    catch (e) { }
                }
                return reject(resultado);
            });
            xhr.addEventListener(xr.Events.TIMEOUT, function () {
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
    }
    mz.xr = xr;
    ;
})(mz || (mz = {}));
var mz;
(function (mz) {
    var xr;
    (function (xr) {
        xr.Methods = {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            DELETE: 'DELETE',
            PATCH: 'PATCH',
            OPTIONS: 'OPTIONS'
        };
        xr.Events = {
            READY_STATE_CHANGE: 'readystatechange',
            LOAD_START: 'loadstart',
            PROGRESS: 'progress',
            ABORT: 'abort',
            ERROR: 'error',
            LOAD: 'load',
            TIMEOUT: 'timeout',
            LOAD_END: 'loadend'
        };
        var readJSONFromString = function (x, xhr) {
            if (typeof x == "string") {
                return mz.promise.parseJSON(x).then(function (x) {
                    if ('d' in x)
                        return x.d;
                    return x;
                }).then(mz.promise.parseStringDates);
            }
            return x;
        };
        var formatters;
        (function (formatters) {
            formatters.json = function (x) {
                if (x instanceof FormData) {
                    if ('Content-Type' in this.headers)
                        delete this.headers['Content-Type'];
                    return x;
                }
                this.headers['Content-Type'] = 'application/json';
                return JSON.stringify(x);
            };
            formatters.raw = function (x) { return x.toString(); };
            formatters.urlEncoded = function (obj) {
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
            formatters.multipart = function (obj) {
                if ('Content-Type' in this.headers)
                    delete this.headers['Content-Type'];
                var t = new FormData();
                for (var i in obj)
                    if (obj.hasOwnProperty(i))
                        t.append(i, obj[obj]);
                return t;
            };
        })(formatters = xr.formatters || (xr.formatters = {}));
        xr.defaults = {
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
            promise: function promise(fn) {
                return new Promise(fn);
            },
            params: {},
            url: null,
            raw: false,
            events: {},
            withCredentials: null
        };
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
        function urlResolve(url) {
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
        xr.urlResolve = urlResolve;
        /**
         * Parse a request URL and determine whether this is a same-origin request as the application document.
         *
         * @param {string|object} requestUrl The url of the request as a string that will be resolved
         * or a parsed URL object.
         * @returns {boolean} Whether the request is for the same origin as the application document.
         */
        function urlIsSameOrigin(requestUrl) {
            var parsed = (typeof requestUrl == "string") ? urlResolve(requestUrl) : requestUrl;
            return (parsed.protocol === originUrl.protocol &&
                parsed.host === originUrl.host);
        }
        xr.urlIsSameOrigin = urlIsSameOrigin;
        /**
         * var moviles = 'Los Moviles/Autos'
         * mz.xr.urlEncode `@api/v1/${moviles}/1` -> '@api/v1/Los%20Moviles%2FAutos/1'
         */
        function urlEncode(literalSections) {
            var substs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                substs[_i - 1] = arguments[_i];
            }
            var raw = literalSections.raw;
            var result = '';
            substs.forEach(function (subst, i) {
                var lit = raw[i];
                if (Array.isArray(subst)) {
                    subst = subst.join('');
                }
                if (!lit.endsWith('$')) {
                    subst = encodeURIComponent(subst);
                }
                else {
                    lit = lit.slice(0, -1);
                }
                result += lit;
                result += subst;
            });
            result += raw[raw.length - 1]; // (A)
            return result;
        }
        xr.urlEncode = urlEncode;
        xr.getAbsoluteUrl = (function () {
            var a;
            return function (url) {
                if (!a)
                    a = document.createElement('a');
                a.href = mz.getPath(url);
                return a.href;
            };
        })();
        function get(url, params, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.GET, params: params }, args));
        }
        xr.get = get;
        ;
        function put(url, data, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.PUT, data: data || {} }, args));
        }
        xr.put = put;
        ;
        function post(url, data, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.POST, data: data || {} }, args));
        }
        xr.post = post;
        ;
        function patch(url, data, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.PATCH, data: data || {} }, args));
        }
        xr.patch = patch;
        ;
        function del(url, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.DELETE }, args));
        }
        xr.del = del;
        ;
        function options(url, args) {
            return xr(mz.copy({ url: url, method: xr.Methods.OPTIONS }, args));
        }
        xr.options = options;
        ;
    })(xr = mz.xr || (mz.xr = {}));
})(mz || (mz = {}));
var sp = String.prototype;
if (!('capitalize' in sp)) {
    sp.capitalize = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}
if (!('setAt' in sp)) {
    sp.setAt = function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    };
}
if (!('endsWith' in sp)) {
    sp.endsWith = function (suffix) {
        suffix = suffix.toString();
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
if (!('startsWith' in sp)) {
    sp.startsWith = function (prefix) {
        prefix = prefix.toString();
        return this.indexOf(prefix) === 0;
    };
}
if (!('contains' in sp)) {
    sp.contains = function (prefix) {
        prefix = prefix.toString();
        return this.indexOf(prefix) !== -1;
    };
}
sp.toCamelCase = function () {
    return this.toLowerCase().replace(/-([a-z])/g, function (match, group1) {
        return group1.toUpperCase();
    });
};
sp.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
sp.isValidMail = function () {
    return this.length > 5 && re.test(this);
};
/// <reference path="../CORE/Xr.ts" />
/// <reference path="../CORE/Strings.ts" />
/// <reference path="JWT.ts" />
/// <reference path="../CORE/EventDispatcher.ts" />
var mz;
(function (mz) {
    var oauth2;
    (function (oauth2) {
        oauth2.roleList = [];
        var loginUrl = null;
        var refreshTokenUrl = null;
        var logoutUrl = null;
        var clientSecret = null;
        var xhrWithCredentials = null;
        var scopes = [];
        oauth2.currentDomain = extractDomain(location.href), oauth2.currentClientID = 'mz-core';
        function extractDomain(url) {
            var domain;
            var partes = url.split('/');
            //find & remove protocol (http, ftp, etc.) and get domain
            if (url.indexOf("://") > -1) {
                domain = partes[2];
            }
            else {
                if (partes[0].contains('.'))
                    domain = partes[0];
                else
                    return oauth2.currentDomain;
            }
            //find & remove port number
            domain = domain.split(':')[0];
            return domain.toLowerCase();
        }
        function tokenGetter(domain) {
            return {
                token: localStorage.getItem('JWT_' + domain) || localStorage.getItem('JWT_' + oauth2.currentDomain) || null,
                type: localStorage.getItem('JWTtype_' + domain) || 'bearer'
            };
        }
        oauth2.tokenGetter = tokenGetter;
        function setupToken(token) {
            if (mz.auth.jwt.isTokenExpired(token, 0))
                throw new Error("The provided token is expired");
            var decodedToken = mz.auth.jwt.decodeToken(token);
            if (decodedToken.role && decodedToken.role.length) {
                if (typeof decodedToken.role == "string")
                    decodedToken.role = [decodedToken.role];
                pushRoles(decodedToken.role);
            }
        }
        function setToken(domain, token, refreshToken, tokenType) {
            domain = domain.toLowerCase();
            if (token) {
                if (mz.auth.jwt.isTokenExpired(token, 0))
                    throw new Error("The provided token is expired");
                if (domain == oauth2.currentDomain) {
                    setupToken(token);
                }
                localStorage.setItem('JWT_' + domain, token);
                localStorage.setItem('JWTr_' + domain, refreshToken);
                localStorage.setItem('JWTtype_' + domain, (tokenType || 'bearer'));
            }
            else {
                localStorage.removeItem('JWT_' + domain);
                localStorage.removeItem('JWTr_' + domain);
                localStorage.removeItem('JWTtype_' + domain);
            }
        }
        oauth2.setToken = setToken;
        function checkRole(role) {
            return oauth2.roleList.indexOf(role) != -1;
        }
        oauth2.checkRole = checkRole;
        function pushRoles(roles) {
            var roleArray = roles;
            if (oauth2.roleList instanceof String)
                roleArray = oauth2.roleList.split(/[\|,]/g);
            roleArray.forEach(function (role) { return oauth2.roleList.indexOf(role) == -1 && oauth2.roleList.push(role); });
        }
        oauth2.pushRoles = pushRoles;
        /// <reference path="../CORE/Xr.ts" />
        /// <reference path="../CORE/Strings.ts" />
        /// <reference path="JWT.ts" />
        var ERROR_RESPONSES = {
            'invalid_request': [
                'The request is missing a required parameter, includes an',
                'invalid parameter value, includes a parameter more than',
                'once, or is otherwise malformed.'
            ].join(' '),
            'invalid_client': [
                'Client authentication failed (e.g., unknown client, no',
                'client authentication included, or unsupported',
                'authentication method).'
            ].join(' '),
            'invalid_grant': [
                'The provided authorization grant (e.g., authorization',
                'code, resource owner credentials) or refresh token is',
                'invalid, expired, revoked, does not match the redirection',
                'URI used in the authorization request, or was issued to',
                'another client.'
            ].join(' '),
            'unauthorized_client': [
                'The client is not authorized to request an authorization',
                'code using this method.'
            ].join(' '),
            'unsupported_grant_type': [
                'The authorization grant type is not supported by the',
                'authorization server.'
            ].join(' '),
            'access_denied': [
                'The resource owner or authorization server denied the request.'
            ].join(' '),
            'unsupported_response_type': [
                'The authorization server does not support obtaining',
                'an authorization code using this method.'
            ].join(' '),
            'invalid_scope': [
                'The requested scope is invalid, unknown, or malformed.'
            ].join(' '),
            'server_error': [
                'The authorization server encountered an unexpected',
                'condition that prevented it from fulfilling the request.',
                '(This error code is needed because a 500 Internal Server',
                'Error HTTP status code cannot be returned to the client',
                'via an HTTP redirect.)'
            ].join(' '),
            'temporarily_unavailable': [
                'The authorization server is currently unable to handle',
                'the request due to a temporary overloading or maintenance',
                'of the server.'
            ].join(' ')
        };
        var unauthorizedRetry = function (fn) {
            return (new Promise(fn)).catch(function (err) {
                if (err.status == 401) {
                    return oauth2.refreshToken().then(function (x) { return new Promise(fn); }, function (x) {
                        if (x && x.status == 401) {
                            oauth2.emit('unauthorized');
                        }
                        return Promise.reject(x);
                    });
                }
                return Promise.reject(err);
            });
        };
        var handleError = function (x) {
            var err = x;
            if (x && x.data && x.data.error) {
                var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;
                oauth2.emit('error', 'refreshToken', x.data, message);
                if (x.data.error == "invalid_grant") {
                    localStorage.removeItem('JWTr_' + oauth2.currentDomain);
                    // must login
                    oauth2.emit('unauthorized');
                }
                err = new Error(message);
                err.name = x.data.error;
            }
            if (x.status == 401) {
                oauth2.emit('unauthorized');
            }
            return Promise.reject(err);
        };
        function applyAuthorizationHeaders(xr) {
            var domain = extractDomain(xr.url);
            var token = tokenGetter(domain);
            if (token.token) {
                xr.headers = xr.headers || {};
                if (token.type == "bearer") {
                    xr.headers['Authorization'] = "Bearer " + token.token;
                }
                else {
                    (xr.params = xr.params || {})["access_token"] = token.token;
                    xr.headers['Pragma'] = 'no-store';
                    xr.headers['Cache-Control'] = 'no-store';
                }
                xr.promise = unauthorizedRetry;
            }
        }
        oauth2.applyAuthorizationHeaders = applyAuthorizationHeaders;
        function configure(opts) {
            loginUrl = opts.loginUrl || null;
            refreshTokenUrl = opts.refreshTokenUrl || null;
            logoutUrl = opts.logoutUrl || null;
            oauth2.currentClientID = opts.clientId || null;
            clientSecret = opts.clientSecret || null;
            scopes = opts.scopes || [];
            xhrWithCredentials = opts.xhrWithCredentials;
            if (localStorage.getItem('JWT_' + oauth2.currentDomain)) {
                try {
                    setupToken(localStorage.getItem('JWT_' + oauth2.currentDomain));
                }
                catch (e) {
                    console.error(e);
                }
            }
            if (localStorage.getItem('JWTr_' + oauth2.currentDomain)) {
                refreshTokenUrl && refreshToken();
            }
        }
        oauth2.configure = configure;
        function refreshToken() {
            if (refreshTokenUrl) {
                var authString;
                if (oauth2.currentClientID) {
                    authString = oauth2.currentClientID + ':';
                    if (clientSecret)
                        authString += clientSecret;
                    authString = 'Basic ' + btoa(authString);
                }
                return mz.xr.post(refreshTokenUrl, {
                    grant_type: "refresh_token",
                    refresh_token: localStorage.getItem('JWTr_' + oauth2.currentDomain) || null
                }, {
                    skipAuthorization: true,
                    dump: mz.xr.formatters.urlEncoded,
                    headers: {
                        Authorization: authString
                    },
                    withCredentials: xhrWithCredentials
                }).then(function (x) {
                    if (x.data.access_token) {
                        oauth2.emit("gotToken", x.data.token, x.data, oauth2.currentDomain);
                        setToken(oauth2.currentDomain, x.data.access_token, x.data.refresh_token || null);
                    }
                    if (x.data.error) {
                        var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;
                        oauth2.emit('error', 'refreshToken', x.data, message);
                        if (x.data.error == "invalid_grant") {
                            localStorage.removeItem('JWTr_' + oauth2.currentDomain);
                        }
                        var err = new Error(message);
                        err.name = x.data.error;
                        return Promise.reject(err);
                    }
                    return x;
                }, handleError);
            }
            return Promise.reject(null);
        }
        oauth2.refreshToken = refreshToken;
        function logout() {
            setToken(oauth2.currentDomain, null);
            oauth2.emit('logout');
            if (logoutUrl) {
                return mz.xr.get(logoutUrl, {}, {
                    skipAuthorization: true,
                    withCredentials: xhrWithCredentials
                }).then(function (x) {
                    return x;
                });
            }
            return Promise.resolve(null);
        }
        oauth2.logout = logout;
        function login(username, password) {
            if (loginUrl) {
                var authString;
                if (oauth2.currentClientID) {
                    authString = oauth2.currentClientID + ':';
                    if (clientSecret)
                        authString += clientSecret;
                    authString = 'Basic ' + btoa(authString);
                }
                var theScopes = void 0;
                if (scopes.length) {
                    theScopes = scopes.join(' ');
                }
                return mz.xr.post(loginUrl, {
                    grant_type: 'password',
                    username: username,
                    password: password,
                    scope: theScopes
                }, {
                    skipAuthorization: true,
                    dump: mz.xr.formatters.urlEncoded,
                    headers: {
                        Authorization: authString
                    },
                    withCredentials: xhrWithCredentials
                }).then(function (x) {
                    if (x.data.access_token) {
                        setToken(oauth2.currentDomain, x.data.access_token, x.data.refresh_token || null, (x.data.token_type || '').toLowerCase());
                    }
                    else if (x.data.error) {
                        var message = ERROR_RESPONSES[x.data.error] || x.data.error_message || x.data.error;
                        var err = new Error(message);
                        err.name = x.data.error;
                        return Promise.reject(err);
                    }
                    oauth2.emit('login', x.data);
                    return x;
                }, handleError);
            }
            return Promise.reject(null);
        }
        oauth2.login = login;
        function loggedIn() {
            var token = tokenGetter(oauth2.currentDomain);
            if (!token || !token.token)
                return false;
            try {
                return !mz.auth.jwt.isTokenExpired(token.token);
            }
            catch (e) {
                console.error(e);
            }
            return false;
        }
        oauth2.loggedIn = loggedIn;
        oauth2.on = mz.EventDispatcher.prototype.on;
        oauth2.emit = mz.EventDispatcher.prototype.emit;
        oauth2.off = mz.EventDispatcher.prototype.off;
        mz.EventDispatcher.apply(oauth2);
    })(oauth2 = mz.oauth2 || (mz.oauth2 = {}));
})(mz || (mz = {}));
/// <reference path="../strings.ts" />
/// <reference path="../Xr.ts" />
/// <reference path="define.ts" />
var mz;
(function (mz) {
    function require(a, callback) {
        var esFn = typeof callback == 'function';
        if (typeof a == 'object' && a instanceof Array && callback) {
            var count = a.length;
            var args = [];
            var elems = a;
            for (var i in elems) {
                (function (i, elem) {
                    mz.require(elem, function (ret) {
                        args[i] = ret;
                        if ((--count) == 0)
                            callback.apply(this, args);
                    });
                })(i, elems[i]);
            }
        }
        else {
            var elem = a.toString();
            if (elem == "exports") {
                if (esFn) {
                    callback({});
                }
                else {
                    console.error("require('exports') en lugar ilegal. sólo se puede utilizar en una llamada a define(['exports'], function(exports)..");
                    return {};
                }
            }
            else if (elem == "require") {
                if (esFn) {
                    callback(mz.require);
                }
                else {
                    return mz.require;
                }
            }
            else if (elem in mz.modules) {
                if (esFn) {
                    if (mz.modules[elem].loaded) {
                        callback(mz.modules[elem].exports);
                    }
                    else {
                        mz.modules[elem].callbacks.push({
                            cb: callback,
                            reqs: elems
                        });
                    }
                }
                else {
                    if (mz.modules[elem].loaded) {
                        return mz.modules[elem].exports;
                    }
                }
            }
            else {
                var promise = mz.require.route(elem).then(function (archivo) {
                    if (!archivo) {
                        if (!/\.js$/.test(elem))
                            archivo = elem + '.js';
                        else
                            archivo = elem;
                    }
                    if (archivo.endsWith('.ts')) {
                        archivo = archivo.replace(/\.ts$/, '.js');
                    }
                    if (archivo) {
                        mz.include(archivo, elem, esFn);
                    }
                    if (!esFn) {
                        if (mz.modules[elem]) {
                            if (mz.modules[elem].loaded)
                                return mz.modules[elem].exports;
                        }
                        else {
                            throw 'Módulo desconocido [[' + elem + ']]';
                        }
                    }
                    else {
                        if (mz.modules[elem]) {
                            if (mz.modules[elem].loaded)
                                callback(mz.modules[elem].exports);
                            else
                                mz.modules[elem].callbacks.push({
                                    cb: callback,
                                    reqs: elem
                                });
                            return mz.modules[elem];
                        }
                        else {
                            return null;
                        }
                    }
                });
            }
        }
    }
    mz.require = require;
    var modulosCargados = {};
    function include(url, nombreModulo, async) {
        var urlBuscada = mz.getPath(url);
        var path = urlBuscada.split('/');
        path.pop();
        var module = mz.modules[nombreModulo] = new mz.Module(nombreModulo);
        module.async = !!async;
        module.filename = urlBuscada.toString();
        module.path = path.join('/') + '/';
        //if (module.path == '/') module.path = mz.getAbsoluteUrl();
        modulosCargados[url] = loadModule(urlBuscada, module);
        if (async == false && modulosCargados[url] == false) {
            throw 'Include: No se pudo cargar el módulo [[' + nombreModulo + ']] en ' + url;
        }
        return true;
    }
    mz.include = include;
    function loadModule(url, module, async) {
        var successflag = false;
        if (mz.scriptBase) {
            var baseURL = mz.xr.getAbsoluteUrl(mz.scriptBase.toLowerCase()).toLowerCase();
            url = mz.xr.getAbsoluteUrl(url);
            if (url.toLowerCase().startsWith(baseURL)) {
                url = url.toLowerCase().replace(baseURL, '');
            }
        }
        var processResponse = function (result) {
            //try {
            var bkCM = mz.define.currentModule || null;
            mz.define.currentModule = module;
            var bkRequire = mz.globalContext.require;
            var bkExports = mz.globalContext.exports;
            var bkModulo = mz.globalContext.module;
            var bkDefine = mz.globalContext.define;
            try {
                mz.globalContext.define = module.define.bind(module);
                mz.globalContext.exports = module.exports;
                mz.globalContext.require = module.require.bind(module);
                mz.globalContext.module = module;
                mz.globalContext.define.amd = bkDefine.amd;
                (function (str) {
                    return eval(str);
                }).call(module.exports, result + '\n//@ sourceURL=' + url);
            }
            finally {
                mz.globalContext.define = bkDefine;
                mz.globalContext.exports = bkExports;
                mz.globalContext.require = bkRequire;
                mz.globalContext.module = bkModulo;
            }
            /*
            jQuery.globalEval(
                'var a = mz.proxy(mzcore.define.currentModule, "define");a.amd = mzcore.define.amd;(function(require, exports, module, define, ñ){ ' +
                result +
                '\n})(mz.proxy(mzcore.define.currentModule, "require"), mzcore.define.currentModule.exports, mzcore.define.currentModule, a, mz.proxy(mzcore.define.currentModule, "ñ"));\n' +
                '//@ sourceURL=' + (module.id || url)
            );
            */
            if (mz.define.currentModule) {
                mz.define.currentModule.loaded = true;
                if (mz.define.currentModule.defined == false) {
                    mz.define.currentModule.ModuleExports.set(mz.define.currentModule.exports, []);
                }
            }
            mz.define.currentModule = bkCM;
            successflag = true;
            /*} catch (e) {
            console.error('Include: Parser: No se pudo cargar el módulo [[' + (module.id || url) + ']] en ' + url, e, e.stack);

            if ('error' in e && 'message' in e) {
            console.error(e.error, e.message, e.stack);
            }
            }*/
        };
        if (mz.hardCodedFiles && url in mz.hardCodedFiles) {
            processResponse(mz.hardCodedFiles[url]);
        }
        else {
            jQuery.ajax({
                async: module.async,
                type: "GET",
                url: url,
                data: null,
                success: function (result) {
                    processResponse(result);
                },
                fail: function () {
                    console.error('Include: No se pudo cargar el módulo [[' + (module.id || url) + ']] en ' + url);
                },
                dataType: 'text'
            });
        }
        return successflag;
    }
})(mz || (mz = {}));
var mz;
(function (mz) {
    var require;
    (function (require) {
        var escapeRegExp = function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        };
        require.routes = [];
        function route(source, dest) {
            if (arguments.length == 1 && typeof source === 'string') {
                for (var i in require.routes) {
                    var rt = require.routes[i];
                    if (typeof rt.source === "string" && rt.source == source) {
                        return Promise.resolve(rt.destination);
                    }
                    else if (typeof require.routes[i].destination === "function") {
                        return require.routes[i].destination(source);
                    }
                    else if (rt.source.test(source)) {
                        return Promise.resolve(source.replace(require.routes[i].source, require.routes[i].destination));
                    }
                }
            }
            else if (arguments.length == 2) {
                var routeIndex = -1, key = source.toString();
                for (var i in require.routes)
                    if (require.routes[i].key == key) {
                        routeIndex = i;
                        break;
                    }
                var newRoute = {
                    key: key,
                    source: source instanceof RegExp ? source : new RegExp('^' + escapeRegExp(source).replace(/\\\*/g, '([\\w-]+)') + '$'),
                    destination: dest
                };
                if (routeIndex == -1)
                    require.routes.push(newRoute);
                else
                    require.routes[routeIndex] = newRoute;
            }
            return Promise.resolve(null);
        }
        require.route = route;
        route('http://*', 'http://$1');
        route('https://*', 'https://$1');
        route('/*.js', '/$1.js');
        function defineFiles(files) {
            for (var i in files) {
                mz.hardCodedFiles[i.toLowerCase()] = files[i];
            }
        }
        require.defineFiles = defineFiles;
    })(require = mz.require || (mz.require = {}));
})(mz || (mz = {}));
mz.require.route("jquery", "@mz/jquery.js");
window.require = mz.require;
/// <reference path="Require.ts" />
/// <reference path="..\..\mz.ts" />
var mz;
(function (mz) {
    var testRequires = /require\(\w*(('|")([^\)\2]+)\2)\w*\)/g;
    mz.modules = {};
    var Module = (function () {
        function Module(name) {
            this.exports = null;
            this.loaded = false;
            this.parent = null;
            this.children = [];
            this.filename = null;
            this.path = null;
            this.defined = false;
            this.async = false;
            this.callbacks = [];
            this.dependencias = {};
            this.id = name || null;
            this.define.amd = mz.define.amd || {};
            this.ModuleExports = new ModuleExports(this);
        }
        Module.prototype.getPath = function (x) {
            return mz.getPath(x, this.path);
        };
        Module.prototype.require = function (Module, b) {
            if (Module instanceof Array) {
                var r = [];
                for (var i in Module) {
                    var original = r[i];
                    r[i] = this.getPath(Module[i]);
                    if (original != r[i]) {
                        if (r[i].startsWith('http') && !r[i].endsWith('.js'))
                            r[i] += '.js';
                    }
                }
                return mz.require(r, b);
            }
            else
                return mz.require(this.getPath(Module), b);
        };
        Module.prototype.define = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var ret = mz.define.apply(null, arguments);
            mz.define.lastModule.parent = this;
            this.children.push(mz.define.lastModule);
            return ret;
        };
        return Module;
    })();
    mz.Module = Module;
    var ModuleExports = (function () {
        function ModuleExports(theModule) {
            this.module = theModule;
            this.module.exports = {};
            this.seteado = false;
        }
        ModuleExports.prototype.set = function (factory, params) {
            if (mz._debug && typeof factory == 'function') {
                if (testRequires.test(factory)) {
                    var that = this;
                    var deps = null;
                    var depsCargadas = null;
                    String(factory).replace(testRequires, function (all, d1, d2, key) {
                        if (!(key in that.module.dependencias)) {
                            if (key in mz.modules) {
                                depsCargadas = depsCargadas || {};
                                depsCargadas[key] = (depsCargadas[key] || 0) + 1;
                            }
                            else {
                                deps = deps || {};
                                deps[key] = (deps[key] || 0) + 1;
                            }
                        }
                    });
                    if (deps) {
                        console.group(this.module.id + " - Dependencias sincrónicas NO definidas NI cargadas");
                        for (var i in deps) {
                            if (!(i in mz.modules))
                                console.error(i, deps[i]);
                        }
                        console.groupEnd();
                    }
                }
            }
            var result;
            if (typeof factory === 'function') {
                var bkRequire = mz.globalContext.require;
                var bkExports = mz.globalContext.exports;
                var bkModulo = mz.globalContext.module;
                var bkDefine = mz.globalContext.define;
                try {
                    mz.globalContext.define = this.module.define.bind(this.module);
                    mz.globalContext.exports = this.module.exports;
                    mz.globalContext.require = this.module.require.bind(this.module);
                    mz.globalContext.module = this.module;
                    mz.globalContext.define.amd = bkDefine.amd;
                    result = factory.apply(this.module.exports, params);
                }
                finally {
                    mz.globalContext.define = bkDefine;
                    mz.globalContext.exports = bkExports;
                    mz.globalContext.require = bkRequire;
                    mz.globalContext.module = bkModulo;
                }
            }
            else
                result = factory;
            this.seteado = true;
            if (result !== this.module.exports) {
                if (isDef(result) && typeof result != "string" && typeof result != "number" && typeof result != "boolean") {
                    this.module.exports = mz.copy(result, this.module.exports);
                }
            }
            this.module.defined = true;
            this.module.loaded = true;
            var cb = null;
            while (this.module.callbacks.length && (cb = this.module.callbacks.shift())) {
                if (cb.cb)
                    cb.cb(this.module.exports);
            }
        };
        return ModuleExports;
    })();
    mz.ModuleExports = ModuleExports;
})(mz || (mz = {}));
/// <reference path="module.ts" />
var mz;
(function (mz) {
    function undefine(mod) {
        if (mod in mz.modules) {
            mz.modules[mod] = null;
            delete mz.modules[mod];
        }
    }
    mz.undefine = undefine;
    function define() {
        var name = mz.buscarArgumentoTipo('string', arguments) || (mz.define.currentModule ? mz.define.currentModule.id : null) || null;
        var fn = mz.buscarArgumentoTipo('function', arguments) || null;
        var reqs = mz.buscarArgumentoTipo(Array, arguments) || null;
        var obj = !fn && arguments.length && typeof arguments[arguments.length - 1] == "object" && arguments[arguments.length - 1] || null;
        if (!fn && obj) {
            fn = obj;
        }
        var module = null;
        if (mz.define.currentModule && mz.define.currentModule.id == name) {
            module = mz.define.currentModule;
            mz.define.currentModule = null;
        }
        else {
            module = new mz.Module(name);
            if (obj)
                module.exports = obj;
        }
        mz.define.lastModule = module;
        if (name !== null) {
            if (name in mz.modules && mz.modules[name] !== module) {
                if (mz._debug)
                    debugger;
                throw "Ya está definido " + name;
            }
            mz.modules[name] = module;
            if (reqs && reqs.length) {
                var args = [];
                if (module.async) {
                    module.require(reqs, function (args) {
                        for (var i in reqs) {
                            if (reqs[i] == "exports")
                                arguments[i] = module.exports;
                            else if (reqs[i] == "require")
                                arguments[i] = module.require;
                        }
                        module.ModuleExports.set(fn, arguments);
                    });
                }
                else {
                    for (var i in reqs) {
                        if (reqs[i] == "exports") {
                            module.dependencias[reqs[i]] = args[i] = module.exports;
                        }
                        else if (reqs[i] == "require")
                            module.dependencias[reqs[i]] = args[i] = module.require;
                        else
                            module.dependencias[reqs[i]] = args[i] = module.require(reqs[i]);
                    }
                    module.ModuleExports.set(fn, args);
                }
            }
            else {
                module.ModuleExports.set(fn, []);
            }
        }
        else {
            module.ModuleExports.set(fn, []);
        }
        return module.exports;
    }
    mz.define = define;
    define.amd = {};
})(mz || (mz = {}));
var mz;
(function (mz) {
    var define;
    (function (define) {
    })(define = mz.define || (mz.define = {}));
})(mz || (mz = {}));
mz.globalContext.define = mz.define;
/// <reference path="Define.ts" />
/// <reference path="Require.ts" />
mz.define("jquery", function () { return jQuery; });
mz.require.route("backbone", "@mz/backbone-min.js");
mz.require.route("underscore", "@mz/underscore-min.js");
if (mz.globalContext.Backbone) {
    mz.define("backbone", function () { return mz.globalContext.Backbone; });
}
if (mz.globalContext._) {
    mz.define("underscore", function () { return mz.globalContext._; });
}
/// <reference path="MVCObject.ts" />
/// <reference path="../mz.ts" />
var mz;
(function (mz) {
    var Collection = (function (_super) {
        __extends(Collection, _super);
        function Collection(base, opc) {
            _super.call(this);
            this.opciones = {};
            this.__indice__ = {};
            this.agregandoLote = false;
            this.insert = this.push;
            this.opciones = opc || {};
            this.array = (this.opciones.initialSize ? new Array(this.opciones.initialSize) : new Array());
            base && this.addRange(base);
        }
        Collection.prototype.first = function () {
            return this.array[0];
        };
        Collection.prototype.last = function () {
            if (this.array.length)
                return this.array[this.array.length - 1];
        };
        /**
        Limpia la coleccion
        @method clear
        @param {Boolean} noTriggerear si es "true" entonces no se desencadena ningun evento del tipo "changed"
        */
        Collection.prototype.clear = function (noTriggerear) {
            this.trigger(Collection.EVENTS.BeforeClearCollection, !!noTriggerear);
            this.array.length = 0;
            this.__indice__ = {};
            this.trigger(Collection.EVENTS.AfterClearCollection, !!noTriggerear);
            !noTriggerear && this.emit(Collection.EVENTS.Changed, 'clear', !!noTriggerear);
        };
        Object.defineProperty(Collection.prototype, "length", {
            /**
            Tamaño de la coleccion (getter)
            @property length
            */
            get: function () {
                return this.array.length;
            },
            /**
            Tamaño de la coleccion (setter)
            @property length
            */
            set: function (value) {
                if (isNaN(value) || value < 0)
                    throw new TypeError();
                this.setLength(value);
            },
            enumerable: true,
            configurable: true
        });
        Collection.prototype.getLength = function () {
            return this.array.length;
        };
        Collection.prototype.setLength = function (nuevoTamanio) {
            if (nuevoTamanio < 0)
                throw "Tamanio invalido";
            if (this.getLength() > nuevoTamanio) {
                while (this.getLength() > nuevoTamanio) {
                    this.pop();
                }
            }
            else {
                this.array.length = nuevoTamanio;
            }
            this.emit(Collection.EVENTS.Changed, 'length', this.array.length);
            return this;
        };
        /**
        The map() method creates a new array with the results of calling a provided function on every element in this array.
        El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
        @method map
        @param {Function} callback función que se va a ejecutar, a esta function se le pasa 1 argumento, el elemento de la coleccion que se esta iterando
        */
        Collection.prototype.map = function (func, thisp) {
            var thisp = arguments[1] || this;
            var coll = new Collection();
            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && coll.push(func.call(thisp, this.array[i]));
            return coll;
        };
        ;
        /**
        The forEach() method executes a provided function once per array element.
        El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
        @method forEach
        @param {Function|MzDelegate} callback función que se va a ejecutar, a esta function se le pasan 2 argumentos, el elemento de la coleccion que se esta iterando y el indice (zero based) dentro de la coleccion.
        */
        Collection.prototype.forEach = function (func, thisp) {
            var thisp = arguments[1] || this;
            if ('forEach' in this.array) {
                this.array.forEach(func, thisp);
            }
            else {
                for (var i = 0; i < this.array.length; i++)
                    (i in this.array) && typeof this.array[i] != 'undefined' && func.call(thisp, this.array[i], i);
            }
        };
        /**
         * Basicamente lo que hace esta funcion es ejecutar lotes asincronicos que diren X tiempo cada uno, es util para procesar grandes cantidades de informacion y darle un feedback al usuario sin bloquear la pantalla.
         * Si iterationDurationMs es 0, entonces utiliza setImmediate y el tiempo de cada iteracion se setea en 32ms
         */
        Collection.prototype.asyncForEach = function (func, iterationDurationMs) {
            if (this.array.length) {
                var items = this.array.concat();
                var that = this;
                var timerFn = iterationDurationMs <= 0 ? setImmediate : setTimeout;
                if (iterationDurationMs <= 0)
                    iterationDurationMs = 32;
                iterationDurationMs = Math.abs(iterationDurationMs || 32);
                var i = 0;
                function sch() {
                    timerFn(function () {
                        var start = mz.now();
                        while (mz.now() - start < iterationDurationMs && items.length) {
                            func.call(that, items.shift(), i);
                            i++;
                        }
                        if (items.length)
                            sch();
                    }, iterationDurationMs);
                }
                sch();
            }
        };
        Collection.prototype._indizar = function (elem, index) {
            if (this.opciones.key) {
                if (!(this.opciones.key in elem))
                    throw "No tiene la clave primaria";
                if (typeof elem[this.opciones.key] != 'undefined') {
                    this.__indice__[elem[this.opciones.key]] = index;
                }
            }
        };
        Collection.prototype._deindizar = function (elem) {
            if (this.opciones.key) {
                if (typeof elem[this.opciones.key] != 'undefined') {
                    if (elem[this.opciones.key] in this.__indice__) {
                        delete this.__indice__[elem[this.opciones.key]];
                    }
                }
            }
        };
        Collection.prototype._reindizar = function () {
            if (this.opciones.key) {
                this.__indice__ = {};
                var that = this;
                this.forEach(function (e, i) {
                    if (e && typeof e[that.opciones.key] != 'undefined') {
                        that.__indice__[e[that.opciones.key]] = i;
                    }
                });
            }
        };
        /**
        Obtiene el elemento en la posicion "index" de la coleccion
        @method getAt
        @param {Number} index
        */
        Collection.prototype.getAt = function (index) {
            return this.array[index];
        };
        Collection.prototype.reduce = function (fn, initialValue) {
            return this.array.reduce(fn, initialValue);
        };
        /**
        Agrupa los elementos de la colección.
        Si "what" es tipo String, entonces va a asumir que es un campo y va a agrupar por ese campo.
        Si "what" es tipo Function, va a evaluar la función por cada elemento de la colección y agrupa por el resultado.

        Este método devuelve un objeto tipo Diccionario con el criterio de evaluación como clave y una coleccion de elementos como value
        @method groupBy
        @param {Mixed} what
        */
        Collection.prototype.groupBy = function (what) {
            var fn;
            if (typeof what != 'function') {
                throw new TypeError();
            }
            else {
                fn = what;
            }
            if (!fn)
                return {};
            var output = {};
            this.forEach(function (e) {
                var g = fn(e);
                if (g) {
                    if (g in output) {
                        output[g].push(e);
                    }
                    else {
                        output[g] = new Collection([e], this.opciones);
                    }
                }
            });
            return output;
        };
        Object.defineProperty(Collection.prototype, "key", {
            /**
            Obtiene la key de la coleccion
            @property key
            */
            get: function () {
                return this.opciones && this.opciones.key;
            },
            enumerable: true,
            configurable: true
        });
        /**
        Inserta un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "insert_at"
        @method insertAt
        @param {Number} indice
        @param {Mixed} elemento
        */
        Collection.prototype.insertAt = function (indice, elemento) {
            if (this.opciones.key) {
                if (!(this.opciones.key in elemento)) {
                    console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                    return;
                }
                if (elemento[this.opciones.key] in this.__indice__) {
                    console.error('El elemento insertado ya existe en la coleccion ' + this.opciones.key + "=" + elemento[this.opciones.key]);
                    return;
                }
            }
            if (indice == this.array.length) {
                this.array.push(elemento);
                this._indizar(elemento, indice);
            }
            else {
                var fin = this.array.splice(indice);
                this.array.push(elemento);
                this.array = this.array.concat(fin);
                this._reindizar();
                this.emit(Collection.EVENTS.CollectionSorted);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
            }
            this.emit(Collection.EVENTS.ElementInserted, indice, elemento);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementInserted, indice, elemento);
        };
        /**
        Remueve un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "remove_at"
        @method removeAt
        @param {Number} indice
        @param {Mixed} elemento
        */
        Collection.prototype.removeAt = function (indice) {
            var backup = this.array[indice];
            this.array.splice(indice, 1);
            this._reindizar();
            this.emit(Collection.EVENTS.ElementRemoved, indice, backup);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRemoved, indice, backup);
            return backup;
        };
        /**
        Cambia un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "set_at"
        @method set_at
        @param {Number} indice
        @param {Mixed} elemento
        */
        Collection.prototype.setAt = function (indice, elemento) {
            var backup = this.array[indice];
            this._deindizar(backup);
            this.array[indice] = elemento;
            this._indizar(elemento, indice);
            this.emit(Collection.EVENTS.ElementChanged, indice, elemento, backup);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementChanged, indice, elemento, backup);
        };
        /**
        Inserta un elemento al final de la colección. Dispara evento "insert_at" y "changed" con los mismos argumentos
        @method push
        @param {Mixed} elemento
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        Collection.prototype.push = function (elemento, noTriggerear) {
            var indice = -1;
            if (this.opciones.key) {
                if (!(this.opciones.key in elemento)) {
                    console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                    return indice;
                }
                if (elemento[this.opciones.key] in this.__indice__) {
                    console.error('El elemento insertado ya existe en la coleccion ' + this.opciones.key + "=" + elemento[this.opciones.key]);
                    return indice;
                }
            }
            indice = this.array.push(elemento) - 1;
            try {
                this._indizar(elemento, indice);
            }
            catch (e) {
                this.array.pop();
                console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                return -1;
            }
            if (!noTriggerear) {
                this.emit(Collection.EVENTS.ElementInserted, indice, elemento);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementInserted, indice, elemento);
            }
            return indice;
        };
        /**
        Quita el elemento al final de la colección. Dispara evento "remove_at" y "changed" con los mismos argumentos
        @method pop
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        Collection.prototype.pop = function (noTriggerear) {
            if (this.array.length > 0) {
                var ret = this.array.pop();
                this._deindizar(ret);
                if (!noTriggerear) {
                    this.emit(Collection.EVENTS.ElementRemoved, this.array.length, ret);
                    this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRemoved, this.array.length, ret);
                }
                return ret;
            }
            return null;
        };
        Collection.prototype.addRange = function (array, noTriggerearCadaUno, noTriggerear) {
            if (!array)
                return this;
            var inicio = this.array.length - 1;
            this.agregandoLote = true;
            if (Object.prototype.toString.call(array).toLowerCase() === "[object array]" || array instanceof Collection) {
                if ('forEach' in array && typeof array.forEach == 'function') {
                    var that = this;
                    array.forEach(function (elem) {
                        that.push(elem, noTriggerearCadaUno);
                    });
                }
                else {
                    for (var i = 0; i < array.length; i++)
                        this.push(array[i], noTriggerearCadaUno);
                }
            }
            else {
                for (var i_1 in array)
                    this.push(array[i_1], noTriggerearCadaUno);
            }
            if (!noTriggerear) {
                this.emit(Collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
            }
            this.agregandoLote = false;
            return this;
        };
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        Si la coleccion tiene Key entonces busca en el indice. no importa que no sea el mismo elemento. De otro modo busca la referencia a ese elemento.

        @method update
        @param {Mixed} elemento El elemento a ser actualizado
        */
        Collection.prototype.update = function (elemento) {
            var indice = -1;
            if (this.opciones.key && this.opciones.key in elemento && elemento[this.opciones.key] in this.__indice__ && this.array[indice = this.__indice__[elemento[this.opciones.key]]] === elemento) {
                return this.updateIndex(indice);
            }
            return this.updateIndex(this.indexOf(elemento));
        };
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        @method updateByKey
        @param {String} key clave a ser buscada en el índice interno
        */
        Collection.prototype.updateByKey = function (key) {
            if (this.opciones.key && key in this.__indice__) {
                return this.updateIndex(this.__indice__[key]);
            }
        };
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        @method updateIndex
        @param {Nuber} indice ïndice del elemento a ser actualizado
        */
        Collection.prototype.updateIndex = function (index) {
            if (index != -1) {
                var elemento = this.getAt(index);
                this.emit(Collection.EVENTS.ElementChanged, index, elemento, elemento);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementChanged, index, elemento, elemento);
            }
            return this;
        };
        Collection.prototype.join = function (delimitador) {
            return this.array.join(delimitador);
        };
        /**
        Suma elementos
        @method sum
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        Collection.prototype.sum = function (options) {
            var result = [];
            var groupByField = options.groupBy || null;
            var sumarizarSubSet = function (col) {
                var out = null;
                var cant = 0;
                col.forEach(function (elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!options || ((!options.filtroCampos || options.filtroCampos.indexOf(i) != -1) && (!options.exclude || options.exclude.indexOf(i) == -1)))) {
                                out[i] = (out[i] || 0) + elem[i];
                            }
                        }
                        out['[[cantidad]]']++;
                    }
                    else {
                        out = {};
                        Object.defineProperty(out, '[[cantidad]]', {
                            enumerable: false,
                            get: function () { return cant; },
                            set: function (value) { cant = value; }
                        });
                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!options || ((!options.filtroCampos || options.filtroCampos.indexOf(i) != -1) && (!options.exclude || options.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                        out['[[cantidad]]'] = 1;
                    }
                });
                return out;
            };
            if (groupByField == null)
                return sumarizarSubSet(this);
            var subsets = this.groupBy(groupByField);
            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }
            return result;
        };
        /**
         *	Simplemente ordena la colección. "what" puede tener cualquiera de estos formatos
         *		'Campo ASC, CampoB DESC'
         *		function(a, b) { return (a.Campo > b.Campo ? 1 : - 1) }
         *		'Campo'
         *
         *
         *	@method orderBy
         *	@param {Mixed} what
         */
        Collection.prototype.orderBy = function (what) {
            var orderBy = what ? mz.data.order.build(what) : undefined;
            this.array.sort(orderBy);
            this._reindizar();
            this.emit(Collection.EVENTS.CollectionSorted, what, 'ASC');
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, what);
            return this;
        };
        Collection.prototype.orderByDesc = function (what) {
            var fn = what ? mz.data.order.build(what) : null;
            if (fn) {
                this.array.sort(function (a, b) {
                    return -fn(a, b);
                });
            }
            else {
                this.array.sort();
                this.array.reverse();
            }
            this._reindizar();
            this.emit(Collection.EVENTS.CollectionSorted, what, 'DESC');
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, what);
            return this;
        };
        /**
        Devuelve true si hay algun elemento que cumpla con la condición
        @method some
        @param {Function} condicion
        */
        Collection.prototype.some = function (condition) {
            if ('some' in this.array)
                return this.array.some(condition);
            for (var i = 0; i < this.array.length; i++)
                if (i in this && condition.call(arguments[1], this[i], i, this))
                    return true;
            return false;
        };
        /**
         *	Devuelve una coleccion de elementos que cumplan con la condición. También se puede llamar usando dos argumentos
         *			.where('Campo', 3)
         *	Y va a devolver una colección con todos los elementos de la primera que tengan Campo == 3
         *	@method where
         *	@param {Function} condicion
         */
        Collection.prototype.where = function (campoOCondicion, valorCampo) {
            if (typeof campoOCondicion === "string") {
                var arr = new Collection();
                for (var i = 0; i < this.array.length; i++)
                    if ((i in this.array) && this.array[i][campoOCondicion] == arguments[1])
                        arr.push(this.array[i]);
                return arr;
            }
            else {
                if (this.array.filter)
                    return new Collection(this.array.filter(campoOCondicion));
                var arr = new Collection();
                for (var i = 0; i < this.array.length; i++)
                    if ((i in this.array) && campoOCondicion(this.array[i]))
                        arr.push(this.array[i]);
                return arr;
            }
        };
        /**
        Remueve un elemento buscandolo por clave
        @method removeByKey
        @param {String} key
        */
        Collection.prototype.removeByKey = function (key) {
            var indice = this.indexedGetIndex(key);
            if (indice != -1)
                return this.removeAt(indice);
        };
        /**
        Remueve el elemento pasado, o varios elementos en base a una condición.

        - Si se pasa el elemento para remover && la colección tiene clave primaria se va a remover por clave y no por referencia del objeto.
        - Si se pasa uno solo y hay varios elementos que matchean o esta repetido en la colección se va a remover el ultimo.
        - De esta forma se desencadena el evento "remove_at" y "changed" con los mismos argumentos

        Si se pasa una cóndición, el método devuelve una colección con los elementos quitados.

        - De esta forma se desencadena el evento "removed" y "changed" con los mismos argumentos

        @method remove
        @param {Mixed} condicion/elemento
        */
        Collection.prototype.remove = function (condicion) {
            var fn = condicion;
            var tipo = typeof fn;
            if (arguments.length == 1) {
                var cual = -1;
                if (this.opciones.key && this.opciones.key in fn) {
                    cual = this.indexedGetIndex(fn[this.opciones.key]);
                    if (cual !== -1 && fn !== this.getAt(cual)) {
                        cual = -1;
                    }
                }
                if (cual == -1)
                    cual = this.lastIndexOf(fn);
                if (cual != -1) {
                    return [this.removeAt(cual)];
                }
                if (tipo == 'object' || tipo == 'number' || tipo == 'boolean')
                    return null;
            }
            if (tipo === 'function') {
                var sacadas = [];
                for (var i = 0; i < this.array.length; i++) {
                    if (i in this.array) {
                        if (condicion(this.array[i])) {
                            sacadas.push({
                                i: i,
                                e: this.array[i]
                            });
                        }
                    }
                }
                var that = this;
                var salida = [];
                if (sacadas.length) {
                    sacadas.forEach(function (e) {
                        that.remove(e.e);
                        salida.push(e.e);
                    });
                    this.emit(Collection.EVENTS.ElementRangeRemoved, salida);
                    this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRangeRemoved, salida);
                }
                return salida;
            }
        };
        Collection.prototype.single = function (field, value) {
            if (arguments.length == 2 && typeof field == "string") {
                //Busco por el indice
                if (this.opciones.key) {
                    if (field === this.opciones.key) {
                        if (arguments[1] in this.__indice__) {
                            var tmp = this.array[this.__indice__[arguments[1]]];
                            if (tmp && tmp[field] == arguments[1])
                                return tmp;
                        }
                    }
                }
                for (var i = 0; i < this.array.length; i++)
                    if (this.array[i] && this.array[i][field] == arguments[1])
                        return this.array[i];
            }
            else {
                for (var i = 0; i < this.array.length; i++)
                    if (this.array[i] && field(this.array[i]))
                        return this.array[i];
            }
            return null;
        };
        /**
        Devuelve true si la coleccion contiene el elemento (busca por referencia, tiene que ser EL MISMO)
        @method contains
        @param {Object} elemento
        */
        Collection.prototype.contains = function (elem) {
            return this.array.indexOf(elem) != -1;
        };
        /**
        Devuelve true si la coleccion contiene la clave
        @method containsKey
        @param {String} key
        */
        Collection.prototype.containsKey = function (key) {
            if (this.opciones.key) {
                return (key in this.__indice__);
            }
            else {
                throw "La coleccion no tiene key";
            }
        };
        /**
        Devuelve el indice de la primer ocurrencia del elemento. Si no lo encuentra devuelve -1
        @method indexOf
        @param {Object} elemento
        */
        Collection.prototype.indexOf = function (elem) { return this.array.indexOf(elem); };
        /**
        Devuelve el indice de la última ocurrencia del elemento. Si no lo encuentra devuelve -1
        @method lastIndexOf
        @param {Object} elemento
        */
        Collection.prototype.lastIndexOf = function (elem) { return this.array.lastIndexOf(elem); };
        /**
        Crea un array y lo llena con el contenido de la colección
        @method toArray
        */
        Collection.prototype.toArray = function () {
            var t = [];
            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && t.push(this.array[i]);
            return t;
        };
        /**
        Clona la colección. Las referencias a los objetos van a ser las mismas.
        @method clone
        */
        Collection.prototype.clone = function () {
            var coll = new Collection(null, mz.copy(this.opciones));
            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && coll.push(this.array[i]);
            return coll;
        };
        /**
        Obtiene un elemento buscando en el indice interno por clave primaria
        @method indexedGet
        @param {String} key
        */
        Collection.prototype.indexedGet = function (key) {
            if (this.opciones.key) {
                if (key in this.__indice__)
                    return this.array[this.__indice__[key]];
            }
            return null;
        };
        /**
        Obtiene el índice un elemento buscando en el indice interno por clave primaria
        @method indexedGetIndex
        @param {String} key
        */
        Collection.prototype.indexedGetIndex = function (key) {
            if (this.opciones.key) {
                if (key in this.__indice__)
                    return this.__indice__[key];
            }
            return -1;
        };
        /**
        Hace un merge de un elemento dentro de la colección. Busca el elemento por clave primaria y actualiza sus prupiedades copiandole los nuevos campos. Si no lo encuentra lo inserta.
        @method mergeElem
        @param {Object} elem
        */
        Collection.prototype.mergeElem = function (elem) {
            if (this.opciones.key) {
                if (!(this.opciones.key in elem)) {
                    throw new Error("El elemento no contiene la clave primaria");
                }
                var indice = this.indexedGetIndex(elem[this.opciones.key]);
                if (indice != -1) {
                    mz.copy(this.array[indice], elem);
                    this.updateIndex(indice);
                    return this.array[indice];
                }
                else {
                    this.push(elem);
                    return elem;
                }
            }
        };
        /**
            Buscar el o los elementos mas grandes
            @method max
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        Collection.prototype.max = function (opc) {
            var result = [];
            var groupByField = opc.groupBy || null;
            var sumarizarSubSet = function (col) {
                var out = null;
                col.forEach(function (elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                if (elem[i] != null && (!(i in out) || out[i] < elem[i]))
                                    out[i] = elem[i];
                            }
                        }
                    }
                    else {
                        out = {};
                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                    }
                });
                return out;
            };
            if (groupByField == null)
                return sumarizarSubSet(this);
            var subsets = this.groupBy(groupByField);
            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }
            return result;
        };
        /**
            Buscar el o los elementos mas chicos
            @method min
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        Collection.prototype.min = function (opc) {
            var result = [];
            var groupByField = opc.groupBy || null;
            var sumarizarSubSet = function (col) {
                var out = null;
                col.forEach(function (elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                if (elem[i] != null && (!(i in out) || out[i] > elem[i]))
                                    out[i] = elem[i];
                            }
                        }
                    }
                    else {
                        out = {};
                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                    }
                });
                return out;
            };
            if (groupByField == null)
                return sumarizarSubSet(this);
            var subsets = this.groupBy(groupByField);
            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }
            return result;
        };
        /**
        Promedio de los elementos.
    
        Cada elemento de el array de retorno tiene además la propiedad '[[cantidad]]' que indica la cantidad de elementos de ese subconjunto.
        @method avg
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        Collection.prototype.avg = function (opc) {
            var that = this;
            var suma = this.sum(opc);
            for (var fila in suma) {
                for (var campo in suma[fila]) {
                    if (campo == '[[cantidad]]' || campo == opc.groupBy)
                        continue;
                    suma[fila][campo] /= suma[fila]['[[cantidad]]'];
                }
            }
            return suma;
        };
        Collection.prototype.take = function (cantidad, from) {
            if (from === void 0) { from = 0; }
            var ret = [];
            this.takeInto(ret, cantidad, from);
            return ret;
        };
        Collection.prototype.takeInto = function (destino, cantidad, from) {
            if (from === void 0) { from = 0; }
            var hasta = Math.min(this.array.length + cantidad, this.array.length);
            from = mz.intval(from);
            var outer_i = 0;
            for (var i = from; i < hasta; i++)
                destino.push(this.array[i]);
            return this;
        };
        Collection.prototype.swapItems = function (primero, segundo) {
            var viejo = this.array[segundo];
            this.array[segundo] = this.array[primero];
            this.array[primero] = viejo;
            this._reindizar();
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
            this.emit(Collection.EVENTS.Changed, 'swap', primero, segundo);
            return this;
        };
        Collection.prototype.count = function (groupBy) {
            var fn;
            if (typeof groupBy == 'function') {
                fn = groupBy;
            }
            var result = [];
            var that = this;
            if (fn) {
                var grupos = {};
                this.forEach(function (elem) {
                    var gb = fn(elem);
                    if (!(gb in grupos)) {
                        var obj = {
                            'Count': 0
                        };
                        obj['[[cantidad]]'] = 0;
                        grupos[gb] = obj;
                    }
                    grupos[gb]['[[cantidad]]']++;
                });
                for (var i in grupos) {
                    grupos[i].Count = grupos[i]['[[cantidad]]'];
                    grupos[i][groupBy.toString()] = i;
                    result.push(grupos[i]);
                }
            }
            else {
                var out = {
                    Count: 0
                };
                out['[[cantidad]]'] = this.array.length;
                out.Count = out['[[cantidad]]'];
                result.push(out);
            }
            return result;
        };
        /** Reverses the actual collections order */
        Collection.prototype.reverse = function () {
            this.array.reverse();
            this.emit(Collection.EVENTS.CollectionSorted);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
        };
        /**
         * Mergea una colección contra un array o colección. cuando eliminarNoMatcheados == true, Hace una intersección
         * - Merged = (Original ∈ New) + (New ∉ Original)
         * En todos los casos se va a llamar un evento changed del tipo insert_at, set_at o remove_at dependiendo de la operación.
         */
        Collection.prototype.mergeArray = function (array, eliminarNoMatcheados) {
            var _this = this;
            var ret = {
                added: [],
                removed: []
            };
            if (this.opciones.key) {
                var keys = {};
                //array.forEach(function(elem, index) {
                for (var index in array) {
                    var elem = array[index];
                    if (!(this.opciones.key in elem)) {
                        throw new TypeError("El elemento no contiene la clave primaria");
                    }
                    var indice = this.indexedGetIndex(elem[this.opciones.key]);
                    keys[elem[this.opciones.key]] = true;
                    if (indice != -1) {
                        mz.copy(this.array[indice], elem);
                        this.updateIndex(indice);
                    }
                    else {
                        this.push(elem);
                        ret.added.push(elem);
                    }
                }
                //});
                if (eliminarNoMatcheados) {
                    ret.removed = this.remove(function (elem) {
                        return !(elem[_this.opciones.key] in keys);
                    });
                }
            }
            else
                console.error("You cannot mergeArray if the collection does not have 'key'");
            return ret;
        };
        Collection.prototype.createView = function () {
            return new CollectionView(this, mz.copy(this.opciones));
        };
        /**
         * Usar con cuidado.
         */
        Collection.prototype.getPrivateArray = function () { return this.array; };
        Collection.EVENTS = mz.copy({
            BeforeClearCollection: 'pre_clear',
            AfterClearCollection: 'clear',
            Changed: 'changed',
            ElementInserted: 'insert_at',
            ElementChanged: 'set_at',
            ElementRemoved: 'remove_at',
            ElementRangeInserted: 'addRange',
            CollectionSorted: 'sorted',
            ElementRangeRemoved: 'removed'
        }, mz.MVCObject.EVENTS);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Boolean)
        ], Collection.prototype, "agregandoLote", void 0);
        return Collection;
    })(mz.MVCObject);
    mz.Collection = Collection;
    var CollectionView = (function (_super) {
        __extends(CollectionView, _super);
        function CollectionView(base, opc) {
            var _this = this;
            _super.call(this, null, opc);
            this.set('filter', null);
            this.set('order', null);
            this.on('filter_changed', function (nuevo, viejo) {
                _this._handleChanged('filter', nuevo, viejo);
            });
            this.on('order_changed', function (nuevo, viejo) {
                _this._handleChanged('order', nuevo, viejo);
            });
            this.attachTo(base);
        }
        CollectionView.prototype._handleChanged = function (tipo, nuevo, viejo) {
            var necesitoReOrdenar = tipo == 'order' || tipo == Collection.EVENTS.CollectionSorted || tipo == 'insert_at' || tipo == 'set_at' || tipo == 'addRange';
            if (tipo == 'clear') {
                this.clear();
                necesitoReOrdenar = false;
            }
            if (tipo == 'addRange' || tipo == 'filter') {
                this._remake();
                necesitoReOrdenar = true;
            }
            if (necesitoReOrdenar) {
                this.resort();
            }
        };
        CollectionView.prototype._remake = function (noTriggerear) {
            this.clear(noTriggerear);
            if (this.get('parent')) {
                var arr = this.get('parent').getPrivateArray();
                var filtro = this.get('filter');
                if (filtro) {
                    for (var i in arr)
                        if (filtro.call(this, arr[i]))
                            this.push(arr[i], noTriggerear);
                }
                else
                    for (var i in arr)
                        this.push(arr[i], noTriggerear);
            }
            this.resort();
        };
        CollectionView.prototype.resort = function () {
            var orden = this.get('order');
            if (orden) {
                var vieja = [];
                for (var i in this.array)
                    vieja[i] = this.array[i];
                var fn = orden.q ? mz.data.order.build(orden.q) : null;
                if (fn) {
                    if (orden.desc)
                        this.array.sort(function (a, b) {
                            return -fn(a, b);
                        });
                    else
                        this.array.sort(fn);
                }
                else {
                    this.array.sort();
                    orden.desc && this.array.reverse();
                }
                for (var i in this.array) {
                    if (this.array[i] !== vieja[i]) {
                        this._reindizar();
                        this.emit(Collection.EVENTS.CollectionSorted, orden.q, orden.desc ? 'DESC' : 'ASC');
                        this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, orden.q);
                        break;
                    }
                }
            }
        };
        CollectionView.prototype.refresh = function () {
            this._remake();
        };
        CollectionView.prototype.filter = function (filter) {
            this.set('filter', filter);
            return this;
        };
        CollectionView.prototype.orderBy = function (q) {
            this.set('order', {
                q: q,
                desc: false
            });
            return this;
        };
        CollectionView.prototype.orderByDesc = function (q) {
            this.set('order', {
                q: q,
                desc: true
            });
            return this;
        };
        CollectionView.prototype.attachTo = function (obj) {
            this.detach();
            this.set('bindeosParent', []);
            this.set('parent', obj);
            if (obj) {
                var that = this;
                this.get('bindeosParent').push(obj.on(Collection.EVENTS.AfterClearCollection, function () {
                    that.clear();
                }));
                this.get('bindeosParent').push(obj.on(Collection.EVENTS.BeforeClearCollection, function (noPropagado) {
                    that.trigger(CollectionView.EVENTS.BeforeClearCollection, noPropagado);
                }));
                this.get('bindeosParent').push(obj.on('changed', function (tipo, a1, a2) {
                    if ((tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged) && obj.agregandoLote)
                        return;
                    var filter = that.get('filter');
                    if (tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged || tipo == Collection.EVENTS.ElementRemoved) {
                        var indice = that.indexOf(a2);
                        if (!filter || filter(a2)) {
                            switch (tipo) {
                                case Collection.EVENTS.ElementInserted:
                                    if (indice == -1) {
                                        that.push(a2);
                                        that.resort();
                                    }
                                    return;
                                case Collection.EVENTS.ElementChanged:
                                    if (indice != -1) {
                                        that.updateIndex(indice);
                                    }
                                    else {
                                        that.push(a2);
                                    }
                                    that.resort();
                                    return;
                                case Collection.EVENTS.ElementRemoved:
                                    if (indice != -1) {
                                        that.removeAt(indice);
                                        return;
                                    }
                            }
                        }
                        else {
                            if (indice != -1) {
                                that.removeAt(indice);
                                return;
                            }
                        }
                    }
                    if (tipo == 'refresh') {
                        that._remake();
                        return;
                    }
                    that._handleChanged.apply(that, arguments);
                }));
                this._remake();
            }
        };
        CollectionView.prototype.detach = function () {
            if (this.get('bindeosParent') && this.get('parent')) {
                this.clear();
                var bindeos = this.get('bindeosParent');
                for (var i in bindeos)
                    bindeos[i].off();
                bindeos.length = 0;
                this.set('bindeosParent', null);
                this.set('parent', null);
            }
        };
        return CollectionView;
    })(Collection);
    mz.CollectionView = CollectionView;
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
var Reflect;
(function (Reflect) {
    var originalMetadata = Reflect.metadata;
    Reflect.MetadataInfo = Symbol("mz.metadata.typings");
    var valueSetter = {
        enumerable: false,
        writable: false,
        configurable: false,
        value: null
    };
    function metadata(metadataKey, metadataValue) {
        if ('design:type' == metadataKey) {
            if (typeof Reflect.MetadataInfo == "string") {
                return function decorator(target, targetKey) {
                    var typings = target[Reflect.MetadataInfo];
                    if (!typings) {
                        typings = setObjectSymbol(target, Reflect.MetadataInfo, {});
                    }
                    typings[targetKey] = metadataValue;
                    originalMetadata && originalMetadata(metadataKey, metadataValue).apply(this, arguments);
                };
            }
            else {
                return function decorator(target, targetKey) {
                    var typings = (target[Reflect.MetadataInfo] = target[Reflect.MetadataInfo] || {});
                    typings[targetKey] = metadataValue;
                    originalMetadata && originalMetadata(metadataKey, metadataValue).apply(this, arguments);
                };
            }
        }
        else
            return originalMetadata && originalMetadata(metadataKey, metadataValue) || undefined;
    }
    Reflect.metadata = metadata;
    function setObjectSymbol(target, symbol, value) {
        if (typeof symbol == "symbol") {
            target[symbol] = value;
        }
        else {
            valueSetter.value = value;
            Object.defineProperty(target, symbol.toString(), valueSetter);
        }
        return value;
    }
    Reflect.setObjectSymbol = setObjectSymbol;
})(Reflect || (Reflect = {}));
/// <reference path="AMD/Require.ts" />
var mz;
(function (mz) {
    mz.route = {
        start: function (options, cb) {
            var gotBackbone = function (b) {
                mz.route = mz.route = new (b.Router.extend(options))();
                b.history.start();
                mz.route.start = function (a, b) {
                    b && b(mz.route);
                };
                console.log("Backbone loaded! Route started!", mz.route);
                cb && cb(mz.route);
            };
            mz.globalContext.Backbone && gotBackbone(mz.globalContext.Backbone) || mz.require("backbone", function (b) { return gotBackbone(b); });
        }
    };
})(mz || (mz = {}));
/// <reference path="../mz.ts" />
var mz;
(function (mz) {
    var css;
    (function (css) {
        var _estilos_guardados = {};
        var _hoja_estilo = $('<link rel="stylesheet" type="text/css">');
        $(function () {
            _hoja_estilo.appendTo("body");
        });
        var _acum_estilos = (Math.random() * 32565) | 0;
        var _reescribir_css = mz.delayer(function () {
            var buffer = '';
            for (var i in _estilos_guardados) {
                buffer += i + ' {';
                for (var e in _estilos_guardados[i]) {
                    var value = _estilos_guardados[i][e];
                    if (typeof value === "number" && !jQuery.cssNumber[e]) {
                        value += "px";
                    }
                    buffer += e + ': ' + value + ';';
                }
                buffer += '}';
            }
            _hoja_estilo.attr('href', 'data:text/css;base64,' + btoa(buffer));
        }, 16);
        function set(selectorOrValues, selectorValues) {
            var nueva = false;
            var nombre_clase = '';
            if (!isDef(selectorValues)) {
                if (mz.isIterable(selectorOrValues)) {
                    var array_clases = [];
                    for (var i in selectorOrValues) {
                        if (typeof selectorOrValues[i] != "object") {
                            nueva = true;
                            break;
                        }
                        mz.copy(_estilos_guardados[i] = (_estilos_guardados[i] || {}), selectorOrValues[i]);
                        array_clases.push(i);
                    }
                    nombre_clase = array_clases.join(" ");
                }
                if (nueva === true) {
                    nombre_clase = '.-mzcss-' + (_acum_estilos++).toString(32);
                    set(nombre_clase, selectorOrValues);
                }
            }
            else {
                nombre_clase = selectorOrValues;
                mz.copy(_estilos_guardados[selectorOrValues] = (_estilos_guardados[selectorOrValues] || {}), selectorValues);
            }
            _reescribir_css();
            if (nombre_clase.indexOf(".") != -1) {
                return nombre_clase.replace(".", "");
            }
            else {
                return null;
            }
        }
        css.set = set;
        var Stylesheet = (function () {
            function Stylesheet(prefix) {
                var _this = this;
                this.prefix = null;
                this.elem = $('<link rel="stylesheet" type="text/css">');
                this.estilo = {};
                this.remake = null;
                this.destino = 'body';
                if (prefix instanceof jQuery) {
                    this.destino = prefix;
                    prefix = ':host';
                }
                this.prefix = prefix;
                $(function () {
                    _this.enable();
                });
            }
            Stylesheet.prototype.enable = function () {
                this.elem.appendTo(this.destino);
            };
            Stylesheet.prototype.disable = function () {
                this.elem.remove();
            };
            Stylesheet.prototype.refresh = function () {
                if (!this.remake) {
                    var that = this;
                    this.remake = mz.delayer(function () {
                        var buffer = '';
                        for (var i in that.estilo) {
                            buffer += (that.prefix ? that.prefix + ' ' : '') + i + ' {';
                            for (var e in that.estilo[i]) {
                                var value = that.estilo[i][e];
                                if (typeof value === "number" && !jQuery.cssNumber[e]) {
                                    value += "px";
                                }
                                buffer += e + ': ' + value + ';';
                            }
                            buffer += '}';
                        }
                        that.elem.attr('href', 'data:text/css;base64,' + btoa(buffer));
                    }, 9);
                }
                this.remake();
            };
            Stylesheet.prototype.set = function (property, val) {
                this.estilo[property] = this.estilo[property] || {};
                mz.copy(this.estilo[property], val);
                this.refresh();
            };
            return Stylesheet;
        })();
        css.Stylesheet = Stylesheet;
    })(css = mz.css || (mz.css = {}));
})(mz || (mz = {}));
/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />
var MzModelDirective = (function (_super) {
    __extends(MzModelDirective, _super);
    function MzModelDirective() {
        _super.apply(this, arguments);
        this.delayedBinding = null;
    }
    MzModelDirective.prototype.unmount = function () {
        this.teardown();
        _super.prototype.unmount.call(this);
    };
    MzModelDirective.prototype.teardown = function () {
        this.delayedBinding && this.widget.DOM.off(MzModelDirective.jqueryBindings, this.delayedBinding);
        this.componentBinding && this.componentBinding.off();
        this.componentBinding = null;
        this.delayedBinding = null;
    };
    MzModelDirective.prototype.changed = function (value, prevVal) {
        var _this = this;
        this.teardown();
        if (this.widget instanceof mz.widgets.MzInput) {
            this.widgetValueBinding = this.widget.on("value_changed", function (newVal) {
                if (newVal != _this.component[value])
                    _this.component[value] = newVal;
            });
            this.componentBinding = this.component.on(value + "_changed", function (newVal) {
                var actualVal = _this.widget.value;
                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    _this.widget.value = newVal;
            });
        }
        else if (value && (this.widget.rootNode.nodeName.toUpperCase() == 'INPUT' || this.widget.rootNode.nodeName.toUpperCase() == 'SELECT')) {
            this.delayedBinding = function () {
                var actualVal = _this.widget.DOM.val();
                if (actualVal != _this.component[value])
                    _this.component[value] = actualVal;
            };
            // detecto los cambios
            this.changeBinding = this.widget.DOM.on(MzModelDirective.jqueryBindings, this.delayedBinding);
            this.componentBinding = this.component.on(value + "_changed", function (newVal) {
                var actualVal = _this.widget.DOM.val();
                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    _this.widget.DOM.val(newVal);
            });
        }
    };
    MzModelDirective.symbol2wb = Symbol("mz-model-binding");
    MzModelDirective.jqueryBindings = 'changed keyup paste lostfocus search';
    MzModelDirective = __decorate([
        /// <reference path="../../mz.ts" />
        mz.AttributeDirective.Register("mz-model"), 
        __metadata('design:paramtypes', [])
    ], MzModelDirective);
    return MzModelDirective;
})(mz.AttributeDirective);
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var MzInput = (function (_super) {
            __extends(MzInput, _super);
            function MzInput() {
                _super.apply(this, arguments);
            }
            MzInput.prototype.focus = function () {
                if (this.rootNode instanceof HTMLElement) {
                    this.rootNode.focus();
                }
            };
            MzInput.prototype.checkValid = function (formData) {
                return true;
            };
            __decorate([
                mz.Widget.Attribute, 
                __metadata('design:type', Object)
            ], MzInput.prototype, "value", void 0);
            __decorate([
                mz.Widget.Attribute, 
                __metadata('design:type', Boolean)
            ], MzInput.prototype, "disabled", void 0);
            __decorate([
                mz.Widget.Attribute, 
                __metadata('design:type', Boolean)
            ], MzInput.prototype, "visible", void 0);
            MzInput = __decorate([
                mz.Widget.RegisterComponent('input'), 
                __metadata('design:paramtypes', [])
            ], MzInput);
            return MzInput;
        })(mz.Widget);
        widgets.MzInput = MzInput;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../Widget.ts" />
var MzRawDirective = (function (_super) {
    __extends(MzRawDirective, _super);
    function MzRawDirective() {
        _super.apply(this, arguments);
    }
    MzRawDirective.prototype.changed = function (val) {
        this.widget.contentNode.innerHTML = val;
    };
    MzRawDirective = __decorate([
        /// <reference path="../Widget.ts" />
        mz.AttributeDirective.Register("mz-raw"), 
        __metadata('design:paramtypes', [])
    ], MzRawDirective);
    return MzRawDirective;
})(mz.AttributeDirective);
var MzClassNameDirective = (function (_super) {
    __extends(MzClassNameDirective, _super);
    function MzClassNameDirective() {
        _super.apply(this, arguments);
    }
    MzClassNameDirective.prototype.changed = function (value, prevVal) {
        if (this.widget.rootNode.className != value)
            //this.widget.rootNode.className = value;
            mz.dom.microqueue.setAttribute(this.widget.rootNode, 'class', value);
    };
    MzClassNameDirective = __decorate([
        mz.AttributeDirective.Register("class"), 
        __metadata('design:paramtypes', [])
    ], MzClassNameDirective);
    return MzClassNameDirective;
})(mz.AttributeDirective);
/// <reference path="../Widget.ts" />
/// <reference path="className.ts" />
var MzVisibleDirective = (function (_super) {
    __extends(MzVisibleDirective, _super);
    function MzVisibleDirective() {
        _super.apply(this, arguments);
    }
    MzVisibleDirective.prototype.mount = function () {
        var _this = this;
        this.listener = this.widget.on('class_changed', function () { return _this.changed(_this.value); });
    };
    MzVisibleDirective.prototype.unmount = function () {
        this.listener.off();
        this.listener = null;
    };
    MzVisibleDirective.prototype.changed = function (val) {
        if (CBool(val)) {
            mz.dom.adapter.removeClass(this.widget.rootNode, MzVisibleDirective.vendorHiddenClass);
            try {
                mz.dom.adapter.removeAttribute(this.widget.rootNode, 'aria-hidden');
            }
            catch (e) { }
            try {
                mz.dom.adapter.removeAttribute(this.widget.rootNode, mz.HIDDEN_PROP);
            }
            catch (e) { }
            this._value = true;
        }
        else {
            mz.dom.adapter.addClass(this.widget.rootNode, MzVisibleDirective.vendorHiddenClass);
            try {
                mz.dom.adapter.setAttribute(this.widget.rootNode, 'aria-hidden', 'true');
            }
            catch (e) { }
            try {
                mz.dom.adapter.setAttribute(this.widget.rootNode, mz.HIDDEN_PROP, mz.HIDDEN_PROP);
            }
            catch (e) { }
            this._value = false;
        }
    };
    MzVisibleDirective.vendorHiddenClass = 'mz-hidden';
    MzVisibleDirective = __decorate([
        /// <reference path="../Widget.ts" />
        mz.AttributeDirective.Register("visible"), 
        __metadata('design:paramtypes', [])
    ], MzVisibleDirective);
    return MzVisibleDirective;
})(mz.AttributeDirective);
var mz;
(function (mz) {
    var view;
    (function (view) {
        function html(literalSections) {
            var substs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                substs[_i - 1] = arguments[_i];
            }
            // Use raw literal sections: we don’t want
            // backslashes (\n etc.) to be interpreted
            var raw = literalSections.raw;
            var result = '';
            substs.forEach(function (subst, i) {
                // Retrieve the literal section preceding
                // the current substitution
                var lit = raw[i];
                // In the example, map() returns an array:
                // If substitution is an array (and not a string),
                // we turn it into a string
                if (Array.isArray(subst)) {
                    subst = subst.join('');
                }
                // If the substitution is preceded by a dollar sign,
                // we dont escape special characters in it
                if (!lit.endsWith('$')) {
                    subst = html.escape(subst);
                }
                else {
                    lit = lit.slice(0, -1);
                }
                result += lit;
                result += subst;
            });
            // Take care of last literal section
            // (Never fails, because an empty template string
            // produces one literal section, an empty string)
            result += raw[raw.length - 1]; // (A)
            return result;
        }
        view.html = html;
    })(view = mz.view || (mz.view = {}));
})(mz || (mz = {}));
var mz;
(function (mz) {
    var view;
    (function (view) {
        var html;
        (function (html) {
            function escape(str) {
                if (str === undefined || str == null)
                    return '';
                if (str === false || str === false)
                    return str ? 'true' : 'false';
                return str && (str = str.toString()) && str.replace(/&/g, '&amp;') // first!
                    .replace(/>/g, '&gt;')
                    .replace(/</g, '&lt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/`/g, '&#96;');
            }
            html.escape = escape;
        })(html = view.html || (view.html = {}));
    })(view = mz.view || (mz.view = {}));
})(mz || (mz = {}));
/// <reference path="Widget.ts" />
var mz;
(function (mz) {
    var vdom;
    (function (vdom) {
        function createElement(type, props) {
            var children = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                children[_i - 2] = arguments[_i];
            }
            var ctor = null;
            if (typeof type === "string") {
                ctor = mz.widgets.BaseElement;
                var typeStr = type.toLowerCase();
                if (typeStr in mz.widgets)
                    ctor = mz.widgets[typeStr];
                if (props && props instanceof Array && !children)
                    children = props;
                props = null;
            }
            else
                ctor = type;
            return new ctor(null, props || {}, children || []);
        }
        vdom.createElement = createElement;
        vdom.__spread = mz.copy;
    })(vdom = mz.vdom || (mz.vdom = {}));
})(mz || (mz = {}));
var mz;
(function (mz) {
    /**
     * Hyperscript for JSX or TSX
     */
    function h(componentName, attr) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var clase = mz.widgets.BaseElement;
        componentName = componentName.toLowerCase();
        if (componentName in mz.widgets)
            clase = mz.widgets[componentName];
        if (attr && attr instanceof Array && !children)
            attr = children;
        return new clase(null, attr || {}, children || []);
    }
    mz.h = h;
})(mz || (mz = {}));
/// <reference path="../VIEW/Widget.ts" />
/// <reference path="../VIEW/Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var flexStyles = new mz.css.Stylesheet();
        flexStyles.disable();
        flexStyles.set('.mz-fit', {
            'position': 'absolute',
            'top': '0',
            'bottom': '0',
            'left': '0',
            'right': '0'
        });
        flexStyles.set('.mz-flex-row', {
            'display': 'flex',
            '-webkit-flex-wrap': 'wrap',
            '-ms-flex-wrap': 'wrap',
            'flex-wrap': 'wrap',
            'width': '100%',
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            'box-sizing': 'border-box'
        });
        flexStyles.set('.mz-flex-col', {
            '-webkit-box-flex': '1',
            '-webkit-flex': '1',
            '-moz-box-flex': '1',
            '-moz-flex': '1',
            '-ms-flex': '1',
            'flex': '1',
            'display': 'flex',
            'width': '100%',
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            'box-sizing': 'border-box',
            '-webkit-flex-direction': 'column',
            'flex-direction': 'column',
            'position': 'relative'
        });
        flexStyles.set('.mz-flex-cell', {
            '-webkit-flex': 'auto',
            '-moz-box-flex': 'auto',
            '-moz-flex': 'auto',
            '-ms-flex': '1 1 auto',
            'flex': 'auto'
        });
        flexStyles.enable();
        var Fit = (function (_super) {
            __extends(Fit, _super);
            function Fit() {
                _super.apply(this, arguments);
            }
            Fit.prototype.class_changed = function () {
                this.rootNode.classList.add('mz-fit');
            };
            Fit = __decorate([
                mz.Widget.RegisterComponent("fit"),
                mz.Widget.Template("<div class=\"mz-fit\" />", ':root'),
                mz.Widget.ConfigureUnwrapped, 
                __metadata('design:paramtypes', [])
            ], Fit);
            return Fit;
        })(mz.Widget);
        widgets.Fit = Fit;
        var Clear = (function (_super) {
            __extends(Clear, _super);
            function Clear(n, attr, a, b, c) {
                attr["tag"] = "div";
                _super.call(this, n, attr, a, b, c);
                this.DOM.addClass("clear");
            }
            Clear = __decorate([
                mz.Widget.RegisterComponent("clear"), 
                __metadata('design:paramtypes', [Object, Object, Object, Object, Object])
            ], Clear);
            return Clear;
        })(mz.Widget);
        widgets.Clear = Clear;
        var FlexCol = (function (_super) {
            __extends(FlexCol, _super);
            function FlexCol() {
                _super.apply(this, arguments);
            }
            FlexCol.prototype.style_changed = function () {
                this.set('col-width', this.get('col-width'));
            };
            FlexCol.prototype.class_changed = function () {
                this.DOM.addClass('mz-flex-col');
            };
            FlexCol.prototype['col-width_changed'] = function (width) {
                width = ('' + width).trim();
                width = width.match(/^\d+$/) ? width + '%' : width;
                var elem = this.rootNode;
                elem.style.webkitBoxFlex = '0';
                elem.style.webkitFlex = '0 0 ' + width;
                elem.style.mozBoxFlex = '0';
                elem.style.mozFlex = '0 0 ' + width;
                elem.style.msFlex = '0 0 ' + width;
                elem.style.flex = '0 0 ' + width;
                elem.style.maxWidth = width;
            };
            __decorate([
                mz.core.decorators.screenDelayer, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FlexCol.prototype, "style_changed", null);
            __decorate([
                mz.core.decorators.screenDelayer, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FlexCol.prototype, "class_changed", null);
            FlexCol = __decorate([
                mz.Widget.RegisterComponent("flex-col"),
                mz.Widget.Template("<div class=\"mz-flex-col\" />", ':root'),
                mz.Widget.ConfigureUnwrapped, 
                __metadata('design:paramtypes', [])
            ], FlexCol);
            return FlexCol;
        })(mz.Widget);
        widgets.FlexCol = FlexCol;
        var FlexContainer = (function (_super) {
            __extends(FlexContainer, _super);
            function FlexContainer() {
                _super.apply(this, arguments);
            }
            FlexContainer.prototype.class_changed = function () {
                this.DOM.addClass('mz-flex-row');
            };
            __decorate([
                mz.core.decorators.screenDelayer, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FlexContainer.prototype, "class_changed", null);
            FlexContainer = __decorate([
                mz.Widget.RegisterComponent("flex-container"),
                mz.Widget.Template("<div class=\"mz-flex-row\" />", ':root'),
                mz.Widget.ConfigureUnwrapped, 
                __metadata('design:paramtypes', [])
            ], FlexContainer);
            return FlexContainer;
        })(mz.Widget);
        widgets.FlexContainer = FlexContainer;
        var FlexRow = (function (_super) {
            __extends(FlexRow, _super);
            function FlexRow() {
                _super.apply(this, arguments);
            }
            FlexRow.prototype.class_changed = function () {
                this.DOM.addClass('mz-flex-row');
            };
            __decorate([
                mz.core.decorators.screenDelayer, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FlexRow.prototype, "class_changed", null);
            FlexRow = __decorate([
                mz.Widget.RegisterComponent("flex-row"),
                mz.Widget.Template("<div class=\"mz-flex-row\" />", ':root'),
                mz.Widget.ConfigureUnwrapped, 
                __metadata('design:paramtypes', [])
            ], FlexRow);
            return FlexRow;
        })(mz.Widget);
        widgets.FlexRow = FlexRow;
        var FlexCell = (function (_super) {
            __extends(FlexCell, _super);
            function FlexCell() {
                _super.apply(this, arguments);
            }
            FlexCell.prototype.class_changed = function () {
                this.DOM.addClass('mz-flex-cell');
            };
            __decorate([
                mz.core.decorators.screenDelayer, 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', []), 
                __metadata('design:returntype', void 0)
            ], FlexCell.prototype, "class_changed", null);
            FlexCell = __decorate([
                mz.Widget.RegisterComponent("flex-cell"),
                mz.Widget.Template("<div class=\"mz-flex-cell\" />", ':root'),
                mz.Widget.ConfigureUnwrapped, 
                __metadata('design:paramtypes', [])
            ], FlexCell);
            return FlexCell;
        })(mz.Widget);
        widgets.FlexCell = FlexCell;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../view/Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var MzForm = (function (_super) {
            __extends(MzForm, _super);
            function MzForm(rootNode, attr, children, b, c, scope) {
                attr['tag'] = attr['tag'] || 'div';
                this.flagAvoidReUpdate = null;
                _super.call(this, rootNode, attr, children, b, c, scope);
                this.primaryButton = null;
                this.startComponent();
                this.defaults = {};
                this.campos = {};
                this.camposArray = [];
                this._findICampos(this);
                this.checkAll = mz.screenDelayer(this.checkAll, this);
            }
            MzForm.prototype.value_changed = function (val, prevVal) {
                if (!val || typeof val != "object") {
                    return this.getDefaultValue();
                }
                if (val && typeof val === "object" && !this.flagAvoidReUpdate) {
                    for (var i in this.campos) {
                        if (i !== this.flagAvoidReUpdate && this.campos[i].value !== val[i])
                            this.campos[i].value = val[i];
                    }
                }
                this.checkAll(true);
            };
            MzForm.prototype.adoptInput = function (fieldName, component) {
                var _this = this;
                this.campos[fieldName] = component;
                this.camposArray.push(component);
                var defValue = component.attr('default-value');
                if (typeof defValue != "undefined") {
                    this.defaults[fieldName] = defValue;
                }
                this.listening.push(component.on("value_changed", function (val) {
                    (_this.value || (_this.resetForm(), _this.value))[fieldName] = val;
                    _this.flagAvoidReUpdate = fieldName;
                    try {
                        _this.value = _this.value;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    _this.flagAvoidReUpdate = null;
                }));
            };
            MzForm.prototype._findICampos = function (component) {
                var _this = this;
                if (component != this) {
                    if (component instanceof widgets.MzInput && component !== this) {
                        var fieldName = component.attr('field-name');
                        if (fieldName) {
                            this.adoptInput(fieldName, component);
                        }
                    }
                    else {
                        if (component.rootNode && component.rootNode.nodeName.toLowerCase() == "button" && (component.attr('mz-form-primary') || component.attr('type') === "submit")) {
                            this.primaryButton = component;
                        }
                    }
                }
                component && component.children && component.children.forEach(function (c) {
                    if (!(c instanceof MzForm) && c instanceof mz.Widget)
                        _this._findICampos(c);
                });
            };
            MzForm.prototype.fieldIsVisible = function (fieldName) {
                if (fieldName in this.campos) {
                    return this.campos[fieldName].visible;
                }
                return false;
            };
            MzForm.prototype.focus = function (field) {
                if (!field && this.camposArray.length)
                    this.camposArray[0].focus && this.camposArray[0].focus();
                else if (field && field in this.campos)
                    this.campos[field].focus && this.campos[field].focus();
            };
            MzForm.prototype.checkValid = function () {
                this.errors = [];
                var cumple = true;
                var clase = MzForm.ERROR_CLASS;
                try {
                    clase = this.data['error-class'] || clase;
                }
                catch (e) {
                }
                for (var i in this.campos) {
                    if (this.campos[i] instanceof widgets.MzInput) {
                        var err = null;
                        try {
                            err = this.campos[i].checkValid(this.data);
                        }
                        catch (e) {
                            err = e;
                        }
                        if (err === true) {
                            mz.dom.adapter.removeClass(this.campos[i].rootNode, clase);
                        }
                        else {
                            cumple = false;
                            mz.dom.adapter.addClass(this.campos[i].rootNode, clase);
                            if (typeof err === "string" || err instanceof Error) {
                                console.error(err, this);
                                this.errors.push(err);
                            }
                        }
                    }
                }
                this.primaryButton && this.primaryButton.attr('disabled', !cumple);
                return cumple;
            };
            MzForm.prototype.checkAll = function (noEmitAlert) {
                var cumple = this.checkValid();
                if (this.errors.length) {
                    this.emit('error', this.errors);
                    return false;
                }
                return cumple;
            };
            MzForm.prototype.getDefaultValue = function () {
                var obj = {};
                for (var i in this.campos) {
                    obj[i] = this.defaults[i];
                    this.campos[i].value = this.defaults[i];
                }
                return obj;
            };
            MzForm.prototype.resetForm = function () {
                return this.value = this.getDefaultValue();
            };
            MzForm.EMPTY_TAG = true;
            MzForm.ERROR_CLASS = 'has-error';
            __decorate([
                MzForm.proxy, 
                __metadata('design:type', Object)
            ], MzForm.prototype, "value", void 0);
            MzForm = __decorate([
                mz.Widget.RegisterComponent("mz-form"), 
                __metadata('design:paramtypes', [HTMLElement, Object, Array, Object, Object, Object])
            ], MzForm);
            return MzForm;
        })(mz.widgets.MzInput);
        widgets.MzForm = MzForm;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../view/Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets_1) {
        function delegateUnmountElement(widget) {
            if (widget && typeof widget == "object") {
                if ('unmount' in widget)
                    widget.unmount();
                else
                    widget.DOM && widget.DOM.remove();
            }
        }
        var MzRepeat = (function (_super) {
            __extends(MzRepeat, _super);
            //elementCache: mz.WeakMap<any, mz.Widget[]>;
            function MzRepeat(rootNode, attr, children, b, c, scope) {
                _super.call(this, rootNode, attr, [], b, c, scope);
                this.collectionKey = Symbol("mz-repeat-" + mz.genUID());
                this.ponerElem = this.ponerElem.bind(this);
                this.delegateUnmountElements = this.delegateUnmountElements.bind(this);
                // if the list contains elements.
                if (this.list && this.list.length) {
                    this.list.forEach(this.ponerElem);
                }
            }
            MzRepeat.prototype.list_changed = function (list, prevList) {
                var _this = this;
                if (list == prevList)
                    return;
                if (this.listenersLista) {
                    this.listenersLista.forEach(function (x) { return x.off(); });
                    this.listenersLista.length = 0;
                }
                else if (list) {
                    this.listenersLista = [];
                }
                if (prevList) {
                    // clean current collection elements
                    prevList.forEach(this.delegateUnmountElements);
                    this.detachAllNodes();
                }
                if (this.list && list instanceof mz.Collection) {
                    this.listenersLista.push(this.list.on('changed', this.redraw.bind(this)));
                    this.listenersLista.push(this.list.on('pre_clear', function (a) { return _this.redraw('pre_clear', a); }));
                }
                if (this.list && this.list.length && !!this.collectionKey /* collection initialized */)
                    this.redraw('refresh');
            };
            MzRepeat.prototype.unmount = function () {
                this.list = null;
                _super.prototype.unmount.call(this);
            };
            MzRepeat.prototype.ponerElem = function (itemDeLista) {
                var dom = itemDeLista[this.collectionKey];
                var existia = !!dom;
                if (!existia) {
                    itemDeLista[this.collectionKey] = dom = this.generateScopedContent(itemDeLista);
                }
                if (existia) {
                    // si el elemento ya existia, llamo a refreshScope
                    for (var index = 0; index < dom.length; index++) {
                        var e = dom[index];
                        if (e && (typeof e == "object") && 'refreshScope' in e)
                            e.refreshScope();
                        this.append(e);
                    }
                }
                else {
                    for (var index = 0; index < dom.length; index++) {
                        this.append(dom[index]);
                    }
                }
            };
            MzRepeat.prototype.generateScopedContent = function (scope) {
                var t = _super.prototype.generateScopedContent.call(this, scope);
                this.afterAdd && this.afterAdd(t, scope);
                return t;
            };
            MzRepeat.prototype.detachAllNodes = function () {
                var child = null;
                while (child = this.contentNode.firstChild) {
                    this.contentNode.removeChild(child);
                }
            };
            MzRepeat.prototype.delegateUnmountElements = function (elementoLista, at) {
                if (elementoLista[this.collectionKey]) {
                    elementoLista[this.collectionKey].forEach(delegateUnmountElement);
                    delete elementoLista[this.collectionKey];
                }
            };
            MzRepeat.prototype.redraw = function (tipo, a, b) {
                var rebuild = !tipo;
                if (tipo == mz.Collection.EVENTS.ElementChanged && this.collectionKey in b) {
                    var widgets_2 = b[this.collectionKey];
                    for (var i = 0; i < widgets_2.length; i++) {
                        var e = widgets_2[i];
                        if (e && e.refreshScope) {
                            e.refreshScope();
                        }
                    }
                }
                else if (tipo == mz.Collection.EVENTS.ElementInserted || tipo == mz.Collection.EVENTS.ElementChanged) {
                    this.ponerElem(b);
                }
                else if (tipo == mz.Collection.EVENTS.ElementRemoved && b && b[this.collectionKey]) {
                    this.delegateUnmountElements(b);
                }
                else if (tipo == mz.Collection.EVENTS.CollectionSorted) {
                    rebuild = true;
                }
                else if (tipo == "refresh") {
                    this.detachAllNodes();
                    rebuild = true;
                }
                else if (tipo == mz.Collection.EVENTS.BeforeClearCollection) {
                    this.list.forEach(this.delegateUnmountElements);
                    return;
                }
                if (tipo == mz.Collection.EVENTS.AfterClearCollection || rebuild) {
                    this.detachAllNodes();
                }
                if (rebuild && this.list.length) {
                    this.list.forEach(this.ponerElem);
                }
            };
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', Object)
            ], MzRepeat.prototype, "list", void 0);
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', Function)
            ], MzRepeat.prototype, "afterAdd", void 0);
            MzRepeat = __decorate([
                mz.Widget.RegisterComponent("mz-repeat"),
                mz.Widget.ConfigureEmptyTag, 
                __metadata('design:paramtypes', [HTMLElement, Object, Array, Object, Object, Object])
            ], MzRepeat);
            return MzRepeat;
        })(mz.Widget);
        widgets_1.MzRepeat = MzRepeat;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXouanMiLCJzb3VyY2VzIjpbIm16LnRzIiwiVklFVy9UbXBsLnRzIiwiVklFVy9IZWxwZXJzLnRzIiwiQ09SRS9FdmVudERpc3BhdGNoZXIudHMiLCJDT1JFL01WQ09iamVjdC50cyIsIkNPUkUvRGVjb3JhdG9ycy50cyIsIlZJRVcvVGV4dE5vZGUudHMiLCJDT1JFL0RPTS50cyIsIkNPUkUvRE9NL0RPTS50cyIsIkNPUkUvRE9NL0RPTV9Ccm93c2VySW1wbC50cyIsIkNPUkUvRE9NL01pY3JvUXVldWUudHMiLCJWSUVXL1dpZGdldC50cyIsIldJREdFVFMvbXotc3dpdGNoZXIudHMiLCJBUFAvQXBwQ29udHJvbGxlci50cyIsIkFVVEgvSldULnRzIiwiQ09SRS9JMThuLnRzIiwiQ09SRS9EYXRlLnRzIiwiQ09SRS9Qcm9taXNlLnRzIiwiQ09SRS9Yci50cyIsIkNPUkUvU3RyaW5ncy50cyIsIkFVVEgvT0F1dGgyLnRzIiwiQ09SRS9BTUQvUmVxdWlyZS50cyIsIkNPUkUvQU1EL01vZHVsZS50cyIsIkNPUkUvQU1EL0RlZmluZS50cyIsIkNPUkUvQU1EL1NldHVwLnRzIiwiQ09SRS9Db2xsZWN0aW9uLnRzIiwiQ09SRS9SZWZsZWN0aW9uLnRzIiwiQ09SRS9Sb3V0ZS50cyIsIlZJRVcvQ1NTLnRzIiwiVklFVy9ESVJFQ1RJVkVTL016TW9kZWwudHMiLCJWSUVXL0RJUkVDVElWRVMvTXpSYXcudHMiLCJWSUVXL0RJUkVDVElWRVMvY2xhc3NOYW1lLnRzIiwiVklFVy9ESVJFQ1RJVkVTL1Zpc2libGUudHMiLCJWSUVXL0h0bWxTYW5pdGl6ZXIudHMiLCJWSUVXL1RTWC50cyIsIldJREdFVFMvQmxvY2tzLnRzIiwiV0lER0VUUy9tei1mb3JtLnRzIiwiV0lER0VUUy9tei1yZXBlYXQudHMiXSwibmFtZXMiOlsiaXNEZWYiLCJteiIsIm16LmFsaWFzIiwibXouZ2V0UGF0aCIsIm16LmdldEVsZW1lbnRQb3NpdGlvbiIsImV4dGVuZCIsIm16LmNvcHkiLCJtei5tYXBYSW50byIsIm16Lm1hcEludG8iLCJtei5pc0l0ZXJhYmxlIiwibXoudHJpbSIsIm16LmdldERPTUlEIiwibXouZ2VuVUlEIiwibXouZGF0YSIsIm16LmRhdGEub3JkZXIiLCJtei5kYXRhLm9yZGVyLm51bGxfYXJyaWJhIiwibXouZGF0YS5vcmRlci5udWxsX2FiYWpvIiwibXouZGF0YS5vcmRlci5idWlsZCIsIm16LmVzY2FwZVJlZ0V4cCIsIm16LmxvYWRDc3MiLCJtei5mbkluZm8iLCJtei5jb21waWxlRmlsdGVyIiwibXouZ2V0V2luZG93U2l6ZSIsIm16Lmdsb2JhbENhbGxiYWNrIiwibXouYnVzY2FyQXJndW1lbnRvVGlwbyIsIm16LnZpZXciLCJtei52aWV3LnRtcGwiLCJtei52aWV3LnRtcGwuaW50ZXJuYWxUbXBsIiwibXoudmlldy50bXBsLmV4cHIiLCJtei52aWV3LnRtcGwud3JhcCIsIm16LnZpZXcudG1wbC5zcGxpdCIsIm16LnZpZXcudG1wbC5leHRyYWN0IiwibXouZ2V0SGlkZGVuUHJvcCIsIm16LmdldFRyYW5zZm9ybVRhZyIsIm16LkV2ZW50RGlzcGF0Y2hlckJpbmRpbmciLCJtei5FdmVudERpc3BhdGNoZXJCaW5kaW5nLmNvbnN0cnVjdG9yIiwibXouRXZlbnREaXNwYXRjaGVyQmluZGluZy5vZmYiLCJtei5FdmVudERpc3BhdGNoZXIiLCJtei5FdmVudERpc3BhdGNoZXIuY29uc3RydWN0b3IiLCJtei5FdmVudERpc3BhdGNoZXIub24iLCJtei5FdmVudERpc3BhdGNoZXIub25jZSIsIm16LkV2ZW50RGlzcGF0Y2hlci5vZmYiLCJtei5FdmVudERpc3BhdGNoZXIuZW1pdCIsIm16Lk1WQ09iamVjdCIsIm16Lk1WQ09iamVjdC5jb25zdHJ1Y3RvciIsIm16Lk1WQ09iamVjdC5nZXRBbGwiLCJtei5NVkNPYmplY3Quc2V0VmFsdWVzIiwibXouTVZDT2JqZWN0LnNldCIsIm16Lk1WQ09iamVjdC5nZXQiLCJtei5NVkNPYmplY3QucHJveHkiLCJtei5jb3JlIiwibXouY29yZS5kZWNvcmF0b3JzIiwibXouY29yZS5kZWNvcmF0b3JzLkxvZ1Jlc3VsdCIsIm16LmNvcmUuZGVjb3JhdG9ycy5ub0VudW1lcmFibGUiLCJtei5jb3JlLmRlY29yYXRvcnMuZGVsYXllciIsIm16LmNvcmUuZGVjb3JhdG9ycy5zY3JlZW5EZWxheWVyIiwibXoud2lkZ2V0cyIsIm16LndpZGdldHMuVGV4dE5vZGUiLCJtei53aWRnZXRzLlRleHROb2RlLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5UZXh0Tm9kZS5zZXR1cCIsIm16LndpZGdldHMuVGV4dE5vZGUudW5tb3VudCIsIm16LndpZGdldHMuVGV4dE5vZGUucmVmcmVzaFNjb3BlIiwibXoud2lkZ2V0cy5UZXh0Tm9kZS5yZXR1cm5Ub1BvbGwiLCJtei53aWRnZXRzLlRleHROb2RlLmdldEZyb21Qb2xsIiwibXouZG9tIiwibXouZG9tLnNldFJvb3REb21BZGFwdGVyIiwibXouZG9tLkFic3RyYWN0RG9tQWRhcHRlciIsIm16LmRvbS5BYnN0cmFjdERvbUFkYXB0ZXIuY29uc3RydWN0b3IiLCJtei5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5jb25zdHJ1Y3RvciIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0RGlzdHJpYnV0ZWROb2RlcyIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIucmVzb2x2ZUFuZFNldEhyZWYiLCJtei5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyLnN1cHBvcnRzRE9NRXZlbnRzIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5zdXBwb3J0c05hdGl2ZVNoYWRvd0RPTSIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0QW5pbWF0aW9uUHJlZml4IiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5nZXRUcmFuc2l0aW9uRW5kIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5zdXBwb3J0c0FuaW1hdGlvbiIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0WEhSIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNvbnN0cnVjdG9yIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnBhcnNlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLm1ha2VDdXJyZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmhhc1Byb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFByb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFByb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmludm9rZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5sb2dFcnJvciIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5sb2ciLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubG9nR3JvdXAiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubG9nR3JvdXBFbmQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYXR0clRvUHJvcE1hcCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5xdWVyeSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5xdWVyeVNlbGVjdG9yIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnF1ZXJ5U2VsZWN0b3JBbGwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIub24iLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIub25BbmRDYW5jZWwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZGlzcGF0Y2hFdmVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVNb3VzZUV2ZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZUV2ZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnByZXZlbnREZWZhdWx0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzUHJldmVudGVkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldElubmVySFRNTCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRPdXRlckhUTUwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubm9kZU5hbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubm9kZVZhbHVlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnR5cGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY29udGVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5maXJzdENoaWxkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLm5leHRTaWJsaW5nIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnBhcmVudEVsZW1lbnQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY2hpbGROb2RlcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jaGlsZE5vZGVzQXNMaXN0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNsZWFyTm9kZXMiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYXBwZW5kQ2hpbGQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVtb3ZlQ2hpbGQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVwbGFjZUNoaWxkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlbW92ZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pbnNlcnRCZWZvcmUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaW5zZXJ0QWxsQmVmb3JlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmluc2VydEFmdGVyIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldElubmVySFRNTCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRUZXh0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFRleHQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0VmFsdWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuc2V0VmFsdWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q2hlY2tlZCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRDaGVja2VkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZUNvbW1lbnQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGVtcGxhdGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlRWxlbWVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVFbGVtZW50TlMiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGV4dE5vZGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlU2NyaXB0VGFnIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZVN0eWxlRWxlbWVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVTaGFkb3dSb290IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFNoYWRvd1Jvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0SG9zdCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jbG9uZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEVsZW1lbnRzQnlUYWdOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNsYXNzTGlzdCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5hZGRDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci50YWdOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmF0dHJpYnV0ZU1hcCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNBdHRyaWJ1dGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0QXR0cmlidXRlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldEF0dHJpYnV0ZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRBdHRyaWJ1dGVOUyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVBdHRyaWJ1dGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIudGVtcGxhdGVBd2FyZVJvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlSHRtbERvY3VtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmRlZmF1bHREb2MiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFRpdGxlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFRpdGxlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmVsZW1lbnRNYXRjaGVzIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzVGVtcGxhdGVFbGVtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzVGV4dE5vZGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaXNDb21tZW50Tm9kZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pc0VsZW1lbnROb2RlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmhhc1NoYWRvd1Jvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaXNTaGFkb3dSb290IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmltcG9ydEludG9Eb2MiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYWRvcHROb2RlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEhyZWYiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0RXZlbnRLZXkiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0R2xvYmFsRXZlbnRUYXJnZXQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0SGlzdG9yeSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRMb2NhdGlvbiIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRCYXNlSHJlZiIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZXNldEJhc2VFbGVtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFVzZXJBZ2VudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXREYXRhIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldERhdGEiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q29tcHV0ZWRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucGVyZm9ybWFuY2VOb3ciLCJtei5kb20uZ2V0QmFzZUVsZW1lbnRIcmVmIiwibXouZG9tLnJlbGF0aXZlUGF0aCIsIm16LmRvbS5taWNyb3F1ZXVlIiwibXouZG9tLm1pY3JvcXVldWUubWFrZVJlcXVlc3RGbHVzaEZyb21NdXRhdGlvbk9ic2VydmVyIiwibXouZG9tLm1pY3JvcXVldWUubWFrZVJlcXVlc3RGbHVzaEZyb21NdXRhdGlvbk9ic2VydmVyLnJlcXVlc3RGbHVzaCIsIm16LmRvbS5taWNyb3F1ZXVlLm1ha2VSZXF1ZXN0Rmx1c2hGcm9tVGltZXIiLCJtei5kb20ubWljcm9xdWV1ZS5tYWtlUmVxdWVzdEZsdXNoRnJvbVRpbWVyLnJlcXVlc3RGbHVzaCIsIm16LmRvbS5taWNyb3F1ZXVlLm1ha2VSZXF1ZXN0Rmx1c2hGcm9tVGltZXIucmVxdWVzdEZsdXNoLmhhbmRsZUZsdXNoVGltZXIiLCJtei5kb20ubWljcm9xdWV1ZS5vbkVycm9yIiwibXouZG9tLm1pY3JvcXVldWUuTWljcm9UYXNrUXVldWUiLCJtei5kb20ubWljcm9xdWV1ZS5NaWNyb1Rhc2tRdWV1ZS5jb25zdHJ1Y3RvciIsIm16LmRvbS5taWNyb3F1ZXVlLk1pY3JvVGFza1F1ZXVlLnF1ZXVlTWljcm9UYXNrIiwibXouZG9tLm1pY3JvcXVldWUuTWljcm9UYXNrUXVldWUuZmx1c2hNaWNyb1Rhc2tRdWV1ZSIsIm16LmRvbS5taWNyb3F1ZXVlLk1pY3JvUXVldWVPcEtpbmQiLCJtei5kb20ubWljcm9xdWV1ZS5mbHVzaCIsIm16LmRvbS5taWNyb3F1ZXVlLmFwcGVuZENoaWxkIiwibXouZG9tLm1pY3JvcXVldWUuY2FsbGJhY2siLCJtei5kb20ubWljcm9xdWV1ZS5yZW1vdmUiLCJtei5kb20ubWljcm9xdWV1ZS5zZXRUZXh0IiwibXouZG9tLm1pY3JvcXVldWUuc2V0QXR0cmlidXRlIiwibXouQXR0cmlidXRlRGlyZWN0aXZlIiwibXouQXR0cmlidXRlRGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwibXouQXR0cmlidXRlRGlyZWN0aXZlLm1vdW50IiwibXouQXR0cmlidXRlRGlyZWN0aXZlLnVubW91bnQiLCJtei5BdHRyaWJ1dGVEaXJlY3RpdmUuY2hhbmdlZCIsIm16LkF0dHJpYnV0ZURpcmVjdGl2ZS52YWx1ZSIsIm16LkF0dHJpYnV0ZURpcmVjdGl2ZS5SZWdpc3RlciIsIm16LnF1YXNpVG9Eb20iLCJtei5iaW5kV2lkZ2V0QXR0ciIsIm16LmRvbVRvV2lkZ2V0cyIsIm16LmdldENoaWxkTm9kZXMiLCJtei5nZXRKUXVlcnlFdmVudFdyYXBwZXIiLCJtei5lcnJvckxvYWRpbmdUZW1wbGF0ZSIsIm16LldpZGdldCIsIm16LldpZGdldC5jb25zdHJ1Y3RvciIsIm16LldpZGdldC5zY29wZV9jaGFuZ2VkIiwibXouV2lkZ2V0LkRPTSIsIm16LldpZGdldC5nZW5lcmF0ZVNjb3BlZENvbnRlbnQiLCJtei5XaWRnZXQuYXR0ciIsIm16LldpZGdldC5yZWZyZXNoU2NvcGUiLCJtei5XaWRnZXQuZmluZCIsIm16LldpZGdldC5sb2FkVGVtcGxhdGUiLCJtei5XaWRnZXQuY29tcG9uZW50SW5pdGlhbGl6ZWQiLCJtei5XaWRnZXQuc3RhcnRDb21wb25lbnQiLCJtei5XaWRnZXQuYXBwZW5kQ2hpbGRyZW5zIiwibXouV2lkZ2V0LmZpbmRDb250ZW50U2VsZWN0b3IiLCJtei5XaWRnZXQuYXBwZW5kIiwibXouV2lkZ2V0LmFwcGVuZFRvIiwibXouV2lkZ2V0LmluaXRBdHRyIiwibXouV2lkZ2V0LnJlc2l6ZSIsIm16LldpZGdldC51bm1vdW50IiwibXouV2lkZ2V0LlJlZ2lzdGVyQ29tcG9uZW50IiwibXouV2lkZ2V0LkNvbmZpZ3VyZUVtcHR5VGFnIiwibXouV2lkZ2V0LlRlbXBsYXRlIiwibXouV2lkZ2V0LkNvbmZpZ3VyZVVud3JhcHBlZCIsIm16LldpZGdldC5Db25maWd1cmVUYWciLCJtei5XaWRnZXQuQXR0cmlidXRlIiwibXoud2lkZ2V0cy5CYXNlRWxlbWVudCIsIm16LndpZGdldHMuQmFzZUVsZW1lbnQuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkJhc2VQYWdlbGV0IiwibXoud2lkZ2V0cy5CYXNlUGFnZWxldC5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuSW5saW5lUGFnZWxldCIsIm16LndpZGdldHMuSW5saW5lUGFnZWxldC5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuTXpTd2l0Y2hlciIsIm16LndpZGdldHMuTXpTd2l0Y2hlci5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuTXpTd2l0Y2hlci5zaG93IiwibXoud2lkZ2V0cy5NelN3aXRjaGVyLnJlc2l6ZSIsIm16LndpZGdldHMuTXpTd2l0Y2hlclBhbmVsIiwibXoud2lkZ2V0cy5NelN3aXRjaGVyUGFuZWwuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLk16U3dpdGNoZXJQYW5lbC5zaG93IiwibXoud2lkZ2V0cy5NelN3aXRjaGVyUGFuZWwuaXNWaXNpYmxlIiwibXouYXBwIiwibXouYXBwLlBhZ2UiLCJtei5hcHAuUGFnZS5jb25zdHJ1Y3RvciIsIm16LmFwcC5QYWdlLmhhbmRsZVJvdXRlIiwibXouYXBwLlBhZ2Uuc2hvdyIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3IiLCJtei5hcHAuUGFnZUNvb3JkaW5hdG9yLmNvbnN0cnVjdG9yIiwibXouYXBwLlBhZ2VDb29yZGluYXRvci5zZXRQYWdlcyIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3IubG9hZGVkIiwibXouYXBwLlBhZ2VDb29yZGluYXRvci5zaG93IiwibXouYXBwLlBhZ2VDb29yZGluYXRvci5uYXZpZ2F0ZSIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3IuZ2V0UGFnZSIsIm16LmF1dGgiLCJtei5hdXRoLmp3dCIsIm16LmF1dGguand0LnVybEJhc2U2NERlY29kZSIsIm16LmF1dGguand0LmRlY29kZVRva2VuIiwibXouYXV0aC5qd3QuZ2V0VG9rZW5FeHBpcmF0aW9uRGF0ZSIsIm16LmF1dGguand0LmlzVG9rZW5FeHBpcmVkIiwibXouZGF0ZSIsIm16LmRhdGUucGFyc2VPYmplY3QiLCJtei5kYXRlLmFkZEZlYXR1cmUiLCJtei5kYXRlLmZyb21TdHJpbmciLCJtei5kYXRlLm5ld1N5bmNybyIsIm16LmRhdGUuc3luYyIsIm16LmRhdGUucGFyc2UiLCJtei5kYXRlLnBhcnNlLnBhcnNlSnNvbkRhdGUiLCJtei5kYXRlLnBhcnNlLmNvbnZlcnRpckFGZWNoYUhvcmEiLCJtei5kYXRlLnBhcnNlLmNvbnZlcnRpckFGZWNoYSIsIm16LmRhdGUuYWRkIiwibXouZGF0ZS5mbXRfZGF0ZSIsIm16LmRhdGUuZm10X3RpbWUiLCJtei5kYXRlLmZtdF9kYXRlX3RpbWUiLCJtei5kYXRlLnRvU3RyaW5nIiwibXouZGF0ZS5mbXRfZHVyYWNpb24iLCJtei5kYXRlLnBhcnNlRHVyYWNpb24iLCJtei5wcm9taXNlIiwibXoucHJvbWlzZS53YWl0IiwibXoucHJvbWlzZS55aWVsZCIsIm16LnByb21pc2UubmV4dEZyYW1lIiwibXoucHJvbWlzZS5wYXJzZVN0cmluZ0RhdGVzIiwibXoucmVzIiwibXouZ2V0UGFyYW1zIiwibXoueHIiLCJtei54ci5mb3JtYXR0ZXJzIiwibXoueHIueG1sSHR0cFJlcXVlc3QiLCJtei54ci5wcm9taXNlIiwibXoueHIudXJsUmVzb2x2ZSIsIm16LnhyLnVybElzU2FtZU9yaWdpbiIsIm16LnhyLnVybEVuY29kZSIsIm16LnhyLmdldCIsIm16LnhyLnB1dCIsIm16LnhyLnBvc3QiLCJtei54ci5wYXRjaCIsIm16LnhyLmRlbCIsIm16LnhyLm9wdGlvbnMiLCJtei5vYXV0aDIiLCJtei5vYXV0aDIuZXh0cmFjdERvbWFpbiIsIm16Lm9hdXRoMi50b2tlbkdldHRlciIsIm16Lm9hdXRoMi5zZXR1cFRva2VuIiwibXoub2F1dGgyLnNldFRva2VuIiwibXoub2F1dGgyLmNoZWNrUm9sZSIsIm16Lm9hdXRoMi5wdXNoUm9sZXMiLCJtei5vYXV0aDIuYXBwbHlBdXRob3JpemF0aW9uSGVhZGVycyIsIm16Lm9hdXRoMi5jb25maWd1cmUiLCJtei5vYXV0aDIucmVmcmVzaFRva2VuIiwibXoub2F1dGgyLmxvZ291dCIsIm16Lm9hdXRoMi5sb2dpbiIsIm16Lm9hdXRoMi5sb2dnZWRJbiIsIm16LnJlcXVpcmUiLCJtei5pbmNsdWRlIiwibXoubG9hZE1vZHVsZSIsIm16LnJlcXVpcmUucm91dGUiLCJtei5yZXF1aXJlLmRlZmluZUZpbGVzIiwibXouTW9kdWxlIiwibXouTW9kdWxlLmNvbnN0cnVjdG9yIiwibXouTW9kdWxlLmdldFBhdGgiLCJtei5Nb2R1bGUucmVxdWlyZSIsIm16Lk1vZHVsZS5kZWZpbmUiLCJtei5Nb2R1bGVFeHBvcnRzIiwibXouTW9kdWxlRXhwb3J0cy5jb25zdHJ1Y3RvciIsIm16Lk1vZHVsZUV4cG9ydHMuc2V0IiwibXoudW5kZWZpbmUiLCJtei5kZWZpbmUiLCJtei5Db2xsZWN0aW9uIiwibXouQ29sbGVjdGlvbi5jb25zdHJ1Y3RvciIsIm16LkNvbGxlY3Rpb24uZmlyc3QiLCJtei5Db2xsZWN0aW9uLmxhc3QiLCJtei5Db2xsZWN0aW9uLmNsZWFyIiwibXouQ29sbGVjdGlvbi5sZW5ndGgiLCJtei5Db2xsZWN0aW9uLmdldExlbmd0aCIsIm16LkNvbGxlY3Rpb24uc2V0TGVuZ3RoIiwibXouQ29sbGVjdGlvbi5tYXAiLCJtei5Db2xsZWN0aW9uLmZvckVhY2giLCJtei5Db2xsZWN0aW9uLmFzeW5jRm9yRWFjaCIsIm16LkNvbGxlY3Rpb24uYXN5bmNGb3JFYWNoLnNjaCIsIm16LkNvbGxlY3Rpb24uX2luZGl6YXIiLCJtei5Db2xsZWN0aW9uLl9kZWluZGl6YXIiLCJtei5Db2xsZWN0aW9uLl9yZWluZGl6YXIiLCJtei5Db2xsZWN0aW9uLmdldEF0IiwibXouQ29sbGVjdGlvbi5yZWR1Y2UiLCJtei5Db2xsZWN0aW9uLmdyb3VwQnkiLCJtei5Db2xsZWN0aW9uLmtleSIsIm16LkNvbGxlY3Rpb24uaW5zZXJ0QXQiLCJtei5Db2xsZWN0aW9uLnJlbW92ZUF0IiwibXouQ29sbGVjdGlvbi5zZXRBdCIsIm16LkNvbGxlY3Rpb24ucHVzaCIsIm16LkNvbGxlY3Rpb24ucG9wIiwibXouQ29sbGVjdGlvbi5hZGRSYW5nZSIsIm16LkNvbGxlY3Rpb24udXBkYXRlIiwibXouQ29sbGVjdGlvbi51cGRhdGVCeUtleSIsIm16LkNvbGxlY3Rpb24udXBkYXRlSW5kZXgiLCJtei5Db2xsZWN0aW9uLmpvaW4iLCJtei5Db2xsZWN0aW9uLnN1bSIsIm16LkNvbGxlY3Rpb24ub3JkZXJCeSIsIm16LkNvbGxlY3Rpb24ub3JkZXJCeURlc2MiLCJtei5Db2xsZWN0aW9uLnNvbWUiLCJtei5Db2xsZWN0aW9uLndoZXJlIiwibXouQ29sbGVjdGlvbi5yZW1vdmVCeUtleSIsIm16LkNvbGxlY3Rpb24ucmVtb3ZlIiwibXouQ29sbGVjdGlvbi5zaW5nbGUiLCJtei5Db2xsZWN0aW9uLmNvbnRhaW5zIiwibXouQ29sbGVjdGlvbi5jb250YWluc0tleSIsIm16LkNvbGxlY3Rpb24uaW5kZXhPZiIsIm16LkNvbGxlY3Rpb24ubGFzdEluZGV4T2YiLCJtei5Db2xsZWN0aW9uLnRvQXJyYXkiLCJtei5Db2xsZWN0aW9uLmNsb25lIiwibXouQ29sbGVjdGlvbi5pbmRleGVkR2V0IiwibXouQ29sbGVjdGlvbi5pbmRleGVkR2V0SW5kZXgiLCJtei5Db2xsZWN0aW9uLm1lcmdlRWxlbSIsIm16LkNvbGxlY3Rpb24ubWF4IiwibXouQ29sbGVjdGlvbi5taW4iLCJtei5Db2xsZWN0aW9uLmF2ZyIsIm16LkNvbGxlY3Rpb24udGFrZSIsIm16LkNvbGxlY3Rpb24udGFrZUludG8iLCJtei5Db2xsZWN0aW9uLnN3YXBJdGVtcyIsIm16LkNvbGxlY3Rpb24uY291bnQiLCJtei5Db2xsZWN0aW9uLnJldmVyc2UiLCJtei5Db2xsZWN0aW9uLm1lcmdlQXJyYXkiLCJtei5Db2xsZWN0aW9uLmNyZWF0ZVZpZXciLCJtei5Db2xsZWN0aW9uLmdldFByaXZhdGVBcnJheSIsIm16LkNvbGxlY3Rpb25WaWV3IiwibXouQ29sbGVjdGlvblZpZXcuY29uc3RydWN0b3IiLCJtei5Db2xsZWN0aW9uVmlldy5faGFuZGxlQ2hhbmdlZCIsIm16LkNvbGxlY3Rpb25WaWV3Ll9yZW1ha2UiLCJtei5Db2xsZWN0aW9uVmlldy5yZXNvcnQiLCJtei5Db2xsZWN0aW9uVmlldy5yZWZyZXNoIiwibXouQ29sbGVjdGlvblZpZXcuZmlsdGVyIiwibXouQ29sbGVjdGlvblZpZXcub3JkZXJCeSIsIm16LkNvbGxlY3Rpb25WaWV3Lm9yZGVyQnlEZXNjIiwibXouQ29sbGVjdGlvblZpZXcuYXR0YWNoVG8iLCJtei5Db2xsZWN0aW9uVmlldy5kZXRhY2giLCJSZWZsZWN0IiwiUmVmbGVjdC5tZXRhZGF0YSIsIlJlZmxlY3QubWV0YWRhdGEuZGVjb3JhdG9yIiwiUmVmbGVjdC5zZXRPYmplY3RTeW1ib2wiLCJtei5jc3MiLCJtei5jc3Muc2V0IiwibXouY3NzLlN0eWxlc2hlZXQiLCJtei5jc3MuU3R5bGVzaGVldC5jb25zdHJ1Y3RvciIsIm16LmNzcy5TdHlsZXNoZWV0LmVuYWJsZSIsIm16LmNzcy5TdHlsZXNoZWV0LmRpc2FibGUiLCJtei5jc3MuU3R5bGVzaGVldC5yZWZyZXNoIiwibXouY3NzLlN0eWxlc2hlZXQuc2V0IiwiTXpNb2RlbERpcmVjdGl2ZSIsIk16TW9kZWxEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJNek1vZGVsRGlyZWN0aXZlLnVubW91bnQiLCJNek1vZGVsRGlyZWN0aXZlLnRlYXJkb3duIiwiTXpNb2RlbERpcmVjdGl2ZS5jaGFuZ2VkIiwibXoud2lkZ2V0cy5NeklucHV0IiwibXoud2lkZ2V0cy5NeklucHV0LmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NeklucHV0LmZvY3VzIiwibXoud2lkZ2V0cy5NeklucHV0LmNoZWNrVmFsaWQiLCJNelJhd0RpcmVjdGl2ZSIsIk16UmF3RGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwiTXpSYXdEaXJlY3RpdmUuY2hhbmdlZCIsIk16Q2xhc3NOYW1lRGlyZWN0aXZlIiwiTXpDbGFzc05hbWVEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJNekNsYXNzTmFtZURpcmVjdGl2ZS5jaGFuZ2VkIiwiTXpWaXNpYmxlRGlyZWN0aXZlIiwiTXpWaXNpYmxlRGlyZWN0aXZlLmNvbnN0cnVjdG9yIiwiTXpWaXNpYmxlRGlyZWN0aXZlLm1vdW50IiwiTXpWaXNpYmxlRGlyZWN0aXZlLnVubW91bnQiLCJNelZpc2libGVEaXJlY3RpdmUuY2hhbmdlZCIsIm16LnZpZXcuaHRtbCIsIm16LnZpZXcuaHRtbC5lc2NhcGUiLCJtei52ZG9tIiwibXoudmRvbS5jcmVhdGVFbGVtZW50IiwibXouaCIsIm16LndpZGdldHMuRml0IiwibXoud2lkZ2V0cy5GaXQuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZpdC5jbGFzc19jaGFuZ2VkIiwibXoud2lkZ2V0cy5DbGVhciIsIm16LndpZGdldHMuQ2xlYXIuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZsZXhDb2wiLCJtei53aWRnZXRzLkZsZXhDb2wuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZsZXhDb2wuc3R5bGVfY2hhbmdlZCIsIm16LndpZGdldHMuRmxleENvbC5jbGFzc19jaGFuZ2VkIiwibXoud2lkZ2V0cy5GbGV4Q29sWydjb2wtd2lkdGhfY2hhbmdlZCddIiwibXoud2lkZ2V0cy5GbGV4Q29udGFpbmVyIiwibXoud2lkZ2V0cy5GbGV4Q29udGFpbmVyLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5GbGV4Q29udGFpbmVyLmNsYXNzX2NoYW5nZWQiLCJtei53aWRnZXRzLkZsZXhSb3ciLCJtei53aWRnZXRzLkZsZXhSb3cuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZsZXhSb3cuY2xhc3NfY2hhbmdlZCIsIm16LndpZGdldHMuRmxleENlbGwiLCJtei53aWRnZXRzLkZsZXhDZWxsLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5GbGV4Q2VsbC5jbGFzc19jaGFuZ2VkIiwibXoud2lkZ2V0cy5NekZvcm0iLCJtei53aWRnZXRzLk16Rm9ybS5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuTXpGb3JtLnZhbHVlX2NoYW5nZWQiLCJtei53aWRnZXRzLk16Rm9ybS5hZG9wdElucHV0IiwibXoud2lkZ2V0cy5NekZvcm0uX2ZpbmRJQ2FtcG9zIiwibXoud2lkZ2V0cy5NekZvcm0uZmllbGRJc1Zpc2libGUiLCJtei53aWRnZXRzLk16Rm9ybS5mb2N1cyIsIm16LndpZGdldHMuTXpGb3JtLmNoZWNrVmFsaWQiLCJtei53aWRnZXRzLk16Rm9ybS5jaGVja0FsbCIsIm16LndpZGdldHMuTXpGb3JtLmdldERlZmF1bHRWYWx1ZSIsIm16LndpZGdldHMuTXpGb3JtLnJlc2V0Rm9ybSIsIm16LndpZGdldHMuZGVsZWdhdGVVbm1vdW50RWxlbWVudCIsIm16LndpZGdldHMuTXpSZXBlYXQiLCJtei53aWRnZXRzLk16UmVwZWF0LmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NelJlcGVhdC5saXN0X2NoYW5nZWQiLCJtei53aWRnZXRzLk16UmVwZWF0LnVubW91bnQiLCJtei53aWRnZXRzLk16UmVwZWF0LnBvbmVyRWxlbSIsIm16LndpZGdldHMuTXpSZXBlYXQuZ2VuZXJhdGVTY29wZWRDb250ZW50IiwibXoud2lkZ2V0cy5NelJlcGVhdC5kZXRhY2hBbGxOb2RlcyIsIm16LndpZGdldHMuTXpSZXBlYXQuZGVsZWdhdGVVbm1vdW50RWxlbWVudHMiLCJtei53aWRnZXRzLk16UmVwZWF0LnJlZHJhdyJdLCJtYXBwaW5ncyI6IkFBQUEsd0NBQXdDO0FBQ3hDLHlDQUF5QztBQUV6QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVELGVBQWUsQ0FBQztJQUNaQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxXQUFXQSxDQUFDQTtBQUNuQ0EsQ0FBQ0E7QUFBQSxDQUFDO0FBUUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsNkJBQTZCO0lBQzdCLElBQUksQ0FBQyxnNUVBQTQyRSxDQUFDLENBQUM7QUFDdjNFLENBQUM7QUFHRCxJQUFVLEVBQUUsQ0Erb0JYO0FBL29CRCxXQUFVLEVBQUUsRUFBQyxDQUFDO0lBdUNDQyxnQkFBYUEsR0FBU0EsTUFBY0EsSUFBSUEsT0FBT0EsTUFBTUEsSUFBSUEsV0FBV0EsSUFBSUEsTUFBTUEsQ0FBQ0E7SUFLMUZBLENBQUNBO1FBQ0csSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osZ0JBQWEsQ0FBQyxNQUFNLEdBQUcsZ0JBQWEsQ0FBQyxNQUFNLElBQUksVUFBUyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxPQUFLLENBQUMsU0FBSSxHQUFHLEVBQUUsT0FBSSxD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QSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQTtnQkFDbkRBLElBQUlBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLElBQUlBLENBQUNBO2dCQUVuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsSUFBSUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQTt3QkFDWEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRWJBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsVUFBVUEsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFYkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLENBQUNBO1lBZmVGLGdCQUFVQSxhQWV6QkE7WUFDREEsZUFBc0JBLEtBQUtBO2dCQUN2QkcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsS0FBS0EsSUFBSUEsVUFBVUEsQ0FBQ0E7b0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUU3Q0EsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFDNUJBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUVuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsS0FBS0EsSUFBSUEsUUFB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UUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxRQUFRQSxJQUFJQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaENBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO3dCQUM1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQTt3QkFDakNBLENBQUNBO29CQUNMQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLE1BQU1BLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO29CQUNuQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBZ0JBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUMzQ0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsS0FBS0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2pDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFHREosOEJBQUlBLEdBQUpBLFVBQUtBLEtBQWFBO1lBQ2RLLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO2dCQUUzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBOzRCQUMvQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ25DQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDL0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQy9CQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDL0NBLENBQUNBO29CQUNMQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMvQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDL0JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM3REEsQ0FBQ0E7b0JBQ0xBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQy9CQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBOzRCQUMvQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzNFQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDL0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQy9CQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekZBLENBQUNBO29CQUNMQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM5QkEsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsU0FB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Q0FBQ0EsQ0FBQ0E7d0JBQ1JBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBOzRCQUN0REEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsUUFBUUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZFQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBOzRCQUNyREEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2hFQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLFdBQVdBLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUMvREEsSUFBSUEsTUFBTUEsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRXhDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFDdEJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE1BQU1BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO29CQUNo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QUM7SUFDN0IsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixLQUFLLElBQUk7WUFDTCxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLEtBQUssR0FBRyxDQUFDO1FBQ1QsS0FBSyxJQUFJO1lBQ0wsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssR0FBRyxDQUFDO1FBQ1QsS0FBSyxJQUFJO1lBQ0wsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxLQUFLLEdBQUcsQ0FBQztRQUNULEtBQUssSUFBSTtZQUNMLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLElBQUk7WUFDTCxNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELEtBQUssSUFBSTtZQUNMLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLEtBQUssR0FBRyxDQUFDO1FBQ1QsS0FBSyxNQUFNO1lBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBSUQsSUFBVSxFQUFFLENBc3hCWDtBQXR4QkQsV0FBVSxFQUFFO0lBQUNBLFFBQUlBLENBc3hCaEJBO0lBdHhCWUEsaUJBQUlBLEVBQUNBLENBQUNBO1FBRWYrUSxJQUFJQSxhQUFhQSxHQUFHQSx5Q0FBeUNBLENBQUNBO1FBRTlEQSxxQkFBK0JBLElBQU9BO1lBR2xDQyxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDMUJBLElBQUlBLEdBQVFBLENBQUNBO2dCQUViQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxZQUFZQSxLQUFLQSxDQUFDQTtvQkFDdEJBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNiQSxJQUFJQTtvQkFDQUEsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRWJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbkVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM1QkEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUMvRkEsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFRQSxDQUFDQSxDQUFDQTtnQ0FDakJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBOzRCQUNmQSxJQUFJQTtnQ0FDQUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ0pBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FB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QTtZQUV0QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLE1BQU1BLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNmQSxLQUFLQSxHQUFHQTt3QkFDSkEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2ZBLEtBQUtBLENBQUNBO29CQUNWQSxLQUFLQSxHQUFHQTt3QkFDSkEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzVCQSxLQUFLQSxDQUFDQTtvQkFDVkEsS0FBS0EsR0FBR0E7d0JBQ0pBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLHFCQUFjQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTs0QkFDN0NBLEVBQUVBLENBQUNBLENBQUNBLHFCQUFjQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQTtnQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBQ3REQSxDQUFDQTt3QkFDREEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2RBLEtBQUtBLENBQUNBO29CQUNWQSxLQUFLQSxHQUFHQTt3QkFDSkEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25CQSxLQUFLQSxDQUFDQTtnQkFDZEEsQ0FBQ0E7WUFDTEEs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LENBQUNBO29CQUNqRUEsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTVDQSxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsQ0FBQ0E7WUFFREQsNkJBQTZCQSxDQUFDQTtnQkFDMUJFLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLElBQUlBLENBQUNBO29CQUNsQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO2dCQUVoQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsaURBQWlEQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0RBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLHlDQUF5Q0EsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pHQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDWEEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ1pBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNWQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDWkEsQ0FBQ0E7b0JBRURBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUMvQkEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTlCQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDM0VBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSx5Q0FBeUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM1REEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUU5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1hBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNaQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDVkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1pBLENBQUNBO29CQUVEQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDL0JBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUU5QkEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNFQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7d0JBQUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBO2dCQUN2Q0EsQ0FBQ0E7Z0JBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBQ2hCQSxDQUFDQTtZQUVERix5QkFBeUJBLENBQUNBO2dCQUN0QkcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsSUFBSUEsQ0FBQ0E7b0JBQ2xCQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDYkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBRWhCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSwrQkFBK0JBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQ0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMkJBQTJCQSxDQUFDQSxJQUFJQSxNQUFNQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaEhBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFFOUJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO3dCQUNYQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDWkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ1ZBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO29CQUNaQSxDQUFDQTtvQkFFREEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BDQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMkJBQTJCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDOUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENB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TSxDQUFDLENBQUM7SUFDckYsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsVUFBVSxNQUFNO1FBQzFCLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQztBQUNOLENBQUM7QUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QixFQUFFLENBQUMsVUFBVSxHQUFHLFVBQVUsTUFBTTtRQUM1QixNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLFFBQVEsR0FBRyxVQUFVLE1BQU07UUFDMUIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsRUFBRSxDQUFDLFdBQVcsR0FBRztJQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRSxNQUFNO1FBQ2xFLE1BQU0sQ0FBQyxNQUFN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Q0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBOzRCQUM1QkEsRUFBRUEsRUFBRUEsUUFBUUE7NEJBQ1pBLElBQUlBLEVBQUVBLEtBQUtBO3lCQUNkQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFCQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFDcENBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsSUFBSUEsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQU9BO29CQUM3Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1hBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNwQkEsT0FBT0EsR0FBR0EsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQzNCQSxJQUFJQTs0QkFDQUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ3ZCQSxDQUFDQTtvQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0Es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QSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxNQUFNQSxLQUFLQSxRQUFRQSxJQUFJQSxFQUFFQSxDQUFDQSxNQUFNQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdkRBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQVNBLEVBQUVBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO29CQUNuREEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLGNBQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEtBQUtBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyREEsTUFBTUEsQ0FBRUEsY0FBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBbUJBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNsREEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQVVBLEVBQUVBLENBQUNBLE1BQU9BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBTUEsY0FBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsRUFBT0EsY0FBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzlGQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRS9CQSxJQUFJQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtnQkFFN0NBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENB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QUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNuQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMENBQTBDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDOUVBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO2dCQUNsQkEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUNqREEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0Esa0RBQWtEQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUhBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO2dCQUNsQkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFdkNBLElBQUlBLENBQUNBO2dCQUNEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNwQ0EsQ0FBRUE7WUFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1RBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNqQkEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMENBQTBDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxD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QSxDQUFDQTtZQUVyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hCQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQy9DQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbkRBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLEtBQUtBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN6Q0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2RBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1hBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQU9BLENBQUNBLENBQUNBO2dCQUVyQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2JBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqQ0EsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLFFBQVFBLElBQUlBLElBQUlBLElBQUlBLFFBQVFBLElBQUlBLElBQUlBLElBQUlBLFNBQVNBLENB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ZUEsQ0FBQ0EsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO3dCQUNoRUEsQ0FBQ0E7b0JBQ0xBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFFREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7b0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFlQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaEVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFHSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7b0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFLQSxLQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDL0NBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFFRHBDOzs7O1VBSURBO1FBQ0NBLDZCQUFRQSxHQUFSQSxVQUFT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QSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEJBLElBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUVkQSx1Q0FBdUNBO2dCQUN2Q0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3RCQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDeEJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMvQkEsTUFBTUEsSUFBSUEsU0FBU0EsQ0FBQ0EsMkNBQTJDQSxDQUFDQSxDQUFDQTtvQkFDckVBLENBQUNBO29CQUVEQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFM0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO29CQUVyQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2ZBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO3dCQUNsQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQzdCQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNoQkEsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3pCQSxDQUFDQTtnQkFFTEEsQ0FBQ0E7Z0JBQ0RBLEtBQUtBO2dCQUVMQSxFQUFFQSxDQUFDQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBLENBQUNBO29CQUN2QkEsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsSUFBT0E7d0JBQzlCQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDOUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNQQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQTtnQkFBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsNkRBQTZEQSxDQUFDQTtZQUNuRkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDZkEsQ0FBQ0E7UUFFRHRELCtCQUFVQSxHQUFWQTtZQUNJdUQsTUFBTUEsQ0FBQ0EsSUFBSUEsY0FBY0EsQ0FBSUEsSUFBSUEsRUFBRUEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0RBLENBQUNBO1FBRUR2RDs7V0FFR0E7UUFDSEEsb0NBQWVBLEdBQWZBLGNBQXlCd0QsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUF4akN0Q3hELGlCQUFNQSxHQUFHQSxPQUFJQSxDQUFDQTtZQUNqQkEscUJBQXFCQSxFQUFFQSxXQUFXQTtZQUNsQ0Esb0JBQW9CQSxFQUFFQSxPQUFPQTtZQUM3QkEsT0FBT0EsRUFBRUEsU0FBU0E7WUFDbEJBLGVBQWVBLEVBQUVBLFdBQVdBO1lBQzVCQSxjQUFjQSxFQUFFQSxRQUFRQTtZQUN4QkEsY0FBY0EsRUFBRUEsV0FBV0E7WUFDM0JBLG9CQUFvQkEsRUFBRUEsVUFBVUE7WUFDaENBLGdCQUFnQkEsRUFBRUEsUUFBUUE7WUFDMUJBLG1CQUFtQkEsRUFBRUEsU0FBU0E7U0FDakNBLEVBQUVBLFlBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBRXJCQTtZQUFDQSxZQUFTQSxDQUFDQSxLQUFLQTs7V0FDaEJBLHFDQUFhQSxVQUFrQkE7UUE0aUNuQ0EsaUJBQUNBO0lBQURBLENBQUNBLEVBL2pDa0NoVixZQUFTQSxFQStqQzNDQTtJQS9qQ1lBLGFBQVVBLGFBK2pDdEJBO0lBR0RBO1FBQXVDeVksa0NBQWFBO1FBQ2hEQSx3QkFBWUEsSUFBbUJBLEVBQUVBLEdBQXFCQTtZQUQxREMsaUJBZ01DQTtZQTlMT0Esa0JBQU1BLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBR2pCQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUV6QkEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFFeEJBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLGdCQUFnQkEsRUFBRUEsVUFBQ0EsS0FBS0EsRUFBRUEsS0FBS0E7Z0JBQ25DQSxLQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNoREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsZUFBZUEsRUFBRUEsVUFBQ0EsS0FBS0EsRUFBRUEsS0FBS0E7Z0JBQ2xDQSxLQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxPQUFPQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMvQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFSEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLENBQUNBO1FBRU9ELHVDQUFjQSxHQUF0QkEsVUFBdUJBLElBQUlBLEVBQUVBLEtBQUtBLEVBQUVBLEtBQUtBO1lBQ3JDRSxJQUFJQSxpQkFBaUJBLEdBQUdBLElBQUlBLElBQUlBLE9BQU9BLElBQUlBLElBQUlBLElBQUlBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLGdCQUFnQkEsSUFBSUEsSUFBSUEsSUFBSUEsV0FBV0EsSUFBSUEsSUFBSUEsSUFBSUEsUUFBUUEsSUFBSUEsSUFBSUEsSUFBSUEsVUFBVUEsQ0FBQ0E7WUFFdkpBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ2JBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDOUJBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLFVBQVVBLElBQUlBLElBQUlBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ2ZBLGlCQUFpQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDN0JBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFT0YsZ0NBQU9BLEdBQWZBLFVBQWdCQSxZQUFzQkE7WUFDbENHLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1lBRXpCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO2dCQUUvQ0EsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBRWhDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDVEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0E7d0JBQ2RBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxZQUFZQSxDQUFDQSxDQUFDQTtnQkFDdkVBLENBQUNBO2dCQUFDQSxJQUFJQTtvQkFDRkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO1lBQzNEQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFREgsK0JBQU1BLEdBQU5BO1lBQ0lJLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUkEsSUFBSUEsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRWZBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO29CQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFbkRBLElBQUlBLEVBQUVBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO2dCQUV2REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ0xBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBO3dCQUNYQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFTQSxDQUFDQSxFQUFFQSxDQUFDQTs0QkFDekIsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BCLENBQUMsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLElBQUlBO3dCQUNBQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDNUJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7b0JBQ2xCQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDdkNBLENBQUNBO2dCQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdkJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM3QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxV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QUFNQSxDQUFDQSxRQUFRQSxFQUFFQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQTtvQkFDbEVBLEtBQUlBLENBQUNBLE1BQTZCQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUMzREEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDUEEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdElBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBO2dCQUNsQkEsSUFBSUEsU0FBU0EsR0FBR0EsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxLQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDbkNBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLFNBQVNBLENBQUNBO1lBQzFDQSxDQUFDQSxDQUFDQTtZQUVGQSxzQkFBc0JBO1lBQ3RCQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxnQkFBZ0JBLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1lBRTlGQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLEdBQUdBLFVBQVVBLEVBQUVBLGdCQUFNQTtnQkFDaEVBLElB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
