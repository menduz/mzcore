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
            if (bindeo instanceof EventDispatcherBinding) {
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
            else if (bindeo === undefined && callback === undefined) {
                for (var i in this.ed_bindeos) {
                    delete this.ed_bindeos[i].cb;
                }
            }
        };
        EventDispatcher.prototype.emit = function (event) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (event in this.ed_bindeos) {
                if (arguments.length == 1) {
                    var ValorReturn = [];
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.call(this);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }
                    return ValorReturn;
                }
                else if (arguments.length == 2) {
                    var ValorReturn = [];
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.call(this, arguments[1]);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }
                    return ValorReturn;
                }
                else if (arguments.length > 2) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var ValorReturn = [];
                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.apply(this, args);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }
                    return ValorReturn;
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
                this[ch](value, viejo);
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
                this.rootNode.textContent = t;
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
                if (this.rootNode.textContent != t) {
                    this.rootNode.textContent = t;
                }
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
/// <reference path="../mz.ts" />
/// <reference path="Tmpl.ts" />
/// <reference path="Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="../CORE/Decorators.ts" />
/// <reference path="TextNode.ts" />
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
    function delegateRefreshScope(e) {
        if (e && typeof e == "object") {
            'refreshScope' in e && e.refreshScope();
        }
    }
    var templateCache = {};
    var paramRegex = /^__(\d)+$/;
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
                                if (childWidget.rootNode.textContent != a)
                                    childWidget.rootNode.textContent = a;
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
                                if (childWidget.rootNode.textContent != t) {
                                    childWidget.rootNode.textContent = t;
                                }
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
                        attrs[':' + attr.name + '_upd'] = (function (value, component, scope) {
                            return function () {
                                return mz.view.tmpl(value, component, scope);
                            };
                        })(attr.value, component, scope);
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
                element: widget.rootNode,
                $element: widget.DOM,
                jQueryEvent: event
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
            this.rootNode.$component = _parentComponent || this;
            this.scope = scope || null;
            this.children = children;
            if (this.defaultTemplate) {
                this.startComponent([this.defaultTemplate]);
                this.emit(Widget.EVENTS.ComponentMounted);
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
                        mz.dom.adapter.setAttribute(this.rootNode, attrName, value);
                    }
                }
            }
        };
        Widget.prototype.refreshScope = function () {
            var data = this.data;
            // the attrs who has the form ":(attName)_upd" (regexpAttrBinded) are attr generators for "attrName"
            for (var i in data) {
                var match = null;
                if (typeof data[i] == "function" && (match = regexpAttrBinded.exec(i))) {
                    this.attr(match[1], data[i]());
                }
            }
            this.children.forEach(delegateRefreshScope);
        };
        // Finds an element within this component
        Widget.prototype.find = function (selector) {
            return this.DOM.find(selector);
        };
        Widget.prototype.loadTemplate = function (url, forceSync) {
            var _this = this;
            if (forceSync === void 0) { forceSync = false; }
            if (url in mz.widgetTemplateSource) {
                this.startComponent(mz.widgetTemplateSource[url]);
                this.componentInitialized();
                this.emit(Widget.EVENTS.ComponentMounted);
                requestAnimationFrame(function () { return _this.resize(); });
                return;
            }
            var xhr = new XMLHttpRequest();
            var transformedUrl = mz.getPath(url);
            xhr.addEventListener('load', function (ev) {
                if (xhr.responseXML && xhr.responseXML instanceof Document) {
                    mz.widgetTemplateSource[url] = xhr.responseXML;
                    _this.startComponent(xhr.responseXML);
                    _this.componentInitialized();
                    _this.emit(Widget.EVENTS.ComponentMounted);
                    requestAnimationFrame(function () { return _this.resize(); });
                }
                else if (xhr.responseText && xhr.responseText.length) {
                    mz.widgetTemplateSource[url] = [xhr.responseText];
                    _this.startComponent([xhr.responseText], []);
                    _this.componentInitialized();
                    _this.emit(Widget.EVENTS.ComponentMounted);
                    requestAnimationFrame(function () { return _this.resize(); });
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
                var originalNode = this.rootNode, originalNode$ = this.DOM;
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
            this.widget.rootNode.className = value;
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
                var _this = this;
                attr['tag'] = attr['tag'] || 'div';
                _super.call(this, rootNode, attr, children, b, c, scope);
                this.children = this.generateScopedContent(this);
                this.primaryButton = null;
                this.startComponent();
                this.defaults = {};
                this.campos = {};
                this.camposArray = [];
                this._findICampos(this);
                if (this.primaryButton && this.primaryButton.attr("disabled") == undefined) {
                    this.on('valueChanged', mz.delayer(function () {
                        _this.primaryButton.attr('disabled', !_this.checkAll(true));
                    }, 50));
                    this.primaryButton.attr('disabled', !this.checkAll(true));
                }
            }
            MzForm.prototype.setValues = function (a) {
                _super.prototype.setValues.call(this, a);
                this.primaryButton && this.primaryButton.attr('disabled', !this.checkAll(true));
            };
            MzForm.prototype._findICampos = function (component) {
                var _this = this;
                if (component) {
                    if (typeof component == "object") {
                        if (component instanceof widgets.MzInput) {
                            var fieldName = component.attr('field-name');
                            if (!fieldName) {
                                console.warn("all mz-icampo tags should have the attr 'field-name'", component);
                            }
                            else {
                                (function (campo) {
                                    var iCampoWidget = component;
                                    _this.campos[campo] = iCampoWidget;
                                    _this.camposArray.push(iCampoWidget);
                                    var defValue = component.attr('default-value');
                                    if (typeof defValue != "undefined") {
                                        _this.defaults[campo] = defValue;
                                        _this.set(campo, defValue);
                                    }
                                    if (isDef(_this.get(campo)))
                                        iCampoWidget.value = _this.get(campo);
                                })(fieldName);
                            }
                        }
                        else {
                            if (component.rootNode && component.rootNode.nodeName.toLowerCase() == "button" && component.attr('mz-form-primary')) {
                                this.primaryButton = component;
                            }
                        }
                    }
                    component && component.children && component.children.forEach(function (c) {
                        if (!(c instanceof MzForm))
                            _this._findICampos(c);
                    });
                }
            };
            MzForm.prototype.fieldIsVisible = function (fieldName) {
                if (fieldName in this.campos) {
                    return this.campos[fieldName].DOM.is(':visible');
                }
                return false;
            };
            MzForm.prototype.focus = function (field) {
                if (!field && this.camposArray.length)
                    this.camposArray[0].focus && this.camposArray[0].focus();
                else if (field && field in this.campos)
                    this.campos[field].focus && this.campos[field].focus();
            };
            MzForm.prototype.checkAll = function (noEmitAlert) {
                var errores = [];
                var cumple = true;
                var clase = 'has-error';
                try {
                    clase = this.attr['error-class'] || clase;
                }
                catch (e) {
                }
                for (var i in this.campos) {
                    if (this.campos[i] instanceof widgets.MzInput) {
                        var err = this.campos[i].checkValid(this.data);
                        if (err === true) {
                            mz.dom.adapter.removeClass(this.campos[i].rootNode, clase);
                        }
                        else if (!noEmitAlert) {
                            cumple = false;
                            mz.dom.adapter.addClass(this.campos[i].rootNode, clase);
                            if (typeof err === "string" || err instanceof Error) {
                                errores.push(err);
                            }
                        }
                        else
                            cumple = false;
                    }
                }
                if (errores.length) {
                    alert(errores.join('\n'));
                    return false;
                }
                return cumple;
            };
            MzForm.prototype.clearValues = function () {
                for (var c in this.campos)
                    this.set(c, this.campos[c].attr('default-value') || null);
            };
            MzForm.prototype.getFormValues = function () {
                var t = {};
                for (var i in this.campos) {
                    t[i] = this.data[i];
                }
                return t;
            };
            MzForm.prototype.set = function (key, value) {
                _super.prototype.set.call(this, key, value);
                if (this.campos && key in this.campos) {
                    this.campos[key].value = value;
                }
            };
            MzForm.EMPTY_TAG = true;
            MzForm = __decorate([
                mz.Widget.RegisterComponent("mz-form"), 
                __metadata('design:paramtypes', [HTMLElement, Object, Array, Object, Object, Object])
            ], MzForm);
            return MzForm;
        })(mz.Widget);
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
        function delegateRefreshScope(e) {
            if (e && 'refreshScope' in e) {
                //let parent = mz.dom.adapter.parentElement(e.rootNode);
                //let next = mz.dom.adapter.nextSibling(e.rootNode);
                //mz.dom.adapter.remove(e.rootNode);
                e.refreshScope();
            }
        }
        var MzRepeat = (function (_super) {
            __extends(MzRepeat, _super);
            function MzRepeat(rootNode, attr, children, b, c, scope) {
                _super.call(this, rootNode, attr, [], b, c, scope);
                this.collectionKey = Symbol("mz-repeat-" + mz.genUID());
                this.ponerElem = this.ponerElem.bind(this);
                this.delegateUnmountElements = this.delegateUnmountElements.bind(this);
                // if the list contains elements.
                if (this.list && this.list.length) {
                    this.list.forEach(this.ponerElem, this);
                }
            }
            MzRepeat.prototype.list_changed = function (list, prevList) {
                var _this = this;
                if (list === prevList)
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
                if (list && !(list instanceof mz.Collection)) {
                    console.error(new Error("<mz-repeat> expects attr 'list: mz.Collection'"));
                    return;
                }
                if (this.list) {
                    this.listenersLista.push(this.list.on('changed', this.redraw.bind(this)));
                    this.listenersLista.push(this.list.on('pre_clear', function (a) { return _this.redraw('pre_clear', a); }));
                    if (this.list.length && !!this.collectionKey /* collection initialized */)
                        this.redraw('refresh');
                }
            };
            MzRepeat.prototype.unmount = function () {
                this.list = null;
                _super.prototype.unmount.call(this);
            };
            MzRepeat.prototype.ponerElem = function (itemDeLista) {
                var _this = this;
                this.item = itemDeLista;
                var dom = itemDeLista[this.collectionKey];
                var existia = !!dom;
                if (!existia) {
                    dom = this.generateScopedContent(itemDeLista);
                    itemDeLista[this.collectionKey] = dom;
                }
                dom.forEach(function (e) {
                    // si el elemento ya existia, llamo a refreshScope
                    if (existia && e && (typeof e == "object") && 'refreshScope' in e)
                        e.refreshScope();
                    _this.append(e);
                });
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
            MzRepeat.prototype.delegateUnmountElements = function (elementoLista) {
                if (elementoLista[this.collectionKey]) {
                    elementoLista[this.collectionKey].forEach(delegateUnmountElement);
                    delete elementoLista[this.collectionKey];
                }
            };
            MzRepeat.prototype.redraw = function (tipo, a, b) {
                var rebuild = !tipo;
                if (tipo == mz.Collection.EVENTS.ElementChanged && this.collectionKey in b) {
                    var widgets_2 = b[this.collectionKey];
                    for (var i in widgets_2) {
                        delegateRefreshScope(widgets_2[i]);
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
                } /*else if (tipo == "removed") {
                    rebuild = true;
                }*/
                else if (tipo == "refresh") {
                    this.detachAllNodes();
                    this.list.forEach(delegateRefreshScope);
                    rebuild = true;
                }
                else if (tipo == mz.Collection.EVENTS.BeforeClearCollection) {
                    this.list.forEach(this.delegateUnmountElements);
                    return;
                }
                if (tipo == "clear" || rebuild) {
                    this.detachAllNodes();
                }
                if (rebuild && this.list.length) {
                    this.list.forEach(this.ponerElem, this);
                }
            };
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', mz.Collection)
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



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXouanMiLCJzb3VyY2VzIjpbIm16LnRzIiwiVklFVy9UbXBsLnRzIiwiVklFVy9IZWxwZXJzLnRzIiwiQ09SRS9FdmVudERpc3BhdGNoZXIudHMiLCJDT1JFL01WQ09iamVjdC50cyIsIkNPUkUvRGVjb3JhdG9ycy50cyIsIlZJRVcvVGV4dE5vZGUudHMiLCJWSUVXL1dpZGdldC50cyIsIldJREdFVFMvbXotc3dpdGNoZXIudHMiLCJBUFAvQXBwQ29udHJvbGxlci50cyIsIkFVVEgvSldULnRzIiwiQ09SRS9JMThuLnRzIiwiQ09SRS9EYXRlLnRzIiwiQ09SRS9Qcm9taXNlLnRzIiwiQ09SRS9Yci50cyIsIkNPUkUvU3RyaW5ncy50cyIsIkFVVEgvT0F1dGgyLnRzIiwiQ09SRS9BTUQvUmVxdWlyZS50cyIsIkNPUkUvQU1EL01vZHVsZS50cyIsIkNPUkUvQU1EL0RlZmluZS50cyIsIkNPUkUvQU1EL1NldHVwLnRzIiwiQ09SRS9Db2xsZWN0aW9uLnRzIiwiQ09SRS9ET00udHMiLCJDT1JFL0RPTS9ET00udHMiLCJDT1JFL0RPTS9ET01fQnJvd3NlckltcGwudHMiLCJDT1JFL1JlZmxlY3Rpb24udHMiLCJDT1JFL1JvdXRlLnRzIiwiVklFVy9DU1MudHMiLCJWSUVXL0RJUkVDVElWRVMvTXpNb2RlbC50cyIsIlZJRVcvRElSRUNUSVZFUy9NelJhdy50cyIsIlZJRVcvRElSRUNUSVZFUy9jbGFzc05hbWUudHMiLCJWSUVXL0RJUkVDVElWRVMvVmlzaWJsZS50cyIsIlZJRVcvSHRtbFNhbml0aXplci50cyIsIlZJRVcvVFNYLnRzIiwiV0lER0VUUy9CbG9ja3MudHMiLCJXSURHRVRTL216LWZvcm0udHMiLCJXSURHRVRTL216LXJlcGVhdC50cyJdLCJuYW1lcyI6WyJpc0RlZiIsIm16IiwibXouYWxpYXMiLCJtei5nZXRQYXRoIiwibXouZ2V0RWxlbWVudFBvc2l0aW9uIiwiZXh0ZW5kIiwibXouY29weSIsIm16Lm1hcFhJbnRvIiwibXoubWFwSW50byIsIm16LmlzSXRlcmFibGUiLCJtei50cmltIiwibXouZ2V0RE9NSUQiLCJtei5nZW5VSUQiLCJtei5kYXRhIiwibXouZGF0YS5vcmRlciIsIm16LmRhdGEub3JkZXIubnVsbF9hcnJpYmEiLCJtei5kYXRhLm9yZGVyLm51bGxfYWJham8iLCJtei5kYXRhLm9yZGVyLmJ1aWxkIiwibXouZXNjYXBlUmVnRXhwIiwibXoubG9hZENzcyIsIm16LmZuSW5mbyIsIm16LmNvbXBpbGVGaWx0ZXIiLCJtei5nZXRXaW5kb3dTaXplIiwibXouZ2xvYmFsQ2FsbGJhY2siLCJtei5idXNjYXJBcmd1bWVudG9UaXBvIiwibXoudmlldyIsIm16LnZpZXcudG1wbCIsIm16LnZpZXcudG1wbC5pbnRlcm5hbFRtcGwiLCJtei52aWV3LnRtcGwuZXhwciIsIm16LnZpZXcudG1wbC53cmFwIiwibXoudmlldy50bXBsLnNwbGl0IiwibXoudmlldy50bXBsLmV4dHJhY3QiLCJtei5nZXRIaWRkZW5Qcm9wIiwibXouZ2V0VHJhbnNmb3JtVGFnIiwibXouRXZlbnREaXNwYXRjaGVyQmluZGluZyIsIm16LkV2ZW50RGlzcGF0Y2hlckJpbmRpbmcuY29uc3RydWN0b3IiLCJtei5FdmVudERpc3BhdGNoZXJCaW5kaW5nLm9mZiIsIm16LkV2ZW50RGlzcGF0Y2hlciIsIm16LkV2ZW50RGlzcGF0Y2hlci5jb25zdHJ1Y3RvciIsIm16LkV2ZW50RGlzcGF0Y2hlci5vbiIsIm16LkV2ZW50RGlzcGF0Y2hlci5vbmNlIiwibXouRXZlbnREaXNwYXRjaGVyLm9mZiIsIm16LkV2ZW50RGlzcGF0Y2hlci5lbWl0IiwibXouTVZDT2JqZWN0IiwibXouTVZDT2JqZWN0LmNvbnN0cnVjdG9yIiwibXouTVZDT2JqZWN0LmdldEFsbCIsIm16Lk1WQ09iamVjdC5zZXRWYWx1ZXMiLCJtei5NVkNPYmplY3Quc2V0IiwibXouTVZDT2JqZWN0LmdldCIsIm16Lk1WQ09iamVjdC5wcm94eSIsIm16LmNvcmUiLCJtei5jb3JlLmRlY29yYXRvcnMiLCJtei5jb3JlLmRlY29yYXRvcnMuTG9nUmVzdWx0IiwibXouY29yZS5kZWNvcmF0b3JzLm5vRW51bWVyYWJsZSIsIm16LmNvcmUuZGVjb3JhdG9ycy5kZWxheWVyIiwibXouY29yZS5kZWNvcmF0b3JzLnNjcmVlbkRlbGF5ZXIiLCJtei53aWRnZXRzIiwibXoud2lkZ2V0cy5UZXh0Tm9kZSIsIm16LndpZGdldHMuVGV4dE5vZGUuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLlRleHROb2RlLnNldHVwIiwibXoud2lkZ2V0cy5UZXh0Tm9kZS51bm1vdW50IiwibXoud2lkZ2V0cy5UZXh0Tm9kZS5yZWZyZXNoU2NvcGUiLCJtei53aWRnZXRzLlRleHROb2RlLnJldHVyblRvUG9sbCIsIm16LndpZGdldHMuVGV4dE5vZGUuZ2V0RnJvbVBvbGwiLCJtei5BdHRyaWJ1dGVEaXJlY3RpdmUiLCJtei5BdHRyaWJ1dGVEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJtei5BdHRyaWJ1dGVEaXJlY3RpdmUubW91bnQiLCJtei5BdHRyaWJ1dGVEaXJlY3RpdmUudW5tb3VudCIsIm16LkF0dHJpYnV0ZURpcmVjdGl2ZS5jaGFuZ2VkIiwibXouQXR0cmlidXRlRGlyZWN0aXZlLnZhbHVlIiwibXouQXR0cmlidXRlRGlyZWN0aXZlLlJlZ2lzdGVyIiwibXouZGVsZWdhdGVSZWZyZXNoU2NvcGUiLCJtei5xdWFzaVRvRG9tIiwibXouYmluZFdpZGdldEF0dHIiLCJtei5kb21Ub1dpZGdldHMiLCJtei5nZXRDaGlsZE5vZGVzIiwibXouZ2V0SlF1ZXJ5RXZlbnRXcmFwcGVyIiwibXouZXJyb3JMb2FkaW5nVGVtcGxhdGUiLCJtei5XaWRnZXQiLCJtei5XaWRnZXQuY29uc3RydWN0b3IiLCJtei5XaWRnZXQuc2NvcGVfY2hhbmdlZCIsIm16LldpZGdldC5ET00iLCJtei5XaWRnZXQuZ2VuZXJhdGVTY29wZWRDb250ZW50IiwibXouV2lkZ2V0LmF0dHIiLCJtei5XaWRnZXQucmVmcmVzaFNjb3BlIiwibXouV2lkZ2V0LmZpbmQiLCJtei5XaWRnZXQubG9hZFRlbXBsYXRlIiwibXouV2lkZ2V0LmNvbXBvbmVudEluaXRpYWxpemVkIiwibXouV2lkZ2V0LnN0YXJ0Q29tcG9uZW50IiwibXouV2lkZ2V0LmFwcGVuZENoaWxkcmVucyIsIm16LldpZGdldC5maW5kQ29udGVudFNlbGVjdG9yIiwibXouV2lkZ2V0LmFwcGVuZCIsIm16LldpZGdldC5hcHBlbmRUbyIsIm16LldpZGdldC5pbml0QXR0ciIsIm16LldpZGdldC5yZXNpemUiLCJtei5XaWRnZXQudW5tb3VudCIsIm16LldpZGdldC5SZWdpc3RlckNvbXBvbmVudCIsIm16LldpZGdldC5Db25maWd1cmVFbXB0eVRhZyIsIm16LldpZGdldC5UZW1wbGF0ZSIsIm16LldpZGdldC5Db25maWd1cmVVbndyYXBwZWQiLCJtei5XaWRnZXQuQ29uZmlndXJlVGFnIiwibXouV2lkZ2V0LkF0dHJpYnV0ZSIsIm16LndpZGdldHMuQmFzZUVsZW1lbnQiLCJtei53aWRnZXRzLkJhc2VFbGVtZW50LmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5CYXNlUGFnZWxldCIsIm16LndpZGdldHMuQmFzZVBhZ2VsZXQuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLklubGluZVBhZ2VsZXQiLCJtei53aWRnZXRzLklubGluZVBhZ2VsZXQuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLk16U3dpdGNoZXIiLCJtei53aWRnZXRzLk16U3dpdGNoZXIuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLk16U3dpdGNoZXIuc2hvdyIsIm16LndpZGdldHMuTXpTd2l0Y2hlci5yZXNpemUiLCJtei53aWRnZXRzLk16U3dpdGNoZXJQYW5lbCIsIm16LndpZGdldHMuTXpTd2l0Y2hlclBhbmVsLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NelN3aXRjaGVyUGFuZWwuc2hvdyIsIm16LndpZGdldHMuTXpTd2l0Y2hlclBhbmVsLmlzVmlzaWJsZSIsIm16LmFwcCIsIm16LmFwcC5QYWdlIiwibXouYXBwLlBhZ2UuY29uc3RydWN0b3IiLCJtei5hcHAuUGFnZS5oYW5kbGVSb3V0ZSIsIm16LmFwcC5QYWdlLnNob3ciLCJtei5hcHAuUGFnZUNvb3JkaW5hdG9yIiwibXouYXBwLlBhZ2VDb29yZGluYXRvci5jb25zdHJ1Y3RvciIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3Iuc2V0UGFnZXMiLCJtei5hcHAuUGFnZUNvb3JkaW5hdG9yLmxvYWRlZCIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3Iuc2hvdyIsIm16LmFwcC5QYWdlQ29vcmRpbmF0b3IubmF2aWdhdGUiLCJtei5hcHAuUGFnZUNvb3JkaW5hdG9yLmdldFBhZ2UiLCJtei5hdXRoIiwibXouYXV0aC5qd3QiLCJtei5hdXRoLmp3dC51cmxCYXNlNjREZWNvZGUiLCJtei5hdXRoLmp3dC5kZWNvZGVUb2tlbiIsIm16LmF1dGguand0LmdldFRva2VuRXhwaXJhdGlvbkRhdGUiLCJtei5hdXRoLmp3dC5pc1Rva2VuRXhwaXJlZCIsIm16LmRhdGUiLCJtei5kYXRlLnBhcnNlT2JqZWN0IiwibXouZGF0ZS5hZGRGZWF0dXJlIiwibXouZGF0ZS5mcm9tU3RyaW5nIiwibXouZGF0ZS5uZXdTeW5jcm8iLCJtei5kYXRlLnN5bmMiLCJtei5kYXRlLnBhcnNlIiwibXouZGF0ZS5wYXJzZS5wYXJzZUpzb25EYXRlIiwibXouZGF0ZS5wYXJzZS5jb252ZXJ0aXJBRmVjaGFIb3JhIiwibXouZGF0ZS5wYXJzZS5jb252ZXJ0aXJBRmVjaGEiLCJtei5kYXRlLmFkZCIsIm16LmRhdGUuZm10X2RhdGUiLCJtei5kYXRlLmZtdF90aW1lIiwibXouZGF0ZS5mbXRfZGF0ZV90aW1lIiwibXouZGF0ZS50b1N0cmluZyIsIm16LmRhdGUuZm10X2R1cmFjaW9uIiwibXouZGF0ZS5wYXJzZUR1cmFjaW9uIiwibXoucHJvbWlzZSIsIm16LnByb21pc2Uud2FpdCIsIm16LnByb21pc2UueWllbGQiLCJtei5wcm9taXNlLm5leHRGcmFtZSIsIm16LnByb21pc2UucGFyc2VTdHJpbmdEYXRlcyIsIm16LnJlcyIsIm16LmdldFBhcmFtcyIsIm16LnhyIiwibXoueHIuZm9ybWF0dGVycyIsIm16LnhyLnhtbEh0dHBSZXF1ZXN0IiwibXoueHIucHJvbWlzZSIsIm16LnhyLnVybFJlc29sdmUiLCJtei54ci51cmxJc1NhbWVPcmlnaW4iLCJtei54ci51cmxFbmNvZGUiLCJtei54ci5nZXQiLCJtei54ci5wdXQiLCJtei54ci5wb3N0IiwibXoueHIucGF0Y2giLCJtei54ci5kZWwiLCJtei54ci5vcHRpb25zIiwibXoub2F1dGgyIiwibXoub2F1dGgyLmV4dHJhY3REb21haW4iLCJtei5vYXV0aDIudG9rZW5HZXR0ZXIiLCJtei5vYXV0aDIuc2V0dXBUb2tlbiIsIm16Lm9hdXRoMi5zZXRUb2tlbiIsIm16Lm9hdXRoMi5jaGVja1JvbGUiLCJtei5vYXV0aDIucHVzaFJvbGVzIiwibXoub2F1dGgyLmFwcGx5QXV0aG9yaXphdGlvbkhlYWRlcnMiLCJtei5vYXV0aDIuY29uZmlndXJlIiwibXoub2F1dGgyLnJlZnJlc2hUb2tlbiIsIm16Lm9hdXRoMi5sb2dvdXQiLCJtei5vYXV0aDIubG9naW4iLCJtei5vYXV0aDIubG9nZ2VkSW4iLCJtei5yZXF1aXJlIiwibXouaW5jbHVkZSIsIm16LmxvYWRNb2R1bGUiLCJtei5yZXF1aXJlLnJvdXRlIiwibXoucmVxdWlyZS5kZWZpbmVGaWxlcyIsIm16Lk1vZHVsZSIsIm16Lk1vZHVsZS5jb25zdHJ1Y3RvciIsIm16Lk1vZHVsZS5nZXRQYXRoIiwibXouTW9kdWxlLnJlcXVpcmUiLCJtei5Nb2R1bGUuZGVmaW5lIiwibXouTW9kdWxlRXhwb3J0cyIsIm16Lk1vZHVsZUV4cG9ydHMuY29uc3RydWN0b3IiLCJtei5Nb2R1bGVFeHBvcnRzLnNldCIsIm16LnVuZGVmaW5lIiwibXouZGVmaW5lIiwibXouQ29sbGVjdGlvbiIsIm16LkNvbGxlY3Rpb24uY29uc3RydWN0b3IiLCJtei5Db2xsZWN0aW9uLmZpcnN0IiwibXouQ29sbGVjdGlvbi5sYXN0IiwibXouQ29sbGVjdGlvbi5jbGVhciIsIm16LkNvbGxlY3Rpb24ubGVuZ3RoIiwibXouQ29sbGVjdGlvbi5nZXRMZW5ndGgiLCJtei5Db2xsZWN0aW9uLnNldExlbmd0aCIsIm16LkNvbGxlY3Rpb24ubWFwIiwibXouQ29sbGVjdGlvbi5mb3JFYWNoIiwibXouQ29sbGVjdGlvbi5hc3luY0ZvckVhY2giLCJtei5Db2xsZWN0aW9uLmFzeW5jRm9yRWFjaC5zY2giLCJtei5Db2xsZWN0aW9uLl9pbmRpemFyIiwibXouQ29sbGVjdGlvbi5fZGVpbmRpemFyIiwibXouQ29sbGVjdGlvbi5fcmVpbmRpemFyIiwibXouQ29sbGVjdGlvbi5nZXRBdCIsIm16LkNvbGxlY3Rpb24ucmVkdWNlIiwibXouQ29sbGVjdGlvbi5ncm91cEJ5IiwibXouQ29sbGVjdGlvbi5rZXkiLCJtei5Db2xsZWN0aW9uLmluc2VydEF0IiwibXouQ29sbGVjdGlvbi5yZW1vdmVBdCIsIm16LkNvbGxlY3Rpb24uc2V0QXQiLCJtei5Db2xsZWN0aW9uLnB1c2giLCJtei5Db2xsZWN0aW9uLnBvcCIsIm16LkNvbGxlY3Rpb24uYWRkUmFuZ2UiLCJtei5Db2xsZWN0aW9uLnVwZGF0ZSIsIm16LkNvbGxlY3Rpb24udXBkYXRlQnlLZXkiLCJtei5Db2xsZWN0aW9uLnVwZGF0ZUluZGV4IiwibXouQ29sbGVjdGlvbi5qb2luIiwibXouQ29sbGVjdGlvbi5zdW0iLCJtei5Db2xsZWN0aW9uLm9yZGVyQnkiLCJtei5Db2xsZWN0aW9uLm9yZGVyQnlEZXNjIiwibXouQ29sbGVjdGlvbi5zb21lIiwibXouQ29sbGVjdGlvbi53aGVyZSIsIm16LkNvbGxlY3Rpb24ucmVtb3ZlQnlLZXkiLCJtei5Db2xsZWN0aW9uLnJlbW92ZSIsIm16LkNvbGxlY3Rpb24uc2luZ2xlIiwibXouQ29sbGVjdGlvbi5jb250YWlucyIsIm16LkNvbGxlY3Rpb24uY29udGFpbnNLZXkiLCJtei5Db2xsZWN0aW9uLmluZGV4T2YiLCJtei5Db2xsZWN0aW9uLmxhc3RJbmRleE9mIiwibXouQ29sbGVjdGlvbi50b0FycmF5IiwibXouQ29sbGVjdGlvbi5jbG9uZSIsIm16LkNvbGxlY3Rpb24uaW5kZXhlZEdldCIsIm16LkNvbGxlY3Rpb24uaW5kZXhlZEdldEluZGV4IiwibXouQ29sbGVjdGlvbi5tZXJnZUVsZW0iLCJtei5Db2xsZWN0aW9uLm1heCIsIm16LkNvbGxlY3Rpb24ubWluIiwibXouQ29sbGVjdGlvbi5hdmciLCJtei5Db2xsZWN0aW9uLnRha2UiLCJtei5Db2xsZWN0aW9uLnRha2VJbnRvIiwibXouQ29sbGVjdGlvbi5zd2FwSXRlbXMiLCJtei5Db2xsZWN0aW9uLmNvdW50IiwibXouQ29sbGVjdGlvbi5yZXZlcnNlIiwibXouQ29sbGVjdGlvbi5tZXJnZUFycmF5IiwibXouQ29sbGVjdGlvbi5jcmVhdGVWaWV3IiwibXouQ29sbGVjdGlvbi5nZXRQcml2YXRlQXJyYXkiLCJtei5Db2xsZWN0aW9uVmlldyIsIm16LkNvbGxlY3Rpb25WaWV3LmNvbnN0cnVjdG9yIiwibXouQ29sbGVjdGlvblZpZXcuX2hhbmRsZUNoYW5nZWQiLCJtei5Db2xsZWN0aW9uVmlldy5fcmVtYWtlIiwibXouQ29sbGVjdGlvblZpZXcucmVzb3J0IiwibXouQ29sbGVjdGlvblZpZXcucmVmcmVzaCIsIm16LkNvbGxlY3Rpb25WaWV3LmZpbHRlciIsIm16LkNvbGxlY3Rpb25WaWV3Lm9yZGVyQnkiLCJtei5Db2xsZWN0aW9uVmlldy5vcmRlckJ5RGVzYyIsIm16LkNvbGxlY3Rpb25WaWV3LmF0dGFjaFRvIiwibXouQ29sbGVjdGlvblZpZXcuZGV0YWNoIiwibXouZG9tIiwibXouZG9tLnNldFJvb3REb21BZGFwdGVyIiwibXouZG9tLkFic3RyYWN0RG9tQWRhcHRlciIsIm16LmRvbS5BYnN0cmFjdERvbUFkYXB0ZXIuY29uc3RydWN0b3IiLCJtei5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5jb25zdHJ1Y3RvciIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0RGlzdHJpYnV0ZWROb2RlcyIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIucmVzb2x2ZUFuZFNldEhyZWYiLCJtei5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyLnN1cHBvcnRzRE9NRXZlbnRzIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5zdXBwb3J0c05hdGl2ZVNoYWRvd0RPTSIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0QW5pbWF0aW9uUHJlZml4IiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5nZXRUcmFuc2l0aW9uRW5kIiwibXouZG9tLkdlbmVyaWNCcm93c2VyRG9tQWRhcHRlci5zdXBwb3J0c0FuaW1hdGlvbiIsIm16LmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0WEhSIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNvbnN0cnVjdG9yIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnBhcnNlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLm1ha2VDdXJyZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmhhc1Byb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFByb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFByb3BlcnR5IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmludm9rZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5sb2dFcnJvciIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5sb2ciLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubG9nR3JvdXAiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubG9nR3JvdXBFbmQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYXR0clRvUHJvcE1hcCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5xdWVyeSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5xdWVyeVNlbGVjdG9yIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnF1ZXJ5U2VsZWN0b3JBbGwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIub24iLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIub25BbmRDYW5jZWwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZGlzcGF0Y2hFdmVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVNb3VzZUV2ZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZUV2ZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnByZXZlbnREZWZhdWx0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzUHJldmVudGVkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldElubmVySFRNTCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRPdXRlckhUTUwiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubm9kZU5hbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIubm9kZVZhbHVlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnR5cGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY29udGVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5maXJzdENoaWxkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLm5leHRTaWJsaW5nIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnBhcmVudEVsZW1lbnQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY2hpbGROb2RlcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jaGlsZE5vZGVzQXNMaXN0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNsZWFyTm9kZXMiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYXBwZW5kQ2hpbGQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVtb3ZlQ2hpbGQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVwbGFjZUNoaWxkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlbW92ZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pbnNlcnRCZWZvcmUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaW5zZXJ0QWxsQmVmb3JlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmluc2VydEFmdGVyIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldElubmVySFRNTCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRUZXh0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFRleHQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0VmFsdWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuc2V0VmFsdWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q2hlY2tlZCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRDaGVja2VkIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZUNvbW1lbnQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGVtcGxhdGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlRWxlbWVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVFbGVtZW50TlMiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGV4dE5vZGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlU2NyaXB0VGFnIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZVN0eWxlRWxlbWVudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVTaGFkb3dSb290IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFNoYWRvd1Jvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0SG9zdCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jbG9uZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEVsZW1lbnRzQnlUYWdOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNsYXNzTGlzdCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5hZGRDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNDbGFzcyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci50YWdOYW1lIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmF0dHJpYnV0ZU1hcCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNBdHRyaWJ1dGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0QXR0cmlidXRlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldEF0dHJpYnV0ZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRBdHRyaWJ1dGVOUyIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVBdHRyaWJ1dGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIudGVtcGxhdGVBd2FyZVJvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlSHRtbERvY3VtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmRlZmF1bHREb2MiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFRpdGxlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFRpdGxlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmVsZW1lbnRNYXRjaGVzIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzVGVtcGxhdGVFbGVtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzVGV4dE5vZGUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaXNDb21tZW50Tm9kZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pc0VsZW1lbnROb2RlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmhhc1NoYWRvd1Jvb3QiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaXNTaGFkb3dSb290IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmltcG9ydEludG9Eb2MiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYWRvcHROb2RlIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEhyZWYiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0RXZlbnRLZXkiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0R2xvYmFsRXZlbnRUYXJnZXQiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0SGlzdG9yeSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRMb2NhdGlvbiIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRCYXNlSHJlZiIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZXNldEJhc2VFbGVtZW50IiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFVzZXJBZ2VudCIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXREYXRhIiwibXouZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldERhdGEiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q29tcHV0ZWRTdHlsZSIsIm16LmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJtei5kb20uQnJvd3NlckRvbUFkYXB0ZXIucGVyZm9ybWFuY2VOb3ciLCJtei5kb20uZ2V0QmFzZUVsZW1lbnRIcmVmIiwibXouZG9tLnJlbGF0aXZlUGF0aCIsIlJlZmxlY3QiLCJSZWZsZWN0Lm1ldGFkYXRhIiwiUmVmbGVjdC5tZXRhZGF0YS5kZWNvcmF0b3IiLCJSZWZsZWN0LnNldE9iamVjdFN5bWJvbCIsIm16LmNzcyIsIm16LmNzcy5zZXQiLCJtei5jc3MuU3R5bGVzaGVldCIsIm16LmNzcy5TdHlsZXNoZWV0LmNvbnN0cnVjdG9yIiwibXouY3NzLlN0eWxlc2hlZXQuZW5hYmxlIiwibXouY3NzLlN0eWxlc2hlZXQuZGlzYWJsZSIsIm16LmNzcy5TdHlsZXNoZWV0LnJlZnJlc2giLCJtei5jc3MuU3R5bGVzaGVldC5zZXQiLCJNek1vZGVsRGlyZWN0aXZlIiwiTXpNb2RlbERpcmVjdGl2ZS5jb25zdHJ1Y3RvciIsIk16TW9kZWxEaXJlY3RpdmUudW5tb3VudCIsIk16TW9kZWxEaXJlY3RpdmUudGVhcmRvd24iLCJNek1vZGVsRGlyZWN0aXZlLmNoYW5nZWQiLCJtei53aWRnZXRzLk16SW5wdXQiLCJtei53aWRnZXRzLk16SW5wdXQuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLk16SW5wdXQuZm9jdXMiLCJtei53aWRnZXRzLk16SW5wdXQuY2hlY2tWYWxpZCIsIk16UmF3RGlyZWN0aXZlIiwiTXpSYXdEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJNelJhd0RpcmVjdGl2ZS5jaGFuZ2VkIiwiTXpDbGFzc05hbWVEaXJlY3RpdmUiLCJNekNsYXNzTmFtZURpcmVjdGl2ZS5jb25zdHJ1Y3RvciIsIk16Q2xhc3NOYW1lRGlyZWN0aXZlLmNoYW5nZWQiLCJNelZpc2libGVEaXJlY3RpdmUiLCJNelZpc2libGVEaXJlY3RpdmUuY29uc3RydWN0b3IiLCJNelZpc2libGVEaXJlY3RpdmUubW91bnQiLCJNelZpc2libGVEaXJlY3RpdmUudW5tb3VudCIsIk16VmlzaWJsZURpcmVjdGl2ZS5jaGFuZ2VkIiwibXoudmlldy5odG1sIiwibXoudmlldy5odG1sLmVzY2FwZSIsIm16LnZkb20iLCJtei52ZG9tLmNyZWF0ZUVsZW1lbnQiLCJtei5oIiwibXoud2lkZ2V0cy5GaXQiLCJtei53aWRnZXRzLkZpdC5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuRml0LmNsYXNzX2NoYW5nZWQiLCJtei53aWRnZXRzLkNsZWFyIiwibXoud2lkZ2V0cy5DbGVhci5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuRmxleENvbCIsIm16LndpZGdldHMuRmxleENvbC5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuRmxleENvbC5zdHlsZV9jaGFuZ2VkIiwibXoud2lkZ2V0cy5GbGV4Q29sLmNsYXNzX2NoYW5nZWQiLCJtei53aWRnZXRzLkZsZXhDb2xbJ2NvbC13aWR0aF9jaGFuZ2VkJ10iLCJtei53aWRnZXRzLkZsZXhDb250YWluZXIiLCJtei53aWRnZXRzLkZsZXhDb250YWluZXIuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZsZXhDb250YWluZXIuY2xhc3NfY2hhbmdlZCIsIm16LndpZGdldHMuRmxleFJvdyIsIm16LndpZGdldHMuRmxleFJvdy5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuRmxleFJvdy5jbGFzc19jaGFuZ2VkIiwibXoud2lkZ2V0cy5GbGV4Q2VsbCIsIm16LndpZGdldHMuRmxleENlbGwuY29uc3RydWN0b3IiLCJtei53aWRnZXRzLkZsZXhDZWxsLmNsYXNzX2NoYW5nZWQiLCJtei53aWRnZXRzLk16Rm9ybSIsIm16LndpZGdldHMuTXpGb3JtLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NekZvcm0uc2V0VmFsdWVzIiwibXoud2lkZ2V0cy5NekZvcm0uX2ZpbmRJQ2FtcG9zIiwibXoud2lkZ2V0cy5NekZvcm0uZmllbGRJc1Zpc2libGUiLCJtei53aWRnZXRzLk16Rm9ybS5mb2N1cyIsIm16LndpZGdldHMuTXpGb3JtLmNoZWNrQWxsIiwibXoud2lkZ2V0cy5NekZvcm0uY2xlYXJWYWx1ZXMiLCJtei53aWRnZXRzLk16Rm9ybS5nZXRGb3JtVmFsdWVzIiwibXoud2lkZ2V0cy5NekZvcm0uc2V0IiwibXoud2lkZ2V0cy5kZWxlZ2F0ZVVubW91bnRFbGVtZW50IiwibXoud2lkZ2V0cy5kZWxlZ2F0ZVJlZnJlc2hTY29wZSIsIm16LndpZGdldHMuTXpSZXBlYXQiLCJtei53aWRnZXRzLk16UmVwZWF0LmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NelJlcGVhdC5saXN0X2NoYW5nZWQiLCJtei53aWRnZXRzLk16UmVwZWF0LnVubW91bnQiLCJtei53aWRnZXRzLk16UmVwZWF0LnBvbmVyRWxlbSIsIm16LndpZGdldHMuTXpSZXBlYXQuZ2VuZXJhdGVTY29wZWRDb250ZW50IiwibXoud2lkZ2V0cy5NelJlcGVhdC5kZXRhY2hBbGxOb2RlcyIsIm16LndpZGdldHMuTXpSZXBlYXQuZGVsZWdhdGVVbm1vdW50RWxlbWVudHMiLCJtei53aWRnZXRzLk16UmVwZWF0LnJlZHJhdyJdLCJtYXBwaW5ncyI6IkFBQUEsd0NBQXdDO0FBQ3hDLHlDQUF5QztBQUV6QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUVELGVBQWUsQ0FBQztJQUNaQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxXQUFXQSxDQUFDQTtBQUNuQ0EsQ0FBQ0E7QUFBQSxDQUFDO0FBUUYsRUFBRSxFQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsRUFBQztJQUN2Qiw2QkFBNkI7SUFDN0IsSUFBSSxDQUFDLGc1RUFBNDJFLENBQUMsQ0FBQztBQUN2M0UsQ0FBQztBQUVELElBQVUsRUFBRSxDQXdvQlg7QUF4b0JELFdBQVUsRUFBRSxFQUFDLENBQUM7SUFnQ0NDLGdCQUFhQSxHQUFTQSxNQUFjQSxJQUFJQSxPQUFPQSxNQUFNQSxJQUFJQSxXQUFXQSxJQUFJQSxNQUFNQSxDQUFDQTtJQUsxRkEsQ0FBQ0E7UUFDRyxJ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SUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ1BBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFlBQVlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2SUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsR0FBR0EsS0FBS0EsR0FBR0EsR0FBR0EsRUFBRUEsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3BGQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFoQmVGLFVBQU9BLFVBZ0J0QkE7SUFBQUEsQ0FBQ0E7SUFJRkEsa0JBQWtCQTtJ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LENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLFFBQVFBLENBQUNBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdENBLENBQUNBO1FBRURBLCtCQUErQkE7UUFDL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2hCQSxDQUFDQSxDQUFDL0IsRUFBRUEsQ0FBQ0E7SUFFTUEsYUFBVUEsR0FBR0EsY0FBV0EsQ0FBQ0E7SUFFcENBLElBQUlBLEdBQWdCQSxDQUFDQTtJQUNyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsUUFBUUEsSUFBSUEsV0FBV0EsQ0FBQ0E7UUFDL0JBLEdBQUdBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBRTdCQSxrQkFBZUEsR0FBR0EsQ0FBQ0E7UUFDMUJnQyxJQUFJQSxRQUFRQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxFQUFFQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUV0REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFFdEJBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLElBQUlBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBO1lBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO1FBRWpEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUN2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FB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QUFHQSxFQUFFQSxDQUFDQTtZQUV0QkEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBR0E7Z0JBQ2RBLEdBQUdBLEdBQUdBLElBQUlBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7Z0JBQ25DQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFDM0JBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNkQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFDakJBLEdBQUdBLENBQUNBLFVBQVVBLEdBQUdBLFlBQVlBLENBQUNBO2dCQUM5QkEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBSUEsQ0FBQ0E7Z0JBRWxCQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFFdkJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUNQQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQTt3QkFDTCxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFDaEMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7b0JBQ2xCLENBQUMsQ0FBQUE7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBR0EsUUFBUUEsQ0FBQ0E7Z0JBQ3RCQSxDQUFDQTtnQkFFREEsS0FBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtnQkFFckNBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEtBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO2dCQUNsREEsS0FBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FB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LENBQUNBLENBQUNBLENBQUNBO29CQUMvQkEsSUFBSUEsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBRXJCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBOzRCQUMvQkEsSUFBSUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2hFQSxHQUFHQSxLQUFLQSxTQUFTQSxJQUFJQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDL0NBLENBQUNBO29CQUNMQSxDQUFDQTtvQkFFREEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3ZCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzlCQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFFcERBLElBQUlBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO29CQUVyQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDL0JBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBOzRCQUN6REEsR0FBR0EsS0FBS0EsU0FBU0EsSUFBSUEsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9DQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBRURBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO2dCQUN2QkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFuSE1MLHNCQUFNQSxHQUFHQSxFQUVmQTtRQW9ITEEsc0JBQUNBO0lBQURBLENBQUNBLElBQUFwQztJQXhIWUEsa0JBQWVBLGtCQXdIM0JBO0FBRUxBLENBQUNBLEVBN0lNLEVBQUUsS0FBRixFQUFFLFFBNklSO0FDN0lELGlDQUFpQztBQUNqQywyQ0FBMkM7Ozs7OztBQUUzQyxJQUFVLEVBQUUsQ0FxRFg7QUFyREQsV0FBVSxFQUFFLEVBQUMsQ0FBQztJQUNWQTtRQUErQjBDLDZCQUFrQkE7UUFZN0NBLG1CQUFZQSxJQUFLQTtZQUNiQyxpQkFBT0EsQ0FBQ0E7WUFIRkEsU0FBSUEsR0FBb0JBLEVBQUVBLENBQUNBO1lBSWpDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNqQ0EsQ0FBQ0E7UUFFREQsMEJBQU1BLEdBQU5BLGNBQVdFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBRTlCRiw2QkFBU0EsR0FBVEEsVUFBV0EsTUFBdUJBLEVBQUVBLElBQWNBO1lBQzlDRyxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxZQUFZQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUJBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQzdCQSxDQUFDQTtZQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2xDQSxDQUFDQTtZQUVEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUM3REEsQ0FBQ0E7UUFFREgsdUJBQUdBLEdBQUhBLFVBQUlBLEtBQWFBLEVBQUVBLEtBQVVBLEVBQUVBLGtCQUE0QkE7WUFDdkRJLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQTtZQUUxQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFFN0JBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO1lBRXpCQSxJQUFJQSxFQUFFQSxHQUFHQSxLQUFLQSxHQUFHQSxVQUFVQSxDQUFDQTtZQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsSUFBSUEsSUFBSUEsT0FBT0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsS0FBS0EsVUFBVUEsQ0FBQ0E7Z0JBQzdDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUUzQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFFdkNBLENBQUNBLGtCQUFrQkEsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDL0dBLENBQUNBO1FBRURKLHVCQUFHQSxHQUFIQSxVQUFJQSxLQUFhQTtZQUNiSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7UUFoRE1MLGdCQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNwQkEsaURBQWlEQTtZQUNqREEsU0FBU0EsRUFBRUEsV0FBV0E7WUFDdEJBLG9DQUFvQ0E7WUFDcENBLFlBQVlBLEVBQUVBLGNBQWNBO1NBQy9CQSxFQUNEQSxrQkFBZUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUEyQzVCQSxnQkFBQ0E7SUFBREEsQ0FBQ0EsRUFuRDhCMUMsRUFBRUEsQ0FBQ0EsZUFBZUEsRUFtRGhEQTtJQW5EWUEsWUFBU0EsWUFtRHJCQTtBQUNMQSxDQUFDQSxFQXJEUyxFQUFFLEtBQUYsRUFBRSxRQXFEWDtBQUVELElBQVUsRUFBRSxDQWNYO0FBZEQsV0FBVSxFQUFFO0lBQUNBLGFBQVNBLENBY3JCQTtJQWRZQSxvQkFBU0EsRUFBQ0EsQ0FBQ0E7UUFDcEIwQyxlQUFzQkEsTUFBb0JBLEVBQUVBLFdBQTRCQTtZQUNwRU0sRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxNQUFNQSxFQUFFQSxXQUFXQSxDQUFDQSxRQUFRQSxFQUFFQSxFQUFFQTtvQkFDbERBLEdBQUdBLEVBQUVBO3dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO29CQUNEQSxHQUFHQSxFQUFFQSxVQUFTQSxLQUFLQTt3QkFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDakMsQ0FBQztvQkFDREEsVUFBVUEsRUFBRUEsSUFBSUE7aUJBQ25CQSxDQUFDQSxDQUFDQTtZQUNQQSxDQUFDQTtRQUNMQSxDQUFDQTtRQVplTixlQUFLQSxRQVlwQkE7SUFDTEEsQ0FBQ0EsRUFkWTFDLFNBQVNBLEdBQVRBLFlBQVNBLEtBQVRBLFlBQVNBLFFBY3JCQTtBQUFEQSxDQUFDQSxFQWRTLEVBQUUsS0FBRixFQUFFLFFBY1g7QUN4RUQsaUNBQWlDO0FBRWpDLElBQU8sRUFBRSxDQTJEUjtBQTNERCxXQUFPLEVBQUU7SUFBQ0EsUUFBSUEsQ0EyRGJBO0lBM0RTQSxlQUFJQTtRQUFDaUQsY0FBVUEsQ0EyRHhCQTtRQTNEY0EscUJBQVVBLEVBQUNBLENBQUNBO1lBQ3ZCQyxtQkFBMEJBLE1BQWdCQSxFQUFFQSxHQUFXQSxFQUFFQSxLQUFVQTtnQkFDL0RDLE1BQU1BLENBQUNBO29CQUNIQSxLQUFLQSxFQUFFQTt3QkFBUyxjQUFjOzZCQUFkLFdBQWMsQ0FBZCxzQkFBYyxDQUFkLElBQWM7NEJBQWQsNkJBQWM7O3dCQUUxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQUMsSUFBSSxXQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFqQixDQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ2hELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDM0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFFL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBYyxHQUFHLFNBQUksQ0FBQyxhQUFRLENBQUcsQ0FBQyxDQUFDO3dCQUUvQyxNQUFNLENBQUMsTUFBTSxDQUFDO29CQUNsQixDQUFDO2lCQUNKQSxDQUFDQTtZQUNOQSxDQUFDQTtZQWJlRCxvQkFBU0EsWUFheEJBO1lBRURBLHNCQUE2QkEsTUFBY0EsRUFBRUEsV0FBbUJBLEVBQUVBLFVBQXdDQTtnQkFDdEdFLFVBQVVBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUM5QkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFDdEJBLENBQUNBO1lBSGVGLHVCQUFZQSxlQUczQkE7WUFLREEsSUFBSUEsWUFBWUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFckJBLGlCQUF3QkEsT0FBZUE7Z0JBQ25DRyxNQUFNQSxDQUFDQSxVQUFTQSxNQUFjQSxFQUFFQSxXQUFtQkEsRUFBRUEsVUFBd0NBO29CQUN6Rjs7Ozs7c0JBS0U7b0JBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcseUZBQXlGLENBQUMsQ0FBQztvQkFDdkgsTUFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDdEIsQ0FBQyxDQUFBQTtZQUNMQSxDQUFDQTtZQVhlSCxrQkFBT0EsVUFXdEJBO1lBRURBLHVCQUFpQ0EsTUFBY0EsRUFBRUEsV0FBbUJBLEVBQUVBLFVBQXNDQTtnQkFDeEdJOzs7OztvQkFLSUE7Z0JBQ0pBLElBQUlBLGFBQWFBLEdBQUdBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBO2dCQUNyQ0EsSUFBSUEsU0FBU0EsR0FBR0EsZUFBYUEsWUFBWUEsRUFBRUEsT0FBSUEsQ0FBQ0E7Z0JBQ2hEQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxHQUFHQSx5RkFBeUZBLENBQUNBLENBQUNBO2dCQUV2SEEsVUFBVUEsQ0FBQ0EsS0FBS0EsR0FBUUE7b0JBQ3BCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzVGLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDN0MsQ0FBQyxDQUFDQTtnQkFFRkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFFdEJBLENBQUNBO1lBbEJlSix3QkFBYUEsZ0JBa0I1QkE7UUFFTEEsQ0FBQ0EsRUEzRGNELFVBQVVBLEdBQVZBLGVBQVVBLEtBQVZBLGVBQVVBLFFBMkR4QkE7SUFBREEsQ0FBQ0EsRUEzRFNqRCxJQUFJQSxHQUFKQSxPQUFJQSxLQUFKQSxPQUFJQSxRQTJEYkE7QUFBREEsQ0FBQ0EsRUEzRE0sRUFBRSxLQUFGLEVBQUUsUUEyRFI7QUM3REQsaUNBQWlDO0FBQ2pDLHdDQUF3QztBQUN4QywyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDLGtDQUFrQztBQUVsQyxJQUFPLEVBQUUsQ0E0RVI7QUE1RUQsV0FBTyxFQUFFO0lBQUNBLFdBQU9BLENBNEVoQkE7SUE1RVNBLGtCQUFPQSxFQUFDQSxDQUFDQTtRQUNmdUQ7WUFNSUMsa0JBQW9CQSxLQUFhQSxFQUFVQSxTQUFpQkEsRUFBVUEsS0FBVUE7Z0JBQTVEQyxVQUFLQSxHQUFMQSxLQUFLQSxDQUFRQTtnQkFBVUEsY0FBU0EsR0FBVEEsU0FBU0EsQ0FBUUE7Z0JBQVVBLFVBQUtBLEdBQUxBLEtBQUtBLENBQUtBO2dCQUhoRkEsY0FBU0EsR0FBNkJBLEVBQUVBLENBQUNBO2dCQUlyQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsT0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxXQUFXQSxDQUFDQTtvQkFBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRXJDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFM0NBLElBQUlBLENBQUNBLFFBQVNBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUM3QkEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7Z0JBQ3RDQSxJQUFJQSxDQUFDQSxRQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDOUJBLElBQUlBLENBQUNBLFFBQVNBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUVERCx3QkFBS0EsR0FBTEEsVUFBTUEsS0FBYUEsRUFBRUEsU0FBaUJBLEVBQUVBLEtBQVVBO2dCQUM5Q0UsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ25CQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQTtnQkFDM0JBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUVuQkEsSUFBSUEsQ0FBQ0EsR0FBR0EsT0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxXQUFXQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQTtvQkFBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRW5EQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFFeEJBLElBQUlBLENBQUNBLFFBQVNBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUM3QkEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsQ0FBQ0E7Z0JBQ3RDQSxJQUFJQSxDQUFDQSxRQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDOUJBLElBQUlBLENBQUNBLFFBQVNBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO1lBQ3hDQSxDQUFDQTtZQUVERiwwQkFBT0EsR0FBUEE7Z0JBQ0lHLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUNqQkEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQzVCQSxJQUFJQSxDQUFDQSxRQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDakNBLElBQUlBLENBQUNBLFFBQVNBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO2dCQUM3QkEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBRXBDQSxHQUFHQSxDQUFDQSxDQUFVQSxVQUFjQSxFQUFkQSxTQUFJQSxDQUFDQSxTQUFTQSxFQUF2QkEsY0FBS0EsRUFBTEEsSUFBdUJBLENBQUNBO29CQUF4QkEsSUFBSUEsQ0FBQ0E7b0JBQW9CQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtpQkFBQUE7Z0JBQ3BEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDMUJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNoREEsUUFBUUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDaENBLENBQUNBO1lBRURILCtCQUFZQSxHQUFaQTtnQkFDSUksSUFBSUEsQ0FBQ0EsR0FBR0EsT0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxXQUFXQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQTtvQkFBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ25EQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNsQ0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFJTUoscUJBQVlBLEdBQW5CQSxVQUFvQkEsR0FBYUE7Z0JBQzdCSyxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLENBQUNBO1lBRU1MLG9CQUFXQSxHQUFsQkEsVUFBbUJBLEtBQWFBLEVBQUVBLFNBQWlCQSxFQUFFQSxLQUFVQTtnQkFDM0RNLElBQUlBLElBQUlBLEdBQWFBLElBQUlBLENBQUNBO2dCQUMxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDOUJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLEVBQUVBLFNBQVNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO29CQUNwQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ2hCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLE1BQU1BLENBQUNBLElBQUlBLFFBQVFBLENBQUNBLEtBQUtBLEVBQUVBLFNBQVNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUNqREEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFoQmNOLG9CQUFXQSxHQUFlQSxFQUFFQSxDQUFDQTtZQWlCaERBLGVBQUNBO1FBQURBLENBQUNBLElBQUFEO1FBMUVZQSxnQkFBUUEsV0EwRXBCQTtJQUNMQSxDQUFDQSxFQTVFU3ZELE9BQU9BLEdBQVBBLFVBQU9BLEtBQVBBLFVBQU9BLFFBNEVoQkE7QUFBREEsQ0FBQ0EsRUE1RU0sRUFBRSxLQUFGLEVBQUUsUUE0RVI7QUNsRkQsaUNBQWlDO0FBQ2pDLGdDQUFnQztBQUNoQyxtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUM5QyxvQ0FBb0M7Ozs7Ozs7Ozs7QUFHcEMsSUFBTyxFQUFFLENBNDNCUjtBQTUzQkQsV0FBTyxFQUFFLEVBQUMsQ0FBQztJQUNQQTtRQUdJK0QsNEJBQXNCQSxNQUFjQSxFQUFZQSxTQUFpQkEsRUFBRUEsS0FBS0E7WUFBbERDLFdBQU1BLEdBQU5BLE1BQU1BLENBQVFBO1lBQVlBLGNBQVNBLEdBQVRBLFNBQVNBLENBQVFBO1lBQzdEQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDakJBLENBQUNBO1FBRURELGtDQUFLQSxHQUFMQTtRQUVBRSxDQUFDQTtRQUVERixvQ0FBT0EsR0FBUEE7WUFDSUcsT0FBT0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDbkJBLE9BQU9BLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3ZCQSxDQUFDQTtRQUVTSCxvQ0FBT0EsR0FBakJBLFVBQWtCQSxLQUFLQSxFQUFFQSxTQUFVQTtRQUVuQ0ksQ0FBQ0E7UUFFREosc0JBQUlBLHFDQUFLQTtpQkFRVEE7Z0JBQ0lLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3ZCQSxDQUFDQTtpQkFWREwsVUFBVUEsS0FBS0E7Z0JBQ1hLLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUN4QkEsSUFBSUEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7b0JBQzVCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDcEJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUN4QkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7OztXQUFBTDtRQUtMQSx5QkFBQ0E7SUFBREEsQ0FBQ0EsSUFBQS9EO0lBaENZQSxxQkFBa0JBLHFCQWdDOUJBO0lBRURBLElBQWNBLGtCQUFrQkEsQ0FjL0JBO0lBZERBLFdBQWNBLGtCQUFrQkEsRUFBQ0EsQ0FBQ0E7UUFDOUIrRCxrQkFBeUJBLFFBQWdCQTtZQUNyQ00sTUFBTUEsQ0FBQ0EsVUFBK0NBLE1BQVNBO2dCQUMzRCxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBRTNDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxHQUFHLGFBQWEsR0FBRywwQkFBMEIsQ0FBQyxDQUFDO2dCQUNuRyxDQUFDO2dCQUVELGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDMUQsQ0FBQyxDQUFBQTtRQUNMQSxDQUFDQTtRQVZlTiwyQkFBUUEsV0FVdkJBO1FBRVlBLDZCQUFVQSxHQUFvQ0EsRUFBRUEsQ0FBQ0E7SUFDbEVBLENBQUNBLEVBZGEvRCxrQkFBa0JBLEdBQWxCQSxxQkFBa0JBLEtBQWxCQSxxQkFBa0JBLFFBYy9CQTtJQW9CREEsOEJBQThCQSxDQUFDQTtRQUMzQnNFLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLE9BQU9BLENBQUNBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxjQUFjQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUM1Q0EsQ0FBQ0E7SUFDTEEsQ0FBQ0E7SUFFRHRFLElBQUlBLGFBQWFBLEdBQXlCQSxFQUFFQSxDQUFDQTtJQUU3Q0EsSUFBSUEsVUFBVUEsR0FBR0EsV0FBV0EsQ0FBQ0E7SUFDN0JBLElBQUlBLFdBQVdBLEdBQUdBLE9BQU9BLENBQUNBO0lBRTFCQSxJQUFJQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQTtJQUU1QkEsSUFBSUEsYUFBYUEsR0FBR0EsaUNBQWlDQSxDQUFDQTtJQUV0REEsSUFBSUEsTUFBTUEsR0FBR0EsSUFBSUEsU0FBU0EsRUFBRUEsQ0FBQ0E7SUFDN0JBLElBQUlBLFFBQVFBLEVBQUVBLE9BQU9BLENBQUNBO0lBQ3RCQSxJQUFJQSxDQUFDQTtRQUNEQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUN6REEsT0FBT0EsR0FBR0EsUUFBUUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQTtJQUMzRUEsQ0FBRUE7SUFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFZkEsNkNBQTZDQTtJQUM3Q0EsbURBQW1EQTtJQUNuREEsb0JBQW9CQSxLQUEyQkE7UUFFM0N1RSxzQ0FBc0NBO1FBQ3RDQSxtQ0FBbUNBO1FBQ25DQSxJQUFJQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUN0Q0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDZkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hCQSxNQUFNQSxJQUFJQSxPQUFLQSxDQUFHQSxDQUFDQTtZQUN2QkEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDbEJBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1FBS1BBLDBDQUEwQ0E7UUFDMUNBLDJEQUEyREE7UUFDM0RBLElBQUlBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLEVBQUVBLFVBQVVBLENBQUNBLENBQUNBO1FBQ3JEQSxJQUFJQSxNQUFNQSxHQUFHQSxHQUFHQSxDQUFDQSxzQkFBc0JBLENBQUNBLE9BQU9BLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBO1FBQ2hFQSxJQUFJQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNmQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQkEsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLE1BQU1BLGtCQUFnQkEsS0FBS0EsVUFBS0EsTUFBUUEsQ0FBQ0E7UUFDN0NBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO0lBQ2ZBLENBQUNBO0lBRUR2RSxJQUFJQSxjQUFjQSxHQUFHQSwwQkFBMEJBLENBQUNBO0lBQ2hEQSxJQUFJQSxrQkFBa0JBLEdBQUdBLGdDQUFnQ0EsQ0FBQ0E7SUFHMURBOztNQUVFQTtJQUNGQSx3QkFBd0JBLFFBQVFBLEVBQUVBLFNBQVNBLEVBQUVBLFVBQXFCQSxFQUFFQSxNQUF1QkEsRUFBRUEsS0FBVUE7UUFDbkd3RSxJQUFJQSxLQUFLQSxDQUFDQTtRQUVWQSxpQkFBaUJBO1FBQ2pCQSw2Q0FBNkNBO1FBQzdDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxrQkFBa0JBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNGQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxVQUFVQSxFQUFFQSxVQUFTQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQTtRQUdEQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNGQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxjQUFjQSxFQUFFQSxVQUFTQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLEdBQUcsT0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNoRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLENBQUM7WUFDTCxDQUFDLENBQUNBLENBQUNBO1FBQ1BBLENBQUNBO0lBQ0xBLENBQUNBO0lBRUR4RSxJQUFJQSxTQUFTQSxHQUFRQSxDQUFDQSxvRkFBb0ZBO1FBQ3RHQSxxR0FBcUdBO1FBQ3JHQSx5R0FBeUdBO1FBQ3pHQSwwR0FBMEdBO1FBQzFHQSx1QkFBdUJBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ3hDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFDQSxJQUFJQSxnQkFBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsRUFBbkJBLENBQW1CQSxDQUFDQSxDQUFDQTtJQU01Q0E7O01BRUVBO0lBQ1NBLHVCQUFvQkEsR0FFM0JBLEVBQUVBLENBQUNBO0lBRVBBLHNCQUFzQkEsSUFBVUEsRUFBRUEsTUFBTUEsRUFBRUEsU0FBaUJBLEVBQUVBLEtBQUtBO1FBQzlEeUUsSUFBSUEsS0FBS0EsQ0FBQ0E7UUFFVkEsMEJBQTBCQTtRQUUxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLE1BQU1BLENBQU1BLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQzlEQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFFM0JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLE1BQU1BLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsTUFBTUEsQ0FBQ0E7WUFDWEEsQ0FBQ0E7WUFFREEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFFaENBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBO2dCQUNOQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUd0Q0EsbUNBQW1DQTtZQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxJQUFJQSxXQUFXQSxHQUFHQSxVQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxFQUFFQSxTQUFTQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFFeEVBLHlDQUF5Q0E7Z0JBQ3pDQSxrQkFBa0JBO2dCQUNsQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRXhDQSw2REFBNkRBO29CQUM3REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkZBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFVBQVVBLEVBQUVBLFVBQVNBLENBQUNBLEVBQUVBLENBQUNBOzRCQUN4RSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDVCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztvQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dDQUNuRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7b0NBQ3RDLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQzs0QkFDN0MsQ0FBQzt3QkFDTCxDQUFDLENBQUNBLENBQUNBLENBQUNBO29CQUNSQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLHFFQUFxRUE7d0JBQ3JFQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxFQUFFQSxDQUFDQSxjQUFjQSxFQUFFQSxVQUFTQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTs0QkFDN0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDdEMsSUFBSSxDQUFDLEdBQUcsT0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dDQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztvQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dDQUNuRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN4QyxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7Z0NBQ3pDLENBQUM7NEJBQ0wsQ0FBQzt3QkFDTCxDQUFDLENBQUNBLENBQUNBLENBQUNBO29CQUNSQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBRURBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO1lBQ3ZCQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxLQUFLQSxJQUFJQSxRQUFRQSxDQUFDQTtnQkFDekJBLE1BQU1BLENBQU1BLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBRS9DQSxNQUFNQSxDQUFNQSxLQUFLQSxDQUFDQTtRQUN0QkEsQ0FBQ0E7UUFFREEsSUFBSUEsVUFBeUJBLENBQUNBO1FBQzlCQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUN4Q0EsVUFBVUEsR0FBR0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBU0EsRUFBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFbEdBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2hCQSx5QkFBeUJBO1FBQ3pCQSxJQUFJQSxLQUFLQSxHQUFvQkEsRUFBRUEsQ0FBQ0E7UUFHaENBOzthQUVLQTtRQUNMQSxJQUFJQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUV4QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDbkRBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRTlCQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUU5QkEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFFckNBLFdBQVdBO1lBQ1hBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNSQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsREEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLENBQUNBLEtBQUtBLEtBQUtBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsT0FBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBRTNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO29CQUN4REEsQ0FBQ0E7b0JBRURBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNwQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBRXZDQSxLQUFLQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFTQSxLQUFLQSxFQUFF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QUFDO1FBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUM3QixNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEtBQUssSUFBSTtZQUNMLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLElBQUk7WUFDTCxNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELEtBQUssSUFBSSxDQUFDO1FBQ1YsS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLElBQUk7WUFDTCxNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELEtBQUssR0FBRyxDQUFDO1FBQ1QsS0FBSyxJQUFJO1lBQ0wsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxLQUFLLEdBQUcsQ0FBQztRQUNULEtBQUssSUFBSTtZQUNMLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsS0FBSyxJQUFJO1lBQ0wsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLE1BQU07WUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlDLENBQUM7SUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFJRCxJQUFVLEVBQUUsQ0FzeEJYO0FBdHhCRCxXQUFVLEVBQUU7SUFBQ0EsUUFBSUEsQ0FzeEJoQkE7SUF0eEJZQSxpQkFBSUEsRUFBQ0EsQ0FBQ0E7UUFFZnFJLElBQUlBLGFBQWFBLEdBQUdBLHlDQUF5Q0EsQ0FBQ0E7UUFFOURBLHFCQUErQkEsSUFBT0E7WUFHbENDLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsSUFBSUEsR0FBUUEsQ0FBQ0E7Z0JBRWJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLFlBQVlBLEtBQUtBLENBQUNBO29CQUN0QkEsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2JBLElBQUlBO29CQUNBQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFFYkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDN0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBOzRCQUNuRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzVCQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQy9GQSxJQUFJQSxDQUFDQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDMUJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQVFBLENBQUNBLENBQUNBO2dDQUNqQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2ZBLElBQUlBO2dDQUNBQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekJBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxD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QUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBRXRCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDcENBLElBQUlBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLEtBQUtBLEdBQUdBO3dCQUNKQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDZkEsS0FBS0EsQ0FBQ0E7b0JBQ1ZBLEtBQUtBLEdBQUdBO3dCQUNKQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDNUJBLEtBQUtBLENBQUNBO29CQUNWQSxLQUFLQSxHQUFHQTt3QkFDSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EscUJBQWNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBOzRCQUM3Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EscUJBQWNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO2dDQUFDQSxLQUFLQSxDQUFDQTt3QkFDdERBLENBQUNBO3dCQUNEQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDZEEsS0FBS0EsQ0FBQ0E7b0JBQ1ZBLEtBQUtBLEdBQUdBO3dCQUNKQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDbkJBLEtBQUtB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OUJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO3dCQUNYQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDWkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ1ZBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO29CQUNaQSxDQUFDQTtvQkFFREEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQy9CQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFFOUJBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO2dCQUMzRUEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLHlDQUF5Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVEQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDWEEsSUFB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LFVBQVVBLEVBQUVBLENBQUNBO1lBRWhDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDVEEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFFL0JBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNSQSxFQUFFQSxHQUFHQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUU3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ1RBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBRS9CQSxRQUFRQSxHQUFHQSxRQUFRQSxJQUFJQSxLQUFLQSxDQUFDQTtZQUU3QkEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsQ0FBQ0EsUUFBUUEsSUFBSUEsS0FBS0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDbEdBLENBQUNBO1FBMUJlWixlQUFRQSxXQTBCdkJBO1FBRURBLHVCQUE4QkEsUUFBUUEsRUFBRUEsUUFBUUE7WUFDNUNhLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLEtBQUtBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNqQ0EsUUFBUUEsR0FBR0EsUUFBUUEsSUFBSUEsS0FBS0EsQ0FBQ0E7WUFDN0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO1FBQzdFQSxDQUFD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Q3BCQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLHFIQUFxSEEsQ0FBQ0EsQ0FBQ0E7b0JBQ3JJQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDZEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBO2dCQUN0QkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7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QSxDQUFDQTtvQkFFbkJBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLE1BQU1BLEtBQUtBLFFBQVFBLElBQUlBLEVBQUVBLENBQUNBLE1BQU1BLElBQUlBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO3dCQUN2REEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBU0EsRUFBRUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25EQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsY0FBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsS0FBS0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JEQSxNQUFNQSxDQUFFQSxjQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFtQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQ2xEQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBVUEsRUFBRUEsQ0FBQ0EsTUFBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFNQSxjQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFPQSxjQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDOUZBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFL0JBLElBQUlBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLE1BQU1BLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO2dCQUU3Q0Es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LEdBQUdBLElBQUlBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO1lBQ3BCQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUN2QkEsT0FBT0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLENBQUNBO0lBQ0xBLENBQUNBO0lBTGVwTSxXQUFRQSxXQUt2QkE7SUFRREE7UUFDSXFNLElBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsR0FBR0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7UUFDaElBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsVUFBVUEsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7UUFDL0RBLElBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7UUFFNURBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLFNBQVNBLENBQUNBLE1BQU1BLElBQUlBLE9BQU9BLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLFFBQVFBLElBQUlBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBO1FBRW5JQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNiQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNiQSxDQUFDQTtRQUVEQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVsQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsTUFBTUEsR0FBR0EsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFOUJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcERBLEVBQUVBLENBQUNBLENBQU9BLEVBQUdBLENBQUNBLE1BQU1BLENBQUNBO29CQUFDQSxRQUFRQSxDQUFDQTtnQkFDL0JBLE1BQU1BLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDckNBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBO1lBRTFCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLElBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUVkQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsVUFBVUEsSUFBSUE7d0JBQy9CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztnQ0FDckIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO2dDQUMxQixTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQzt3QkFDdEMsQ0FBQzt3QkFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkJBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO3dCQUM1REEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBOzRCQUM1QkEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7d0JBQzVEQSxJQUFJQTs0QkFDQUEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3pFQSxDQUFDQTtvQkFFREEsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckNBLENBQUNBO1FBQ0xBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO1FBQ3JDQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUUxQkEsQ0FBQ0E7SUFsRWVyTSxTQUFNQSxTQWtFckJBO0lBQ0RBLE1BQU1BLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO0FBQ3BCQSxD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QSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbENBLE9BQU9BLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLEdBQUdBLFlBQVlBLEVBQUVBLENBQUNBO29CQUNyQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2ZBLENBQUNBO1lBQ0xBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxZQUFZQSxDQUFDQTtZQUNyQ0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDbEVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQUVEUDs7Ozs7VUFLREE7UUFDQ0Esd0JBQUdBLEdBQUhBLFVBQU9BLElBQW9CQSxFQUFFQSxLQUFXQTtZQUNwQ1EsSUFBSUEsS0FBS0EsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFFakNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLFVBQVVBLEVBQUtBLENBQUNBO1lBRS9CQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtnQkFDdENBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENB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QUNBLENBQUNBO2dCQUNwQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25DQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSwwQ0FBMENBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUM5RUEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JBQ2xCQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxrREFBa0RBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxSEEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JBQ2xCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVEQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUV2Q0EsSUFBSUEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1lBQ3BDQSxDQUFFQTtZQUFBQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVEEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSwwQ0FBMENBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUM5RUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZEEsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxlQUFlQSxFQUFFQSxNQUFNQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDL0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLEVBQUVBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLE1BQU1BLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO1lBQzlGQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFFRHRCOzs7O1VBSURBO1FBQ0NBLHdCQUFHQSxHQUFIQSxVQUFJQSxZQUFzQkE7WUFDdEJ1QixFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUMzQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXJCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO29CQUNwRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsRUFBRUEsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25HQSxDQUFDQTtnQkFDREEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDZkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBSUR2Qiw2QkFBUUEsR0FBUkEsVUFBU0EsS0FBMEJBLEVBQUVBLG1CQUE2QkEsRUFBRUEsWUFBc0JBO1lBQ3RGd0IsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBRXhCQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUVuQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFFMUJBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLFdBQVdBLEVBQUVBLEtBQUtBLGdCQUFnQkEsSUFBSUEsS0FBS0EsWUFBWUEsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFHQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxLQUFLQSxJQUFJQSxPQUFPQSxLQUFLQSxDQUFDQSxPQUFPQSxJQUFJQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0RBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO29CQUNoQkEsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBU0EsSUFBSUE7d0JBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7b0JBQ3pDLENBQUMsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7d0JBQ2pDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxtQkFBbUJBLENBQUNBLENBQUNBO2dCQUNqREEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUNBLElBQUlBLEtBQUtBLENBQUNBO29CQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsRUFBRUEsbUJBQW1CQSxDQUFDQSxDQUFDQTtZQUNqREEsQ0FBQ0E7WUFJREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLEVBQUVBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxFQUFFQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxvQkFBb0JBLEVBQUVBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0E7WUFDdElBLENBQUNBO1lBRURBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1lBRTNCQSxNQUFNQSxDQUFD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QUlBLElBQUlBLEdBQUdBLE9BQU9BLEVBQUVBLENBQUNBO1lBRXJCQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeEJBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUVkQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxJQUFJQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDL0NBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUNuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsS0FBS0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDWEEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBT0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDYkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsUUFBUUEsSUFBSUEsSUFBSUEsSUFBSUEsUUFBUUEs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QUFHQSxJQUFJQSxHQUFHQSxDQUFDQSxLQUFlQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7d0JBQ2hFQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtvQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQWVBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoRUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUdKQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtvQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUtBLEtBQWFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMvQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQUVEcEM7Ozs7VUFJREE7UUFDQ0EsNkJBQVFBLEdBQVJBLFVBQVNBLElBQU9BO1lBQ1pxQyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMxQ0EsQ0FBQ0E7UUFFRHJDOzs7O1VBSURBO1FBQ0NBLGdDQUFXQSxHQUFYQSxVQUFZQSxHQUFXQTtZQUNuQnNDLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFDcENBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxNQUFNQSwyQkFBMkJBLENBQUNBO1lBQ3RDQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUVEdEM7Ozs7VUFJREE7UUFDQ0EsNEJBQU9BLEdBQVBBLFVBQVFBLElBQU9BLElBQVl1QyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU3RHZDOzs7O1VBSURBO1FBQ0NBLGdDQUFXQSxHQUFYQSxVQUFZQSxJQUFPQSxJQUFZd0MsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckV4Qzs7O1VBR0RBO1FBQ0NBLDRCQUFPQSxHQUFQQTtZQUNJeUMsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFFWEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7Z0JBQ3RDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUvQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDYkEsQ0FBQ0E7UUFFRHpDOzs7VUFHREE7UUFDQ0EsMEJBQUtBLEdBQUxBO1lBQ0kwQyxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFJQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUzREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7Z0JBQ3RDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVsREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBRUQxQzs7OztVQUlEQTtRQUNDQSwrQkFBVUEsR0FBVkEsVUFBV0EsR0FBb0JBO1lBQzNCMkMsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtvQkFDdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hEQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxD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QUVBO2FBQ2RBLENBQUNBO1lBQ0ZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsSUFBSUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRWRBLHVDQUF1Q0E7Z0JBQ3ZDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDdEJBLElBQUlBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9CQSxNQUFNQSxJQUFJQSxTQUFTQSxDQUFDQSwyQ0FBMkNBLENBQUNBLENBQUNBO29CQUNyRUEsQ0FBQ0E7b0JBRURBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUUzREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDZkEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ2xDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDN0JBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsSUFB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Q0EsZUFBZUEsRUFBRUEsQ0FBQ0E7Z0JBRS9DQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFaENBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQTt3QkFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO2dCQUN2RUEsQ0FBQ0E7Z0JBQUNBLElBQUlBO29CQUNGQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7WUFDM0RBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2xCQSxDQUFDQTtRQUVESCwrQkFBTUEsR0FBTkE7WUFDSUksSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFFOUJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNSQSxJQUFJQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFFZkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7b0JBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtB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LElBQUlBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLE1BQU1BLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLFNBQVNBLENBQUNBLENBQUNBO29CQUNsRUEsS0FBSUEsQ0FBQ0EsTUFBNkJBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBO1lBQzNEQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNQQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxFQUFFQSxJQUFJQSxPQUFPQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxFQUFFQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0SUEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0E7Z0JBQ2xCQSxJQUFJQSxTQUFTQSxHQUFHQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLEtBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNuQ0EsS0FBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsU0FBU0EsQ0FBQ0E7WUFDMUNBLENBQUNBLENBQUNBO1lBRUZBLHNCQUFzQkE7WUFDdEJBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsY0FBY0EsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFFOUZBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FB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LENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsZUFBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3BDQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFFL0NBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBOzRCQUNmQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTt3QkFDL0RBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdEJBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBOzRCQUNmQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTs0QkFDeERBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLFFBQVFBLElBQVVBLEdBQUlBLFlBQVlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dDQUN6REEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3RCQSxDQUFDQTt3QkFDTEEsQ0FBQ0E7d0JBQUNBLElBQUlBOzRCQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDMUJBLENBQUNBO2dCQUNMQSxDQUFD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
