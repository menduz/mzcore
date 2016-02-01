/// <reference path="TSD/JQuery.d.ts" />
/// <reference path="TSD/Promise.d.ts" />
if (typeof this.jQuery === "undefined") {
    throw new Error("jQuery not present");
}
function isDef(b) {
    return typeof b != "undefined";
}
;
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
    console.log('MZCORE: /--==<{[One Script To Rule Them All ಠ_ಠ]}>==--/');
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
                        if (/( ASC)$|( DESC)$/.test(t)) {
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
    var ñ_privada = function ñ(claveIdioma, defaultValue) {
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
    ñ_privada.faltantes = erroresEncontradosIdioma;
    ñ_privada.idioma = idioma;
    mz.ñ = mz.globalContext.ñ = ñ_privada;
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
        date_1.dayNames = mz.ñ('#dayNames', 'Domingo|Lunes|Martes|Miercoles|Jueves|Viernes|Sabado').split('|');
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
        date_1.abbrDayNames = mz.ñ('#abbrDayNames', 'Dom|Lun|Mar|Mie|Jue|Vie|Sab').split('|');
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
        date_1.monthNames = mz.ñ('#monthNames', 'Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre').split('|');
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
        date_1.abbrMonthNames = mz.ñ('#abbrMonthNames', 'Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic').split('|');
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
        date_1.format = mz.ñ('#DateFormat', 'dd/mm/yyyy');
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
            xhr.open(opts.method, opts.params ? '' + opts.url.split('?')[0] + '?' + getParams(opts.params) : opts.url, true);
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
                    mz.WebMethods.trigger(xhr.status, resultado);
                    mz.WebMethods.trigger(originalURL, resultado.data);
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
                try {
                    x = xhr.responseJSON || JSON.parse(x);
                    if ('d' in x)
                        x = x.d;
                    x = mz.json.leer_dates(x);
                }
                catch (e) { }
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
                var archivo = mz.require.route(elem);
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
        if ('scriptBase' in mz) {
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
            var bkñ = mz.globalContext.ñ;
            try {
                mz.globalContext.define = module.define.bind(module);
                mz.globalContext.exports = module.exports;
                mz.globalContext.require = module.require.bind(module);
                mz.globalContext.module = module;
                mz.globalContext.ñ = module.ñ.bind(module);
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
                mz.globalContext.ñ = bkñ;
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
                        return rt.destination;
                    }
                    else if (rt.source.test(source)) {
                        return source.replace(require.routes[i].source, require.routes[i].destination);
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
            return null;
        }
        require.route = route;
        route('http://*', 'http://$1');
        route('https://*', 'https://$1');
        route('/*.js', '/$1.js');
        route('mz.plugin.*.*\@latest', './plugins/$1/$1.$2.js');
        route(/mz\.plugin\.([\w-]+)\.([\w-]+)\@([\w\.]+)$/, './plugins/$1/$3/$1.$2.js');
        route('mz.plugin.*.*', './plugins/$1/$1.$2.js');
        route('mz.plugin.*\@latest', './plugins/$1/$1.js');
        route(/mz\.plugin\.([\w-]+)\@([\w\.]+)$/, './plugins/$1/$2/$1.js');
        route('mz.plugin.*', './plugins/$1/$1.js');
        route('mzcore.*', './mzcore.$1.js');
        function defineFiles(files) {
            for (var i in files) {
                mz.hardCodedFiles[i.toLowerCase()] = files[i];
            }
        }
        require.defineFiles = defineFiles;
    })(require = mz.require || (mz.require = {}));
})(mz || (mz = {}));
mz.require.route("jquery", "@mz/jquery.js");
mz.require.route("backbone", "@mz/backbone.js");
mz.require.route("underscore", "@mz/underscore.js");
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
        Module.prototype.ñ = function (a, b) {
            return mz.ñ(a, b, this.id);
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
                var bkñ = mz.globalContext.ñ;
                try {
                    mz.globalContext.define = this.module.define.bind(this.module);
                    mz.globalContext.exports = this.module.exports;
                    mz.globalContext.require = this.module.require.bind(this.module);
                    mz.globalContext.module = this.module;
                    mz.globalContext.ñ = this.module.ñ.bind(this.module);
                    mz.globalContext.define.amd = bkDefine.amd;
                    result = factory.apply(this.module.exports, params);
                }
                finally {
                    mz.globalContext.define = bkDefine;
                    mz.globalContext.exports = bkExports;
                    mz.globalContext.require = bkRequire;
                    mz.globalContext.module = bkModulo;
                    mz.globalContext.ñ = bkñ;
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
/// <reference path="MVCObject.ts" />
/// <reference path="../mz.ts" />
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
    var collection = (function (_super) {
        __extends(collection, _super);
        function collection(base, opc) {
            _super.call(this);
            this.opciones = {};
            this.__indice__ = {};
            this.agregandoLote = false;
            this.insert = this.push;
            this.opciones = opc || {};
            this.array = (this.opciones.initialSize ? new Array(this.opciones.initialSize) : new Array());
            base && this.addRange(base);
        }
        collection.prototype.first = function () {
            return this.array[0];
        };
        collection.prototype.last = function () {
            if (this.array.length)
                return this.array[this.array.length - 1];
        };
        /**
        Limpia la coleccion
        @method clear
        @param {Boolean} noTriggerear si es "true" entonces no se desencadena ningun evento del tipo "changed"
        */
        collection.prototype.clear = function (noTriggerear) {
            this.trigger(collection.EVENTS.BeforeClearCollection, !!noTriggerear);
            this.array.length = 0;
            this.__indice__ = {};
            this.trigger(collection.EVENTS.AfterClearCollection, !!noTriggerear);
            !noTriggerear && this.emit(collection.EVENTS.Changed, 'clear', !!noTriggerear);
        };
        Object.defineProperty(collection.prototype, "length", {
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
        collection.prototype.getLength = function () {
            return this.array.length;
        };
        collection.prototype.setLength = function (nuevoTamanio) {
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
            this.emit(collection.EVENTS.Changed, 'length', this.array.length);
            return this;
        };
        /**
        The map() method creates a new array with the results of calling a provided function on every element in this array.
        El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
        @method map
        @param {Function} callback función que se va a ejecutar, a esta function se le pasa 1 argumento, el elemento de la coleccion que se esta iterando
        */
        collection.prototype.map = function (func, thisp) {
            var thisp = arguments[1] || this;
            var coll = new mz.collection();
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
        collection.prototype.forEach = function (func, thisp) {
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
        collection.prototype.asyncForEach = function (func, iterationDurationMs) {
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
        collection.prototype._indizar = function (elem, index) {
            if (this.opciones.key) {
                if (!(this.opciones.key in elem))
                    throw "No tiene la clave primaria";
                if (typeof elem[this.opciones.key] != 'undefined') {
                    this.__indice__[elem[this.opciones.key]] = index;
                }
            }
        };
        collection.prototype._deindizar = function (elem) {
            if (this.opciones.key) {
                if (typeof elem[this.opciones.key] != 'undefined') {
                    if (elem[this.opciones.key] in this.__indice__) {
                        delete this.__indice__[elem[this.opciones.key]];
                    }
                }
            }
        };
        collection.prototype._reindizar = function () {
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
        collection.prototype.getAt = function (index) {
            return this.array[index];
        };
        collection.prototype.reduce = function (fn, initialValue) {
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
        collection.prototype.groupBy = function (what) {
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
                        output[g] = new mz.collection([e], this.opciones);
                    }
                }
            });
            return output;
        };
        Object.defineProperty(collection.prototype, "key", {
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
        collection.prototype.insertAt = function (indice, elemento) {
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
                this.emit(collection.EVENTS.CollectionSorted);
                this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted);
            }
            this.emit(collection.EVENTS.ElementInserted, indice, elemento);
            this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementInserted, indice, elemento);
        };
        /**
        Remueve un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "remove_at"
        @method removeAt
        @param {Number} indice
        @param {Mixed} elemento
        */
        collection.prototype.removeAt = function (indice) {
            var backup = this.array[indice];
            this.array.splice(indice, 1);
            this._reindizar();
            this.emit(collection.EVENTS.ElementRemoved, indice, backup);
            this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementRemoved, indice, backup);
            return backup;
        };
        /**
        Cambia un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "set_at"
        @method set_at
        @param {Number} indice
        @param {Mixed} elemento
        */
        collection.prototype.setAt = function (indice, elemento) {
            var backup = this.array[indice];
            this._deindizar(backup);
            this.array[indice] = elemento;
            this._indizar(elemento, indice);
            this.emit(collection.EVENTS.ElementChanged, indice, elemento, backup);
            this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementChanged, indice, elemento, backup);
        };
        /**
        Inserta un elemento al final de la colección. Dispara evento "insert_at" y "changed" con los mismos argumentos
        @method push
        @param {Mixed} elemento
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        collection.prototype.push = function (elemento, noTriggerear) {
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
                this.emit(collection.EVENTS.ElementInserted, indice, elemento);
                this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementInserted, indice, elemento);
            }
            return indice;
        };
        /**
        Quita el elemento al final de la colección. Dispara evento "remove_at" y "changed" con los mismos argumentos
        @method pop
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        collection.prototype.pop = function (noTriggerear) {
            if (this.array.length > 0) {
                var ret = this.array.pop();
                this._deindizar(ret);
                if (!noTriggerear) {
                    this.emit(collection.EVENTS.ElementRemoved, this.array.length, ret);
                    this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementRemoved, this.array.length, ret);
                }
                return ret;
            }
            return null;
        };
        collection.prototype.addRange = function (array, noTriggerearCadaUno, noTriggerear) {
            if (!array)
                return this;
            var inicio = this.array.length - 1;
            this.agregandoLote = true;
            if (Object.prototype.toString.call(array).toLowerCase() === "[object array]" || array instanceof mz.collection) {
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
                this.emit(collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
                this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
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
        collection.prototype.update = function (elemento) {
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
        collection.prototype.updateByKey = function (key) {
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
        collection.prototype.updateIndex = function (index) {
            if (index != -1) {
                var elemento = this.getAt(index);
                this.emit(collection.EVENTS.ElementChanged, index, elemento, elemento);
                this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementChanged, index, elemento, elemento);
            }
            return this;
        };
        collection.prototype.join = function (delimitador) {
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
        collection.prototype.sum = function (options) {
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
        collection.prototype.orderBy = function (what) {
            var orderBy = what ? mz.data.order.build(what) : undefined;
            this.array.sort(orderBy);
            this._reindizar();
            this.emit(collection.EVENTS.CollectionSorted, what, 'ASC');
            this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted, what);
            return this;
        };
        collection.prototype.orderByDesc = function (what) {
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
            this.emit(collection.EVENTS.CollectionSorted, what, 'DESC');
            this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted, what);
            return this;
        };
        /**
        Devuelve true si hay algun elemento que cumpla con la condición
        @method some
        @param {Function} condicion
        */
        collection.prototype.some = function (condition) {
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
         *	Y va a devolver una colección con totos los elementos de la primera que tengan Campo == 3
         *	@method where
         *	@param {Function|MzDelegate} condicion
         */
        collection.prototype.where = function (campoOCondicion, valorCampo) {
            if (typeof campoOCondicion === "string") {
                var arr = new collection();
                for (var i = 0; i < this.array.length; i++)
                    if ((i in this.array) && this.array[i][campoOCondicion] == arguments[1])
                        arr.push(this.array[i]);
                return arr;
            }
            else {
                if (this.array.length >= 10000) {
                    var fn = mz.compileFilter(campoOCondicion);
                    return new mz.collection(fn(this.array));
                }
                if (this.array.filter)
                    return new collection(this.array.filter(campoOCondicion));
                var arr = new collection();
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
        collection.prototype.removeByKey = function (key) {
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
        collection.prototype.remove = function (condicion) {
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
                    this.emit(collection.EVENTS.ElementRangeRemoved, salida);
                    this.emit(collection.EVENTS.Changed, collection.EVENTS.ElementRangeRemoved, salida);
                }
                return salida;
            }
        };
        collection.prototype.single = function (field, value) {
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
        collection.prototype.contains = function (elem) {
            return this.array.indexOf(elem) != -1;
        };
        /**
        Devuelve true si la coleccion contiene la clave
        @method containsKey
        @param {String} key
        */
        collection.prototype.containsKey = function (key) {
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
        collection.prototype.indexOf = function (elem) { return this.array.indexOf(elem); };
        /**
        Devuelve el indice de la última ocurrencia del elemento. Si no lo encuentra devuelve -1
        @method lastIndexOf
        @param {Object} elemento
        */
        collection.prototype.lastIndexOf = function (elem) { return this.array.lastIndexOf(elem); };
        /**
        Crea un array y lo llena con el contenido de la colección
        @method toArray
        */
        collection.prototype.toArray = function () {
            var t = [];
            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && t.push(this.array[i]);
            return t;
        };
        /**
        Clona la colección. Las referencias a los objetos van a ser las mismas.
        @method clone
        */
        collection.prototype.clone = function () {
            var coll = new collection(null, mz.copy(this.opciones));
            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && coll.push(this.array[i]);
            return coll;
        };
        /**
        Obtiene un elemento buscando en el indice interno por clave primaria
        @method indexedGet
        @param {String} key
        */
        collection.prototype.indexedGet = function (key) {
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
        collection.prototype.indexedGetIndex = function (key) {
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
        collection.prototype.mergeElem = function (elem) {
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
        collection.prototype.max = function (opc) {
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
        collection.prototype.min = function (opc) {
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
        collection.prototype.avg = function (opc) {
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
        collection.prototype.take = function (cantidad, from) {
            if (from === void 0) { from = 0; }
            var ret = [];
            this.takeInto(ret, cantidad, from);
            return ret;
        };
        collection.prototype.takeInto = function (destino, cantidad, from) {
            if (from === void 0) { from = 0; }
            var hasta = Math.min(this.array.length + cantidad, this.array.length);
            from = mz.intval(from);
            var outer_i = 0;
            for (var i = from; i < hasta; i++)
                destino.push(this.array[i]);
            return this;
        };
        collection.prototype.swapItems = function (primero, segundo) {
            var viejo = this.array[segundo];
            this.array[segundo] = this.array[primero];
            this.array[primero] = viejo;
            this._reindizar();
            this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted);
            this.emit(collection.EVENTS.Changed, 'swap', primero, segundo);
            return this;
        };
        collection.prototype.count = function (groupBy) {
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
        collection.prototype.reverse = function () {
            this.array.reverse();
            this.emit(collection.EVENTS.CollectionSorted);
            this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted);
        };
        /**
         * Mergea una colección contra un array o colección. cuando eliminarNoMatcheados == true, Hace una intersección
         * - Merged = (Original ∈ New) + (New ∉ Original)
         * En todos los casos se va a llamar un evento changed del tipo insert_at, set_at o remove_at dependiendo de la operación.
         */
        collection.prototype.mergeArray = function (array, eliminarNoMatcheados) {
            var ret = {
                added: [],
                removed: []
            };
            if (this.opciones.key) {
                var keys = {};
                var that = this;
                array.forEach(function (elem, index) {
                    if (!(that.opciones.key in elem)) {
                        throw new TypeError("El elemento no contiene la clave primaria");
                    }
                    var indice = that.indexedGetIndex(elem[that.opciones.key]);
                    keys[elem[that.opciones.key]] = true;
                    if (indice != -1) {
                        mz.copy(that.array[indice], elem);
                        that.updateIndex(indice);
                    }
                    else {
                        that.push(elem);
                        ret.added.push(elem);
                    }
                });
                if (eliminarNoMatcheados) {
                    ret.removed = that.remove(function (elem) {
                        return !(elem[that.opciones.key] in keys);
                    });
                }
            }
            else
                console.error("You cannot mergeArray if the collection does not have 'key'");
            return ret;
        };
        collection.prototype.createView = function () {
            return new collectionView(this, mz.copy(this.opciones));
        };
        /**
         * Usar con cuidado.
         */
        collection.prototype.getPrivateArray = function () { return this.array; };
        collection.EVENTS = mz.copy({
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
        ], collection.prototype, "agregandoLote", void 0);
        return collection;
    })(mz.MVCObject);
    mz.collection = collection;
    var collectionView = (function (_super) {
        __extends(collectionView, _super);
        function collectionView(base, opc) {
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
        collectionView.prototype._handleChanged = function (tipo, nuevo, viejo) {
            var necesitoReOrdenar = tipo == 'order' || tipo == collection.EVENTS.CollectionSorted || tipo == 'insert_at' || tipo == 'set_at' || tipo == 'addRange';
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
        collectionView.prototype._remake = function (noTriggerear) {
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
        collectionView.prototype.resort = function () {
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
                        this.emit(collection.EVENTS.CollectionSorted, orden.q, orden.desc ? 'DESC' : 'ASC');
                        this.emit(collection.EVENTS.Changed, collection.EVENTS.CollectionSorted, orden.q);
                        break;
                    }
                }
            }
        };
        collectionView.prototype.refresh = function () {
            this._remake();
        };
        collectionView.prototype.filter = function (filter) {
            this.set('filter', filter);
            return this;
        };
        collectionView.prototype.orderBy = function (q) {
            this.set('order', {
                q: q,
                desc: false
            });
            return this;
        };
        collectionView.prototype.orderByDesc = function (q) {
            this.set('order', {
                q: q,
                desc: true
            });
            return this;
        };
        collectionView.prototype.attachTo = function (obj) {
            this.detach();
            this.set('bindeosParent', []);
            this.set('parent', obj);
            if (obj) {
                var that = this;
                this.get('bindeosParent').push(obj.on('clear', function (noPropagado) {
                    if (noPropagado) {
                        that.clear(noPropagado);
                    }
                }));
                this.get('bindeosParent').push(obj.on('pre_clear', function (noPropagado) {
                    that.trigger('pre_clear', noPropagado);
                }));
                this.get('bindeosParent').push(obj.on('changed', function (tipo, a1, a2) {
                    if ((tipo == 'insert_at' || tipo == 'set_at') && obj.get('agregandoLote'))
                        return;
                    var filter = that.get('filter');
                    if (tipo == 'insert_at' || tipo == 'set_at' || tipo == 'remove_at') {
                        var indice = that.indexOf(a2);
                        if (!filter || filter(a2)) {
                            switch (tipo) {
                                case 'insert_at':
                                    if (indice == -1) {
                                        that.push(a2);
                                        that.resort();
                                    }
                                    return;
                                case 'set_at':
                                    if (indice != -1) {
                                        that.updateIndex(indice);
                                    }
                                    else {
                                        that.push(a2);
                                    }
                                    that.resort();
                                    return;
                                case 'remove_at':
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
        collectionView.prototype.detach = function () {
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
        return collectionView;
    })(collection);
    mz.collectionView = collectionView;
})(mz || (mz = {}));
var mz;
(function (mz) {
    var core;
    (function (core) {
        var dom;
        (function (dom) {
            function setRootDomAdapter(theAdapter) {
                if (!dom.adapter) {
                    dom.adapter = theAdapter;
                }
            }
            dom.setRootDomAdapter = setRootDomAdapter;
            function setRootDomParser(theParser) {
                if (!dom.parser) {
                    dom.parser = theParser;
                }
            }
            dom.setRootDomParser = setRootDomParser;
        })(dom = core.dom || (core.dom = {}));
    })(core = mz.core || (mz.core = {}));
})(mz || (mz = {}));
/// <reference path="../../mz.ts" />
/// <reference path="../DOM.ts" />
var mz;
(function (mz) {
    var core;
    (function (core) {
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
        })(dom = core.dom || (core.dom = {}));
    })(core = mz.core || (mz.core = {}));
})(mz || (mz = {}));
/// <reference path="../../mz.ts" />
/// <reference path="../DOM.ts" />
var mz;
(function (mz) {
    var core;
    (function (core) {
        var dom;
        (function (dom) {
            (function (AstTypes) {
                AstTypes[AstTypes["root"] = 0] = "root";
                AstTypes[AstTypes["directive"] = 1] = "directive";
                AstTypes[AstTypes["element"] = 2] = "element";
                AstTypes[AstTypes["text"] = 3] = "text";
                AstTypes[AstTypes["comment"] = 4] = "comment";
            })(dom.AstTypes || (dom.AstTypes = {}));
            var AstTypes = dom.AstTypes;
            var AstElement = (function () {
                function AstElement() {
                    this.children = [];
                    this.attrs = {};
                }
                return AstElement;
            })();
            dom.AstElement = AstElement;
            var AbstractDomParser = (function () {
                function AbstractDomParser() {
                }
                return AbstractDomParser;
            })();
            dom.AbstractDomParser = AbstractDomParser;
        })(dom = core.dom || (core.dom = {}));
    })(core = mz.core || (mz.core = {}));
})(mz || (mz = {}));
/// <reference path="DOMParser.ts" />
/*
 * HTML5 Parser By Sam Blowes
 *
 * Designed for HTML5 documents
 *
 * Original code by John Resig (ejohn.org)
 * http://ejohn.org/blog/pure-javascript-html-parser/
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * ----------------------------------------------------------------------------
 * License
 * ----------------------------------------------------------------------------
 *
 * This code is triple licensed using Apache Software License 2.0,
 * Mozilla Public License or GNU Public License
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * The Original Code is Simple HTML Parser.
 *
 * The Initial Developer of the Original Code is Erik Arvidsson.
 * Portions created by Erik Arvidssson are Copyright (C) 2004. All Rights
 * Reserved.
 *
 * ////////////////////////////////////////////////////////////////////////////
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * ----------------------------------------------------------------------------
 * Usage
 * ----------------------------------------------------------------------------
 *
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */
var mz;
(function (mz) {
    var core;
    (function (core) {
        var dom;
        (function (dom) {
            // Regular Expressions for parsing tags and attributes
            var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
            // Empty Elements - HTML 5
            var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");
            // Block Elements - HTML 5
            var block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");
            // Inline Elements - HTML 5
            var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");
            // Elements that you can, intentionally, leave open
            // (and which close themselves)
            var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
            // Attributes that have their values filled in disabled="disabled"
            var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
            // Special Elements (can contain anything)
            var special = makeMap("script,style");
            var HTMLParser = function (html, handler) {
                var index, chars, match, stack = [], last = html;
                stack.last = function () {
                    return this[this.length - 1];
                };
                while (html) {
                    chars = true;
                    // Make sure we're not in a script or style element
                    if (!stack.last() || !special[stack.last()]) {
                        // Comment
                        if (html.indexOf("<!--") == 0) {
                            index = html.indexOf("-->");
                            if (index >= 0) {
                                if (handler.comment)
                                    handler.comment(html.substring(4, index));
                                html = html.substring(index + 3);
                                chars = false;
                            }
                        }
                        else if (html.indexOf("</") == 0) {
                            match = html.match(endTag);
                            if (match) {
                                html = html.substring(match[0].length);
                                match[0].replace(endTag, parseEndTag);
                                chars = false;
                            }
                        }
                        else if (html.indexOf("<") == 0) {
                            match = html.match(startTag);
                            if (match) {
                                html = html.substring(match[0].length);
                                match[0].replace(startTag, parseStartTag);
                                chars = false;
                            }
                        }
                        if (chars) {
                            index = html.indexOf("<");
                            var text = index < 0 ? html : html.substring(0, index);
                            html = index < 0 ? "" : html.substring(index);
                            if (handler.chars)
                                handler.chars(text);
                        }
                    }
                    else {
                        html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {
                            text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
                            if (handler.chars)
                                handler.chars(text);
                            return "";
                        });
                        parseEndTag("", stack.last());
                    }
                    if (html == last)
                        throw "Parse Error: " + html;
                    last = html;
                }
                // Clean up any remaining tags
                parseEndTag();
                function parseStartTag(tag, tagName, rest, unary) {
                    tagName = tagName.toLowerCase();
                    if (block[tagName]) {
                        while (stack.last() && inline[stack.last()]) {
                            parseEndTag("", stack.last());
                        }
                    }
                    if (closeSelf[tagName] && stack.last() == tagName) {
                        parseEndTag("", tagName);
                    }
                    unary = empty[tagName] || !!unary;
                    if (!unary)
                        stack.push(tagName);
                    if (handler.start) {
                        var attrs = [];
                        rest.replace(attr, function (match, name) {
                            var value = arguments[2] ? arguments[2] :
                                arguments[3] ? arguments[3] :
                                    arguments[4] ? arguments[4] :
                                        fillAttrs[name] ? name : "";
                            attrs.push({
                                name: name,
                                value: value,
                                escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                            });
                        });
                        if (handler.start)
                            handler.start(tagName, attrs, unary);
                    }
                }
                function parseEndTag(tag, tagName) {
                    // If no tag name is provided, clean shop
                    if (!tagName)
                        var pos = 0;
                    else
                        for (var pos = stack.length - 1; pos >= 0; pos--)
                            if (stack[pos] == tagName)
                                break;
                    if (pos >= 0) {
                        // Close all the open elements, up the stack
                        for (var i = stack.length - 1; i >= pos; i--)
                            if (handler.end)
                                handler.end(stack[i]);
                        // Remove the open elements from the stack
                        stack.length = pos;
                    }
                }
            };
            function makeMap(str) {
                var obj = {}, items = str.split(",");
                for (var i = 0; i < items.length; i++)
                    obj[items[i]] = true;
                return obj;
            }
            var HtmlParser = (function (_super) {
                __extends(HtmlParser, _super);
                function HtmlParser() {
                    _super.apply(this, arguments);
                }
                HtmlParser.prototype.parse = function (html) {
                    // If we're working with a document, inject contents into
                    // the body element
                    var ret = new dom.AstElement();
                    ret.type = dom.AstTypes.root;
                    var elems = [ret];
                    var curParentNode = ret;
                    HTMLParser(html, {
                        start: function (tagName, attrs, unary) {
                            var elem = new dom.AstElement();
                            elem.type = dom.AstTypes.element;
                            elem.name = tagName;
                            elem.attrs = attrs;
                            if (curParentNode)
                                curParentNode.children.push(elem);
                            if (!unary) {
                                elems.push(elem);
                                curParentNode = elem;
                            }
                        },
                        end: function (tag) {
                            // Init the new parentNode
                            curParentNode = elems[elems.length - 1];
                        },
                        chars: function (text) {
                            var elem = new dom.AstElement();
                            elem.type = dom.AstTypes.text;
                            elem.data = text;
                            if (curParentNode)
                                curParentNode.children.push(elem);
                        },
                        comment: function (text) {
                            var elem = new dom.AstElement();
                            elem.type = dom.AstTypes.comment;
                            elem.data = text;
                            if (curParentNode)
                                curParentNode.children.push(elem);
                        }
                    });
                    return ret;
                };
                return HtmlParser;
            })(dom.AbstractDomParser);
            dom.HtmlParser = HtmlParser;
        })(dom = core.dom || (core.dom = {}));
    })(core = mz.core || (mz.core = {}));
})(mz || (mz = {}));
/// <reference path="DOM.ts" />
var mz;
(function (mz) {
    var core;
    (function (core) {
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
        })(dom = core.dom || (core.dom = {}));
    })(core = mz.core || (mz.core = {}));
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
            var b = mz.require("backbone");
            mz.route = mz.route = new (b.Router.extend(options))();
            b.history.start();
            mz.route.start = function (a, b) {
                b && b(mz.route);
            };
            console.log("Backbone loaded! Route started!", mz.route);
            cb && cb(mz.route);
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
                this.node = document.createTextNode(t);
                this.node.$tmpl = value;
                this.node.$component = component;
                this.node.$scope = scope;
                this.node.$widget = this;
            }
            TextNode.prototype.setup = function (value, component, scope) {
                this.value = value;
                this.component = component;
                this.scope = scope;
                var t = mz.view.tmpl(value, component, scope);
                if (typeof t === "undefined" || t === null)
                    t = '';
                this.node.textContent = t;
                this.node.$tmpl = value;
                this.node.$component = component;
                this.node.$scope = scope;
                this.node.$widget = this;
            };
            TextNode.prototype.unmount = function () {
                this.node.remove();
                this.node.$tmpl = null;
                this.node.$component = null;
                this.node.$scope = null;
                this.node.$widget = null;
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
                if (this.node.textContent != t) {
                    this.node.textContent = t;
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
var mz;
(function (mz) {
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
    /**
    * Esta función es usada para bindear un atributo a los cambios de MVCObject que pueden llegar a modificar el valor del atributo
    */
    function bindWidgetAttr(attrName, attrValue, observable, widget, scope) {
        var match;
        // attr="{hola}" 
        // mando directamente Val(hola) a el atributo
        if (match = lonelyProperty.exec(attrValue)) {
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
    * Cacheo en memoria de los templates descargados
    */
    mz.widgetTemplateSource = {};
    function domToWidgets(node, params, component, scope) {
        var match;
        // text node, comment, etc
        if (node.nodeValue) {
            var value = node.nodeValue;
            if (value.trim().length === 0) {
                return;
            }
            match = value.match(paramRegex);
            if (match)
                return params[parseInt(match[1])];
            if (tieneLlaves.test(value)) {
                var childWidget = widgets.TextNode.getFromPoll(value, component, scope);
                // Si el valor del text se no mete en el scope directamente "{scope.hola}"
                if (component && !(testScope.test(value))) {
                    if (match = lonelyProperty.exec(value)) {
                        childWidget.listening.push(component.on(match[1] + '_changed', function (a, b) {
                            if (a != b) {
                                if (typeof a === "undefined" || a === null)
                                    a = '';
                                if (childWidget.node.textContent != a)
                                    childWidget.node.textContent = a;
                            }
                        }));
                    }
                    else {
                        childWidget.listening.push(component.on('valueChanged', function (data, elem, a, b) {
                            if (a != b && value.indexOf(elem) != -1) {
                                var t = mz.view.tmpl(value, component, scope);
                                if (typeof t === "undefined" || t === null)
                                    t = '';
                                if (childWidget.node.textContent != t) {
                                    childWidget.node.textContent = t;
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
                        attrs[attr.name] = attrs[attr.name].bind(component); //testScope.test(attr.value) ? scope : component);
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
        widgetCtor = widgetCtor || widgets.BaseElement;
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
        function Widget(rootNode, attr, children, _params, _parentComponent, scope) {
            if (_params === void 0) { _params = null; }
            if (_parentComponent === void 0) { _parentComponent = null; }
            if (scope === void 0) { scope = null; }
            _super.call(this);
            this._params = _params;
            this._parentComponent = _parentComponent;
            this.attrs = {};
            this.listening = [];
            this.innerWidget = null;
            this.contentFragment = document.createDocumentFragment();
            this.contentNode = this.rootNode = document.createElement(attr && attr["tag"] || rootNode && rootNode.nodeName || this["constructor"].nodeName || this["constructor"].name || 'div');
            this.rootNode.$widget = this;
            this.rootNode.$component = _parentComponent || this;
            this.node = rootNode || this.rootNode;
            this.DOM = $(this.rootNode);
            this.scope = scope || null;
            this.children = children;
            this.attrs = attr || {};
            if (this.defaultTemplate) {
                this.startComponent([this.defaultTemplate]);
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
        Widget.prototype.setUnwrapedComponent = function (value) {
            if (this._unwrapedComponent != undefined) {
                throw new Error("unwrapedComponent can be setted only once");
            }
            this._unwrapedComponent = value;
            if (value) {
                var originalNode = this.rootNode;
                if (this.innerDOM) {
                    this.DOM = this.innerDOM;
                    this.rootNode = this.DOM[0];
                }
                if (originalNode && originalNode.parentElement && this.rootNode != originalNode) {
                    originalNode.parentElement.replaceChild(this.rootNode, originalNode);
                }
            }
        };
        Widget.prototype.generateScopedContent = function (scope) {
            return getChildNodes(this.node, this._params, this._parentComponent, scope || this);
        };
        Widget.prototype.visible_changed = function (val) {
            if (val && mz.CBool(val) && val !== "0" && val.toString().toLowerCase() != "false") {
                this.DOM.removeClass('mz-hidden').removeAttr('aria-hidden').removeAttr(mz.HIDDEN_PROP);
            }
            else {
                this.DOM.addClass('mz-hidden').attr('aria-hidden', "true").attr(mz.HIDDEN_PROP, mz.HIDDEN_PROP);
            }
        };
        Widget.prototype.attr = function (attrName, value) {
            var attrNameLower = attrName.toLowerCase();
            if (value === undefined) {
                return this.get(attrName) || this.DOM.attr(attrName);
            }
            else {
                var boolAttr = attrNameLower in boolAttrs;
                var typeofValue = typeof value;
                if (boolAttr) {
                    if (typeofValue === "function")
                        value = value();
                    value = mz.CBool(value) && value.toString().toLowerCase() !== "false" && value !== "0";
                }
                this.set(attrName, value);
                this.attrs[attrName] = value;
                if (attrNameLower in Widget.directives && Widget.directives[attrNameLower]) {
                    Widget.directives[attrNameLower](value, this, this._parentComponent);
                }
                else if (boolAttr) {
                    if (value) {
                        this.DOM.prop(attrName, value);
                    }
                    else {
                        this.DOM.removeProp(attrName);
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
                    if (!(/^:/.test(attrName)) && (typeofValue === "string" || typeofValue === "number" || typeofValue === "boolean")) {
                        if (attrNameLower in ignoredAttrs)
                            return;
                        this.DOM.attr(attrName, value);
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
                return;
            }
            var xhr = new XMLHttpRequest();
            var transformedUrl = mz.getPath(url);
            xhr.addEventListener('load', function (ev) {
                if (xhr.responseXML && xhr.responseXML instanceof Document) {
                    mz.widgetTemplateSource[url] = xhr.responseXML;
                    _this.startComponent(xhr.responseXML);
                    _this.componentInitialized();
                    requestAnimationFrame(function () { return _this.resize(); });
                }
                else if (xhr.responseText && xhr.responseText.length) {
                    mz.widgetTemplateSource[url] = [xhr.responseText];
                    _this.startComponent([xhr.responseText], []);
                    _this.componentInitialized();
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
                if (!this._contentSelector) {
                    if (doc.firstChild && doc.firstChild.childNodes.length == 0)
                        this._contentSelector = ':root';
                    else
                        this._contentSelector = 'content';
                }
                this.innerWidget = domToWidgets(doc.firstChild, params, this, this.scope);
                this.innerDOM = this.innerWidget.DOM;
            }
            if (this._unwrapedComponent) {
                var originalNode = this.rootNode, originalNode$ = this.DOM;
                if (this.innerDOM) {
                    this.DOM = this.innerDOM;
                    this.rootNode = this.DOM[0];
                    if (this.rootNode != originalNode) {
                        for (var i = 0; i < originalNode.attributes.length; i++) {
                            var attrib = originalNode.attributes[i];
                            if (!('specified' in attrib) || attrib.specified) {
                                if (attrib.name.toLowerCase() == "class")
                                    this.DOM.addClass(attrib.value);
                                else
                                    this.DOM.attr(attrib.name, attrib.value);
                            }
                        }
                        if (originalNode && originalNode.parentElement) {
                            originalNode.parentElement.replaceChild(this.rootNode, originalNode.parentElement);
                        }
                    }
                }
            }
            if (this.innerDOM || !this.contentNode)
                this.contentNode = this.innerDOM && this.innerDOM[0] || this.rootNode || this.contentNode;
            if (this.innerDOM && this.innerDOM != this.DOM)
                this.innerDOM.appendTo(this.DOM);
            var apendeado = false;
            if (this._contentSelector)
                apendeado = this.setContentSelector(this._contentSelector);
            if (!apendeado)
                this.appendChildrens();
            return this.innerWidget;
        };
        Widget.prototype.appendChildrens = function () {
            var _this = this;
            this.children.forEach(function (element) {
                if (element && typeof element == "object") {
                    if ('rootNode' in element && element.rootNode instanceof HTMLElement)
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
        Widget.prototype.setContentSelector = function (selector) {
            this._contentSelector = selector;
            if (this.innerDOM) {
                var prevContent = this.contentNode;
                this.contentNode = selector == ":root" ? this.rootNode : this.rootNode.querySelector(selector);
                if (prevContent !== this.contentNode && this.contentNode) {
                    this.appendChildrens();
                    return true;
                }
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
                else if (element instanceof widgets.TextNode) {
                    this.contentNode.appendChild(element.node);
                }
                else if (element instanceof $) {
                    return element.appendTo($(this.contentNode));
                }
                else if ('DOM' in element && element.DOM instanceof $) {
                    return element.DOM.appendTo($(this.contentNode));
                }
                else {
                    return $(element).appendTo($(this.contentNode));
                }
            }
        };
        Widget.prototype.appendTo = function (element) {
            if (element && element instanceof Widget) {
                return element.append(this);
            }
            else if (element && typeof element == "object" && 'DOM' in element && element.DOM instanceof $) {
                return element.DOM.append(this.DOM);
            }
            else if (element && element instanceof $) {
                return element.append(this.DOM);
            }
            else {
                return $(element).append(this.DOM);
            }
        };
        Widget.prototype.initAttr = function (attr) {
            if (attr) {
                if (!this.attrs)
                    this.attr = attr;
                for (var i in attr) {
                    this.attr(i, attr[i]);
                }
                if ('class' in attr && this.visible == false) {
                    this.visible_changed(false);
                }
            }
        };
        /**
         * Resizes the current widget, it also sends a signal "resize" to all the childrens
         */
        Widget.prototype.resize = function () {
            this.emit('resize');
            this.innerWidget && this.innerWidget.resize && this.innerWidget.resize();
            this.children.forEach(function (e) { return e && typeof e == 'object' && e.resize && e.resize(); });
        };
        /**
         *  Destroys the current widget and it's children
         */
        Widget.prototype.unmount = function () {
            this.DOM.remove();
            this.innerDOM = null;
            this.emit('unmount');
            this.off();
            for (var _i = 0, _a = this.listening; _i < _a.length; _i++) {
                var i = _a[_i];
                i && i.off && i.off();
            }
            this.listening.length = 0;
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
        Widget.IsEmptyTag = function (target) {
            target.EMPTY_TAG = true;
        };
        Widget.Template = function (template, contentSelector) {
            return function (target) {
                target.prototype.defaultTemplate = template;
                if (contentSelector && contentSelector.length)
                    target.prototype._contentSelector = contentSelector;
            };
        };
        Widget.Unwrap = function (target) {
            target.prototype._unwrapedComponent = true;
        };
        Widget.EMPTY_TAG = false;
        Widget.props = {};
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Boolean)
        ], Widget.prototype, "visible", void 0);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Object)
        ], Widget.prototype, "scope", void 0);
        return Widget;
    })(mz.MVCObject);
    mz.Widget = Widget;
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
        })(Widget);
        widgets.BaseElement = BaseElement;
    })(widgets = mz.widgets || (mz.widgets = {}));
    var Widget;
    (function (Widget) {
        Widget.directives = {};
        function registerDirective(attrName, callback) {
            var lowerCaseName = attrName.toLowerCase();
            if (lowerCaseName in Widget.directives) {
                console.warn("There is alredy a directive for '" + lowerCaseName + "'. It would be replaced.");
            }
            Widget.directives[lowerCaseName] = callback;
        }
        Widget.registerDirective = registerDirective;
    })(Widget = mz.Widget || (mz.Widget = {}));
})(mz || (mz = {}));
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        var BasePagelet = (function (_super) {
            __extends(BasePagelet, _super);
            function BasePagelet(attr) {
                _super.call(this, null, attr || {}, [], this, this, this);
            }
            return BasePagelet;
        })(mz.Widget);
        widgets.BasePagelet = BasePagelet;
        var InlinePagelet = (function (_super) {
            __extends(InlinePagelet, _super);
            function InlinePagelet(template, attr) {
                _super.call(this, null, attr || {}, [], this, this, this);
                this.startComponent([template]);
            }
            return InlinePagelet;
        })(mz.Widget);
        widgets.InlinePagelet = InlinePagelet;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));
/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />
var symbol2wb = Symbol("mz-model-binding");
mz.Widget.registerDirective("mz-model", function (value, widget, parent) {
    var bindeo = widget[symbol2wb];
    if (value && !bindeo) {
        if (widget.rootNode.nodeName.toUpperCase() == 'INPUT' || widget.rootNode.nodeName.toUpperCase() == 'SELECT') {
            // detecto los cambios
            widget[symbol2wb] = widget.DOM.on('changed keyup paste lostfocus search', mz.delayer(function () {
                var actualVal = widget.DOM.val();
                if (actualVal != parent[value])
                    parent[value] = actualVal;
            }, 1));
            parent.on(value + "_changed", function (newVal) {
                var actualVal = widget.DOM.val();
                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    widget.DOM.val(newVal);
            });
        }
    }
});
/// <reference path="../Widget.ts" />
mz.Widget.registerDirective('mz-raw', function (val, widget) {
    widget.DOM.html(val);
});
/// <reference path="../Widget.ts" />
mz.Widget.registerDirective('mz-visible', function (val, widget) {
    if (val && CBool(val) && val !== "0" && val.toString().toLowerCase() != "false") {
        widget.DOM.removeClass('mz-hidden').removeAttr('aria-hidden').removeAttr(mz.HIDDEN_PROP);
    }
    else {
        widget.DOM.addClass('mz-hidden').attr('aria-hidden', "true").attr(mz.HIDDEN_PROP, mz.HIDDEN_PROP);
    }
});
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
var React;
(function (React) {
    function createElement(type, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var ctor = null;
        if (typeof type == "string") {
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
    React.createElement = createElement;
    React.__spread = mz.copy;
})(React || (React = {}));
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
/// <reference path="../view/Widget.ts" />
var mz;
(function (mz) {
    var widgets;
    (function (widgets) {
        function delegateUnmountElement(widget) {
            if (widget && typeof widget == "object") {
                if ('unmount' in widget)
                    widget.unmount();
                else
                    widget.DOM && widget.DOM.remove();
            }
        }
        function delegateRefreshScope(e) {
            if (e && typeof e == "object") {
                'scope' in e && (e.scope = e.scope);
                'refreshScope' in e && e.refreshScope();
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
                if (list && !(list instanceof mz.collection)) {
                    console.error(new Error("<mz-repeat> expects attr 'list: mz.collection'"));
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
                var that = this;
                var rebuild = !tipo;
                if (tipo == "set_at" && b[this.collectionKey]) {
                    b[this.collectionKey].forEach(delegateRefreshScope);
                }
                else if (tipo == "insert_at" || tipo == "set_at") {
                    this.ponerElem(b);
                }
                else if (tipo == "remove_at" && b && b[this.collectionKey]) {
                    this.delegateUnmountElements(b);
                }
                else if (tipo == "filter" || tipo == mz.collection.EVENTS.CollectionSorted) {
                    rebuild = true;
                } /*else if (tipo == "removed") {
                    rebuild = true;
                }*/
                else if (tipo == "refresh") {
                    this.detachAllNodes();
                    this.list.forEach(delegateRefreshScope);
                    rebuild = true;
                }
                else if (tipo == mz.collection.EVENTS.BeforeClearCollection) {
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
                __metadata('design:type', mz.collection)
            ], MzRepeat.prototype, "list", void 0);
            __decorate([
                mz.MVCObject.proxy, 
                __metadata('design:type', Function)
            ], MzRepeat.prototype, "afterAdd", void 0);
            MzRepeat = __decorate([
                mz.Widget.RegisterComponent("mz-repeat"),
                mz.Widget.IsEmptyTag, 
                __metadata('design:paramtypes', [HTMLElement, Object, Array, Object, Object, Object])
            ], MzRepeat);
            return MzRepeat;
        })(mz.Widget);
        widgets.MzRepeat = MzRepeat;
    })(widgets = mz.widgets || (mz.widgets = {}));
})(mz || (mz = {}));



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXouanMiLCJzb3VyY2VzIjpbIm16LnRzIiwiQVVUSC9KV1QudHMiLCJDT1JFL0kxOG4udHMiLCJDT1JFL0RhdGUudHMiLCJDT1JFL1Byb21pc2UudHMiLCJDT1JFL1hyLnRzIiwiQ09SRS9TdHJpbmdzLnRzIiwiQ09SRS9FdmVudERpc3BhdGNoZXIudHMiLCJBVVRIL09BdXRoMi50cyIsIkNPUkUvQU1EL1JlcXVpcmUudHMiLCJDT1JFL0FNRC9Nb2R1bGUudHMiLCJDT1JFL0FNRC9EZWZpbmUudHMiLCJDT1JFL0FNRC9TZXR1cC50cyIsIkNPUkUvTVZDT2JqZWN0LnRzIiwiQ09SRS9Db2xsZWN0aW9uLnRzIiwiQ09SRS9ET00udHMiLCJDT1JFL0RPTS9ET00udHMiLCJDT1JFL0RPTS9ET01QYXJzZXIudHMiLCJDT1JFL0RPTS9ET01QYXJzZXJfSW1wbC50cyIsIkNPUkUvRE9NL0RPTV9Ccm93c2VySW1wbC50cyIsIkNPUkUvRGVjb3JhdG9ycy50cyIsIkNPUkUvUmVmbGVjdGlvbi50cyIsIkNPUkUvUm91dGUudHMiLCJWSUVXL0NTUy50cyIsIlZJRVcvVG1wbC50cyIsIlZJRVcvSGVscGVycy50cyIsIlZJRVcvVGV4dE5vZGUudHMiLCJWSUVXL1dpZGdldC50cyIsIlZJRVcvRElSRUNUSVZFUy9Nek1vZGVsLnRzIiwiVklFVy9ESVJFQ1RJVkVTL016UmF3LnRzIiwiVklFVy9ESVJFQ1RJVkVTL1Zpc2libGUudHMiLCJWSUVXL0h0bWxTYW5pdGl6ZXIudHMiLCJWSUVXL1RTWC50cyIsIldJREdFVFMvbXotcmVwZWF0LnRzIl0sIm5hbWVzIjpbImlzRGVmIiwibXoiLCJtei5hbGlhcyIsIm16LmdldFBhdGgiLCJtei5nZXRFbGVtZW50UG9zaXRpb24iLCJleHRlbmQiLCJtei5jb3B5IiwibXoubWFwWEludG8iLCJtei5tYXBJbnRvIiwibXouaXNJdGVyYWJsZSIsIm16LnRyaW0iLCJtei5nZXRET01JRCIsIm16LmdlblVJRCIsIm16LmRhdGEiLCJtei5kYXRhLm9yZGVyIiwibXouZGF0YS5vcmRlci5udWxsX2FycmliYSIsIm16LmRhdGEub3JkZXIubnVsbF9hYmFqbyIsIm16LmRhdGEub3JkZXIuYnVpbGQiLCJtei5lc2NhcGVSZWdFeHAiLCJtei5sb2FkQ3NzIiwibXouZm5JbmZvIiwibXouY29tcGlsZUZpbHRlciIsIm16LmdldFdpbmRvd1NpemUiLCJtei5nbG9iYWxDYWxsYmFjayIsIm16LmJ1c2NhckFyZ3VtZW50b1RpcG8iLCJtei5hdXRoIiwibXouYXV0aC5qd3QiLCJtei5hdXRoLmp3dC51cmxCYXNlNjREZWNvZGUiLCJtei5hdXRoLmp3dC5kZWNvZGVUb2tlbiIsIm16LmF1dGguand0LmdldFRva2VuRXhwaXJhdGlvbkRhdGUiLCJtei5hdXRoLmp3dC5pc1Rva2VuRXhwaXJlZCIsIm16LsOxIiwibXouZGF0ZSIsIm16LmRhdGUucGFyc2VPYmplY3QiLCJtei5kYXRlLmFkZEZlYXR1cmUiLCJtei5kYXRlLmZyb21TdHJpbmciLCJtei5kYXRlLm5ld1N5bmNybyIsIm16LmRhdGUuc3luYyIsIm16LmRhdGUucGFyc2UiLCJtei5kYXRlLnBhcnNlLnBhcnNlSnNvbkRhdGUiLCJtei5kYXRlLnBhcnNlLmNvbnZlcnRpckFGZWNoYUhvcmEiLCJtei5kYXRlLnBhcnNlLmNvbnZlcnRpckFGZWNoYSIsIm16LmRhdGUuYWRkIiwibXouZGF0ZS5mbXRfZGF0ZSIsIm16LmRhdGUuZm10X3RpbWUiLCJtei5kYXRlLmZtdF9kYXRlX3RpbWUiLCJtei5kYXRlLnRvU3RyaW5nIiwibXouZGF0ZS5mbXRfZHVyYWNpb24iLCJtei5kYXRlLnBhcnNlRHVyYWNpb24iLCJtei5wcm9taXNlIiwibXoucHJvbWlzZS53YWl0IiwibXoucHJvbWlzZS55aWVsZCIsIm16LnByb21pc2UubmV4dEZyYW1lIiwibXoucHJvbWlzZS5wYXJzZVN0cmluZ0RhdGVzIiwibXoucmVzIiwibXouZ2V0UGFyYW1zIiwibXoueHIiLCJtei54ci5mb3JtYXR0ZXJzIiwibXoueHIueG1sSHR0cFJlcXVlc3QiLCJtei54ci5wcm9taXNlIiwibXoueHIudXJsUmVzb2x2ZSIsIm16LnhyLnVybElzU2FtZU9yaWdpbiIsIm16LnhyLnVybEVuY29kZSIsIm16LnhyLmdldCIsIm16LnhyLnB1dCIsIm16LnhyLnBvc3QiLCJtei54ci5wYXRjaCIsIm16LnhyLmRlbCIsIm16LnhyLm9wdGlvbnMiLCJtei5FdmVudERpc3BhdGNoZXJCaW5kaW5nIiwibXouRXZlbnREaXNwYXRjaGVyQmluZGluZy5jb25zdHJ1Y3RvciIsIm16LkV2ZW50RGlzcGF0Y2hlckJpbmRpbmcub2ZmIiwibXouRXZlbnREaXNwYXRjaGVyIiwibXouRXZlbnREaXNwYXRjaGVyLmNvbnN0cnVjdG9yIiwibXouRXZlbnREaXNwYXRjaGVyLm9uIiwibXouRXZlbnREaXNwYXRjaGVyLm9uY2UiLCJtei5FdmVudERpc3BhdGNoZXIub2ZmIiwibXouRXZlbnREaXNwYXRjaGVyLmVtaXQiLCJtei5vYXV0aDIiLCJtei5vYXV0aDIuZXh0cmFjdERvbWFpbiIsIm16Lm9hdXRoMi50b2tlbkdldHRlciIsIm16Lm9hdXRoMi5zZXR1cFRva2VuIiwibXoub2F1dGgyLnNldFRva2VuIiwibXoub2F1dGgyLmNoZWNrUm9sZSIsIm16Lm9hdXRoMi5wdXNoUm9sZXMiLCJtei5vYXV0aDIuYXBwbHlBdXRob3JpemF0aW9uSGVhZGVycyIsIm16Lm9hdXRoMi5jb25maWd1cmUiLCJtei5vYXV0aDIucmVmcmVzaFRva2VuIiwibXoub2F1dGgyLmxvZ291dCIsIm16Lm9hdXRoMi5sb2dpbiIsIm16Lm9hdXRoMi5sb2dnZWRJbiIsIm16LnJlcXVpcmUiLCJtei5pbmNsdWRlIiwibXoubG9hZE1vZHVsZSIsIm16LnJlcXVpcmUucm91dGUiLCJtei5yZXF1aXJlLmRlZmluZUZpbGVzIiwibXouTW9kdWxlIiwibXouTW9kdWxlLmNvbnN0cnVjdG9yIiwibXouTW9kdWxlLmdldFBhdGgiLCJtei5Nb2R1bGUucmVxdWlyZSIsIm16Lk1vZHVsZS5kZWZpbmUiLCJtei5Nb2R1bGUuw7EiLCJtei5Nb2R1bGVFeHBvcnRzIiwibXouTW9kdWxlRXhwb3J0cy5jb25zdHJ1Y3RvciIsIm16Lk1vZHVsZUV4cG9ydHMuc2V0IiwibXoudW5kZWZpbmUiLCJtei5kZWZpbmUiLCJtei5NVkNPYmplY3QiLCJtei5NVkNPYmplY3QuY29uc3RydWN0b3IiLCJtei5NVkNPYmplY3QuZ2V0QWxsIiwibXouTVZDT2JqZWN0LnNldFZhbHVlcyIsIm16Lk1WQ09iamVjdC5zZXQiLCJtei5NVkNPYmplY3QuZ2V0IiwibXouTVZDT2JqZWN0LnByb3h5IiwibXouY29sbGVjdGlvbiIsIm16LmNvbGxlY3Rpb24uY29uc3RydWN0b3IiLCJtei5jb2xsZWN0aW9uLmZpcnN0IiwibXouY29sbGVjdGlvbi5sYXN0IiwibXouY29sbGVjdGlvbi5jbGVhciIsIm16LmNvbGxlY3Rpb24ubGVuZ3RoIiwibXouY29sbGVjdGlvbi5nZXRMZW5ndGgiLCJtei5jb2xsZWN0aW9uLnNldExlbmd0aCIsIm16LmNvbGxlY3Rpb24ubWFwIiwibXouY29sbGVjdGlvbi5mb3JFYWNoIiwibXouY29sbGVjdGlvbi5hc3luY0ZvckVhY2giLCJtei5jb2xsZWN0aW9uLmFzeW5jRm9yRWFjaC5zY2giLCJtei5jb2xsZWN0aW9uLl9pbmRpemFyIiwibXouY29sbGVjdGlvbi5fZGVpbmRpemFyIiwibXouY29sbGVjdGlvbi5fcmVpbmRpemFyIiwibXouY29sbGVjdGlvbi5nZXRBdCIsIm16LmNvbGxlY3Rpb24ucmVkdWNlIiwibXouY29sbGVjdGlvbi5ncm91cEJ5IiwibXouY29sbGVjdGlvbi5rZXkiLCJtei5jb2xsZWN0aW9uLmluc2VydEF0IiwibXouY29sbGVjdGlvbi5yZW1vdmVBdCIsIm16LmNvbGxlY3Rpb24uc2V0QXQiLCJtei5jb2xsZWN0aW9uLnB1c2giLCJtei5jb2xsZWN0aW9uLnBvcCIsIm16LmNvbGxlY3Rpb24uYWRkUmFuZ2UiLCJtei5jb2xsZWN0aW9uLnVwZGF0ZSIsIm16LmNvbGxlY3Rpb24udXBkYXRlQnlLZXkiLCJtei5jb2xsZWN0aW9uLnVwZGF0ZUluZGV4IiwibXouY29sbGVjdGlvbi5qb2luIiwibXouY29sbGVjdGlvbi5zdW0iLCJtei5jb2xsZWN0aW9uLm9yZGVyQnkiLCJtei5jb2xsZWN0aW9uLm9yZGVyQnlEZXNjIiwibXouY29sbGVjdGlvbi5zb21lIiwibXouY29sbGVjdGlvbi53aGVyZSIsIm16LmNvbGxlY3Rpb24ucmVtb3ZlQnlLZXkiLCJtei5jb2xsZWN0aW9uLnJlbW92ZSIsIm16LmNvbGxlY3Rpb24uc2luZ2xlIiwibXouY29sbGVjdGlvbi5jb250YWlucyIsIm16LmNvbGxlY3Rpb24uY29udGFpbnNLZXkiLCJtei5jb2xsZWN0aW9uLmluZGV4T2YiLCJtei5jb2xsZWN0aW9uLmxhc3RJbmRleE9mIiwibXouY29sbGVjdGlvbi50b0FycmF5IiwibXouY29sbGVjdGlvbi5jbG9uZSIsIm16LmNvbGxlY3Rpb24uaW5kZXhlZEdldCIsIm16LmNvbGxlY3Rpb24uaW5kZXhlZEdldEluZGV4IiwibXouY29sbGVjdGlvbi5tZXJnZUVsZW0iLCJtei5jb2xsZWN0aW9uLm1heCIsIm16LmNvbGxlY3Rpb24ubWluIiwibXouY29sbGVjdGlvbi5hdmciLCJtei5jb2xsZWN0aW9uLnRha2UiLCJtei5jb2xsZWN0aW9uLnRha2VJbnRvIiwibXouY29sbGVjdGlvbi5zd2FwSXRlbXMiLCJtei5jb2xsZWN0aW9uLmNvdW50IiwibXouY29sbGVjdGlvbi5yZXZlcnNlIiwibXouY29sbGVjdGlvbi5tZXJnZUFycmF5IiwibXouY29sbGVjdGlvbi5jcmVhdGVWaWV3IiwibXouY29sbGVjdGlvbi5nZXRQcml2YXRlQXJyYXkiLCJtei5jb2xsZWN0aW9uVmlldyIsIm16LmNvbGxlY3Rpb25WaWV3LmNvbnN0cnVjdG9yIiwibXouY29sbGVjdGlvblZpZXcuX2hhbmRsZUNoYW5nZWQiLCJtei5jb2xsZWN0aW9uVmlldy5fcmVtYWtlIiwibXouY29sbGVjdGlvblZpZXcucmVzb3J0IiwibXouY29sbGVjdGlvblZpZXcucmVmcmVzaCIsIm16LmNvbGxlY3Rpb25WaWV3LmZpbHRlciIsIm16LmNvbGxlY3Rpb25WaWV3Lm9yZGVyQnkiLCJtei5jb2xsZWN0aW9uVmlldy5vcmRlckJ5RGVzYyIsIm16LmNvbGxlY3Rpb25WaWV3LmF0dGFjaFRvIiwibXouY29sbGVjdGlvblZpZXcuZGV0YWNoIiwibXouY29yZSIsIm16LmNvcmUuZG9tIiwibXouY29yZS5kb20uc2V0Um9vdERvbUFkYXB0ZXIiLCJtei5jb3JlLmRvbS5zZXRSb290RG9tUGFyc2VyIiwibXouY29yZS5kb20uQWJzdHJhY3REb21BZGFwdGVyIiwibXouY29yZS5kb20uQWJzdHJhY3REb21BZGFwdGVyLmNvbnN0cnVjdG9yIiwibXouY29yZS5kb20uQXN0VHlwZXMiLCJtei5jb3JlLmRvbS5Bc3RFbGVtZW50IiwibXouY29yZS5kb20uQXN0RWxlbWVudC5jb25zdHJ1Y3RvciIsIm16LmNvcmUuZG9tLkFic3RyYWN0RG9tUGFyc2VyIiwibXouY29yZS5kb20uQWJzdHJhY3REb21QYXJzZXIuY29uc3RydWN0b3IiLCJwYXJzZVN0YXJ0VGFnIiwicGFyc2VFbmRUYWciLCJtei5jb3JlLmRvbS5tYWtlTWFwIiwibXouY29yZS5kb20uSHRtbFBhcnNlciIsIm16LmNvcmUuZG9tLkh0bWxQYXJzZXIuY29uc3RydWN0b3IiLCJtei5jb3JlLmRvbS5IdG1sUGFyc2VyLnBhcnNlIiwibXouY29yZS5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyIiwibXouY29yZS5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyLmNvbnN0cnVjdG9yIiwibXouY29yZS5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyLmdldERpc3RyaWJ1dGVkTm9kZXMiLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIucmVzb2x2ZUFuZFNldEhyZWYiLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuc3VwcG9ydHNET01FdmVudHMiLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuc3VwcG9ydHNOYXRpdmVTaGFkb3dET00iLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0QW5pbWF0aW9uUHJlZml4IiwibXouY29yZS5kb20uR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyLmdldFRyYW5zaXRpb25FbmQiLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuc3VwcG9ydHNBbmltYXRpb24iLCJtei5jb3JlLmRvbS5HZW5lcmljQnJvd3NlckRvbUFkYXB0ZXIuZ2V0WEhSIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jb25zdHJ1Y3RvciIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnBhcnNlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIubWFrZUN1cnJlbnQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNQcm9wZXJ0eSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFByb3BlcnR5IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0UHJvcGVydHkiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pbnZva2UiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5sb2dFcnJvciIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmxvZyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmxvZ0dyb3VwIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIubG9nR3JvdXBFbmQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5hdHRyVG9Qcm9wTWFwIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucXVlcnkiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5xdWVyeVNlbGVjdG9yIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucXVlcnlTZWxlY3RvckFsbCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLm9uIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIub25BbmRDYW5jZWwiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5kaXNwYXRjaEV2ZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlTW91c2VFdmVudCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNyZWF0ZUV2ZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucHJldmVudERlZmF1bHQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pc1ByZXZlbnRlZCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldElubmVySFRNTCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldE91dGVySFRNTCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLm5vZGVOYW1lIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIubm9kZVZhbHVlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIudHlwZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNvbnRlbnQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5maXJzdENoaWxkIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIubmV4dFNpYmxpbmciLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5wYXJlbnRFbGVtZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY2hpbGROb2RlcyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNoaWxkTm9kZXNBc0xpc3QiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jbGVhck5vZGVzIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuYXBwZW5kQ2hpbGQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5yZW1vdmVDaGlsZCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlcGxhY2VDaGlsZCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlbW92ZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmluc2VydEJlZm9yZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmluc2VydEFsbEJlZm9yZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmluc2VydEFmdGVyIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuc2V0SW5uZXJIVE1MIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0VGV4dCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFRleHQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRWYWx1ZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFZhbHVlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q2hlY2tlZCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldENoZWNrZWQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVDb21tZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGVtcGxhdGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVFbGVtZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlRWxlbWVudE5TIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlVGV4dE5vZGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVTY3JpcHRUYWciLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVTdHlsZUVsZW1lbnQiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jcmVhdGVTaGFkb3dSb290IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0U2hhZG93Um9vdCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEhvc3QiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5jbG9uZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRFbGVtZW50c0J5VGFnTmFtZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNsYXNzTGlzdCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmFkZENsYXNzIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVtb3ZlQ2xhc3MiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNDbGFzcyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldFN0eWxlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVtb3ZlU3R5bGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRTdHlsZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnRhZ05hbWUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5hdHRyaWJ1dGVNYXAiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5oYXNBdHRyaWJ1dGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRBdHRyaWJ1dGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRBdHRyaWJ1dGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5zZXRBdHRyaWJ1dGVOUyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlbW92ZUF0dHJpYnV0ZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnRlbXBsYXRlQXdhcmVSb290IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuY3JlYXRlSHRtbERvY3VtZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZGVmYXVsdERvYyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFRpdGxlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuc2V0VGl0bGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5lbGVtZW50TWF0Y2hlcyIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzVGVtcGxhdGVFbGVtZW50IiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaXNUZXh0Tm9kZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzQ29tbWVudE5vZGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5pc0VsZW1lbnROb2RlIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuaGFzU2hhZG93Um9vdCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmlzU2hhZG93Um9vdCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmltcG9ydEludG9Eb2MiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5hZG9wdE5vZGUiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRIcmVmIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0RXZlbnRLZXkiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRHbG9iYWxFdmVudFRhcmdldCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEhpc3RvcnkiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXRMb2NhdGlvbiIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldEJhc2VIcmVmIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucmVzZXRCYXNlRWxlbWVudCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmdldFVzZXJBZ2VudCIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnNldERhdGEiLCJtei5jb3JlLmRvbS5Ccm93c2VyRG9tQWRhcHRlci5nZXREYXRhIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIuZ2V0Q29tcHV0ZWRTdHlsZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLnJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm16LmNvcmUuZG9tLkJyb3dzZXJEb21BZGFwdGVyLmNhbmNlbEFuaW1hdGlvbkZyYW1lIiwibXouY29yZS5kb20uQnJvd3NlckRvbUFkYXB0ZXIucGVyZm9ybWFuY2VOb3ciLCJtei5jb3JlLmRvbS5nZXRCYXNlRWxlbWVudEhyZWYiLCJtei5jb3JlLmRvbS5yZWxhdGl2ZVBhdGgiLCJtei5jb3JlLmRlY29yYXRvcnMiLCJtei5jb3JlLmRlY29yYXRvcnMuTG9nUmVzdWx0IiwibXouY29yZS5kZWNvcmF0b3JzLm5vRW51bWVyYWJsZSIsIm16LmNvcmUuZGVjb3JhdG9ycy5kZWxheWVyIiwibXouY29yZS5kZWNvcmF0b3JzLnNjcmVlbkRlbGF5ZXIiLCJSZWZsZWN0IiwiUmVmbGVjdC5tZXRhZGF0YSIsIlJlZmxlY3QubWV0YWRhdGEuZGVjb3JhdG9yIiwiUmVmbGVjdC5zZXRPYmplY3RTeW1ib2wiLCJtei5jc3MiLCJtei5jc3Muc2V0IiwibXouY3NzLlN0eWxlc2hlZXQiLCJtei5jc3MuU3R5bGVzaGVldC5jb25zdHJ1Y3RvciIsIm16LmNzcy5TdHlsZXNoZWV0LmVuYWJsZSIsIm16LmNzcy5TdHlsZXNoZWV0LmRpc2FibGUiLCJtei5jc3MuU3R5bGVzaGVldC5yZWZyZXNoIiwibXouY3NzLlN0eWxlc2hlZXQuc2V0IiwibXoudmlldyIsIm16LnZpZXcudG1wbCIsIm16LnZpZXcudG1wbC5pbnRlcm5hbFRtcGwiLCJtei52aWV3LnRtcGwuZXhwciIsIm16LnZpZXcudG1wbC53cmFwIiwibXoudmlldy50bXBsLnNwbGl0IiwibXoudmlldy50bXBsLmV4dHJhY3QiLCJtei5nZXRIaWRkZW5Qcm9wIiwibXouZ2V0VHJhbnNmb3JtVGFnIiwibXoud2lkZ2V0cyIsIm16LndpZGdldHMuVGV4dE5vZGUiLCJtei53aWRnZXRzLlRleHROb2RlLmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5UZXh0Tm9kZS5zZXR1cCIsIm16LndpZGdldHMuVGV4dE5vZGUudW5tb3VudCIsIm16LndpZGdldHMuVGV4dE5vZGUucmVmcmVzaFNjb3BlIiwibXoud2lkZ2V0cy5UZXh0Tm9kZS5yZXR1cm5Ub1BvbGwiLCJtei53aWRnZXRzLlRleHROb2RlLmdldEZyb21Qb2xsIiwibXouZGVsZWdhdGVSZWZyZXNoU2NvcGUiLCJtei5xdWFzaVRvRG9tIiwibXouYmluZFdpZGdldEF0dHIiLCJtei5kb21Ub1dpZGdldHMiLCJtei5nZXRDaGlsZE5vZGVzIiwibXouZ2V0SlF1ZXJ5RXZlbnRXcmFwcGVyIiwibXouZXJyb3JMb2FkaW5nVGVtcGxhdGUiLCJtei5XaWRnZXQiLCJtei5XaWRnZXQuY29uc3RydWN0b3IiLCJtei5XaWRnZXQuc2NvcGVfY2hhbmdlZCIsIm16LldpZGdldC5zZXRVbndyYXBlZENvbXBvbmVudCIsIm16LldpZGdldC5nZW5lcmF0ZVNjb3BlZENvbnRlbnQiLCJtei5XaWRnZXQudmlzaWJsZV9jaGFuZ2VkIiwibXouV2lkZ2V0LmF0dHIiLCJtei5XaWRnZXQucmVmcmVzaFNjb3BlIiwibXouV2lkZ2V0LmZpbmQiLCJtei5XaWRnZXQubG9hZFRlbXBsYXRlIiwibXouV2lkZ2V0LmNvbXBvbmVudEluaXRpYWxpemVkIiwibXouV2lkZ2V0LnN0YXJ0Q29tcG9uZW50IiwibXouV2lkZ2V0LmFwcGVuZENoaWxkcmVucyIsIm16LldpZGdldC5zZXRDb250ZW50U2VsZWN0b3IiLCJtei5XaWRnZXQuYXBwZW5kIiwibXouV2lkZ2V0LmFwcGVuZFRvIiwibXouV2lkZ2V0LmluaXRBdHRyIiwibXouV2lkZ2V0LnJlc2l6ZSIsIm16LldpZGdldC51bm1vdW50IiwibXouV2lkZ2V0LlJlZ2lzdGVyQ29tcG9uZW50IiwibXouV2lkZ2V0LklzRW1wdHlUYWciLCJtei5XaWRnZXQuVGVtcGxhdGUiLCJtei5XaWRnZXQuVW53cmFwIiwibXoud2lkZ2V0cy5CYXNlRWxlbWVudCIsIm16LndpZGdldHMuQmFzZUVsZW1lbnQuY29uc3RydWN0b3IiLCJtei5XaWRnZXQucmVnaXN0ZXJEaXJlY3RpdmUiLCJtei53aWRnZXRzLkJhc2VQYWdlbGV0IiwibXoud2lkZ2V0cy5CYXNlUGFnZWxldC5jb25zdHJ1Y3RvciIsIm16LndpZGdldHMuSW5saW5lUGFnZWxldCIsIm16LndpZGdldHMuSW5saW5lUGFnZWxldC5jb25zdHJ1Y3RvciIsIm16LnZpZXcuaHRtbCIsIm16LnZpZXcuaHRtbC5lc2NhcGUiLCJSZWFjdCIsIlJlYWN0LmNyZWF0ZUVsZW1lbnQiLCJtei5oIiwibXoud2lkZ2V0cy5kZWxlZ2F0ZVVubW91bnRFbGVtZW50IiwibXoud2lkZ2V0cy5kZWxlZ2F0ZVJlZnJlc2hTY29wZSIsIm16LndpZGdldHMuTXpSZXBlYXQiLCJtei53aWRnZXRzLk16UmVwZWF0LmNvbnN0cnVjdG9yIiwibXoud2lkZ2V0cy5NelJlcGVhdC5saXN0X2NoYW5nZWQiLCJtei53aWRnZXRzLk16UmVwZWF0LnVubW91bnQiLCJtei53aWRnZXRzLk16UmVwZWF0LnBvbmVyRWxlbSIsIm16LndpZGdldHMuTXpSZXBlYXQuZ2VuZXJhdGVTY29wZWRDb250ZW50IiwibXoud2lkZ2V0cy5NelJlcGVhdC5kZXRhY2hBbGxOb2RlcyIsIm16LndpZGdldHMuTXpSZXBlYXQuZGVsZWdhdGVVbm1vdW50RWxlbWVudHMiLCJtei53aWRnZXRzLk16UmVwZWF0LnJlZHJhdyJdLCJtYXBwaW5ncyI6IkFBQUEs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SUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxJQUFJQSxHQUFRQSxDQUFDQTtnQkFFYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsS0FBS0EsQ0FBQ0E7b0JBQ3RCQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDYkEsSUFBSUE7b0JBQ0FBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUViQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakJBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO3dCQUM3QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ25FQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDNUJBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxJQUFJQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFD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QUFLQTt3QkFDTkEsT0FBT0EsSUFBSUEsWUFBWUEsQ0FBQ0E7d0JBQ3hCQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDaEJBLEtBQUtBLENBQUNBO2dCQUNkQSxDQUFDQTtnQkFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2JBLE9BQU9BLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsQ0FBQ0E7WUFFTEEsQ0FBQ0E7WUFDREEsSUFBSUEsRUFBRUEsR0FBR0EsSUFBSUEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLElBQUlBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3pCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFdEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNwQ0EsSUFBSUEsR0FBR0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hCQSxNQUFNQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZkEsS0FBS0EsR0FBR0E7d0JBQ0pBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNmQSxLQUFLQSxDQUFDQTtvQkFDVkEsS0FBS0EsR0FBR0E7d0JBQ0pBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENB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QUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSx5Q0FBeUNBLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNqR0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUU5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1hBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNaQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDVkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1pBLENBQUNBO29CQUVEQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDL0JBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUU5QkEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FB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Q0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDWEEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ1pBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNWQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDWkEsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNwQ0EsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzlDQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUM1QkEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBRTlCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDWEEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ1pBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNWQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDWkEsQ0FBQ0E7b0JBRURBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNwQ0EsQ0FBQ0E7Z0JB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LEVBQUVBLENBQUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxZQUFZQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1lBQ3BDQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxZQUFZQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUJBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO1lBQ2RBLENBQUNBO1lBRURBLElBQUlBLEVBQUVBLEdBQUdBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBQzdCQSxJQUFJQSxHQUFHQSxHQUFHQSxRQUFRQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUNoQ0EsSUFBSUEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFFaENBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNUQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUUvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ1JBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBRTdCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDVEEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFFL0JBLFFBQVFBLEdBQUdBLFFBQVFBLElBQUlBLEtBQUtBLENBQUNBO1lBRTdCQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxDQUFDQSxRQUFRQSxJQUFJQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUNsR0EsQ0FBQ0E7UUExQmVaLGVBQVFBLFdBMEJ2QkE7UUFFREEsdUJBQThCQSxRQUFRQSxFQUFFQSxRQUFRQTtZQUM1Q2EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsS0FBS0EsSUFBSUEsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO1lBQ2pDQSxRQUFRQSxHQUFHQSxRQUFRQSxJQUFJQSxLQUFLQSxDQUFDQTtZQUM3QkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDN0VBLENBQUNBO1FBSmViLG9CQUFhQSxnQkFJNUJBO1FBRURBLGtCQUF5QkEsSUFBSUEsRUFBRUEsR0FBR0E7WUFDOUJjLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLFlBQVlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsa0JBQWtCQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxzQkFBc0JBLEVBQUVBLFVBQVNBLENBQUNBO29CQUN6RSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDQSxDQUFDQTtZQUNQQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDZEEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFSZWQsZUFBUUEsV0FRdkJBO1FBRURBLHNCQUE2QkEsUUFBUUEsRUFBRUEsSUFBSUE7WUFDdkNlLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBRWpDQSxJQUFJQSxRQUFRQSxHQUFHQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQUNBLFFBQVFBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBO1lBRW5DQSxJQUFJQSxDQUFDQSxHQUFRQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUN4Q0EsSUFBSUEsQ0FBQ0EsR0FBUUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDaERBLElBQUlBLENBQUNBLEdBQVFBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBO1lBRXZDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFDbkNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtZQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1lBRW5DQSxNQUFNQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxHQUFHQSxhQUFhQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFD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Q0E7b0JBQ3hCQSxJQUFJQSxXQUFXQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFFckJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQy9CQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDbERBLEdBQUdBLEtBQUtBLFNBQVNBLElBQUlBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUMvQ0EsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUVEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDdkJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDL0JBLElBQUlBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBO29CQUVyQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDL0JBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNoRUEsR0FBR0EsS0FBS0EsU0FBU0EsSUFBSUEsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQy9DQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBRURBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO2dCQUN2QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM5QkEsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxJQUFJQSxXQUFXQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFFckJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQy9CQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTs0QkFDekRBLEdBQUdBLEtBQUtBLFNBQVNBLElBQUlBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUMvQ0EsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUVEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDdkJBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBO1FBbkhNTCxzQkFBTUEsR0FBR0EsRUFFZkE7UUFvSExBLHNCQUFDQTtJQUFEQSxDQUFDQSxJQUFBdkU7SUF4SFlBLGtCQUFlQSxrQkF3SDNCQTtBQUVMQSxDQUFDQSxFQTdJTSxFQUFFLEtBQUYsRUFBRSxRQTZJUjtBQzdJRCxzQ0FBc0M7QUFDdEMsMkNBQTJDO0FBQzNDLCtCQUErQjtBQUMvQixtREFBbUQ7QUFJbkQsSUFBVSxFQUFFLENBb1hYO0FBcFhELFdBQVUsRUFBRTtJQUFDQSxVQUFNQSxDQW9YbEJBO0lBcFhZQSxpQkFBTUEsRUFBQ0EsQ0FBQ0E7UUFLTjZFLGVBQVFBLEdBQWFBLEVBQUVBLENBQUNBO1FBRW5DQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNwQkEsSUFBSUEsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDM0JBLElBQUlBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3JCQSxJQUFJQSxZQUFZQSxHQUFXQSxJQUFJQSxDQUFDQTtRQUNoQ0EsSUFBSUEsa0JBQWtCQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUU5QkEsSUFBSUEsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFTEEsb0JBQWFBLEdBQUdBLGFBQWFBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLHNCQUFlQSxHQUFHQSxTQUFTQSxDQUFDQTtRQUVyRkEsdUJBQXVCQSxHQUFHQTtZQUN0QkMsSUFBSUEsTUFBTUEsQ0FBQ0E7WUFFWEEsSUFBSUEsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFNUJBLHlEQUF5REE7WUFDekRBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDeEJBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2QkEsSUFBSUE7b0JBQ0FBLE1BQU1BLENBQUNBLG9CQUFhQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7WUFFREEsMkJBQTJCQTtZQUMzQkEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFOUJBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUVERCxxQkFBNEJBLE1BQWNBO1lBQ3RDRSxNQUFNQSxDQUFDQTtnQkFDSEEsS0FBS0EsRUFBRUEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0Esb0JBQWFBLENBQUNBLElBQUlBLElBQUlBO2dCQUNwR0EsSUFBSUEsRUFBRUEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0EsSUFBSUEsUUFBUUE7YUFDOURBO1FBQ0xBLENBQUNBO1FBTGVGLGtCQUFXQSxjQUsxQkE7UUFFREEsb0JBQW9CQSxLQUFhQTtZQUM3QkcsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JDQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSwrQkFBK0JBLENBQUNBLENBQUNBO1lBRXJEQSxJQUFJQSxZQUFZQSxHQUFHQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsSUFBSUEsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxZQUFZQSxDQUFDQSxJQUFJQSxJQUFJQSxRQUFRQSxDQUFDQTtvQkFDckNBLFlBQVlBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUM1Q0EsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1FBQ0xBLENBQUNBO1FBRURILGtCQUF5QkEsTUFBY0EsRUFBRUEsS0FBY0EsRUFBRUEsWUFBcUJBLEVBQUVBLFNBQWtCQTtZQUM5RkksTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDOUJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNSQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxjQUFjQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckNBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLCtCQUErQkEsQ0FBQ0EsQ0FBQ0E7Z0JBR3JEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxvQkFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxVQUFVQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdEJBLENBQUNBO2dCQUVEQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDN0NBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLE1BQU1BLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO2dCQUNyREEsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsRUFBRUEsQ0FBQ0EsU0FBU0EsSUFBSUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFdkVBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxZQUFZQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDekNBLFlBQVlBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBO2dCQUMxQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFFakRBLENBQUNBO1FBQ0xBLENBQUNBO1FBckJlSixlQUFRQSxXQXFCdkJBO1FBRURBLG1CQUEwQkEsSUFBWUE7WUFDbENLLE1BQU1BLENBQUNBLGVBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hDQSxDQUFDQTtRQUZlTCxnQkFBU0EsWUFFeEJBO1FBRURBLG1CQUEwQkEsS0FBd0JBO1lBQzlDTSxJQUFJQSxTQUFTQSxHQUFrQkEsS0FBS0EsQ0FBQ0E7WUFFckNBLEVBQUVBLENBQUNBLENBQU9BLGVBQVNBLFlBQVlBLE1BQU1BLENBQUNBO2dCQUFDQSxTQUFTQSxHQUFTQSxlQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUVuRkEsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsY0FBSUEsSUFBSUEsc0JBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLGVBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEVBQW5EQSxDQUFtREEsQ0FBQ0E7UUFDbEZBLENBQUNBO1FBTmVOLGdCQUFTQSxZQU14QkE7UUFHREEsc0NBQXNDQTtRQUN0Q0EsMkNBQTJDQTtRQUMzQ0EsK0JBQStCQTtRQUcvQkEsSUFBSUEsZUFBZUEsR0FBR0E7WUFDbEJBLGlCQUFpQkEsRUFBRUE7Z0JBQ2ZBLDBEQUEwREE7Z0JBQzFEQSx5REFBeURBO2dCQUN6REEsa0NBQWtDQTthQUNyQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDWEEsZ0JBQWdCQSxFQUFFQTtnQkFDZEEsd0RBQXdEQTtnQkFDeERBLGdEQUFnREE7Z0JBQ2hEQSx5QkFBeUJBO2FBQzVCQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNYQSxlQUFlQSxFQUFFQTtnQkFDYkEsdURBQXVEQTtnQkFDdkRBLHVEQUF1REE7Z0JBQ3ZEQSwyREFBMkRBO2dCQUMzREEseURBQXlEQTtnQkFDekRBLGlCQUFpQkE7YUFDcEJBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO1lBQ1hBLHFCQUFxQkEsRUFBRUE7Z0JBQ25CQSwwREFBMERBO2dCQUMxREEseUJBQXlCQTthQUM1QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDWEEsd0JBQXdCQSxFQUFFQTtnQkFDdEJBLHNEQUFzREE7Z0JBQ3REQSx1QkFBdUJBO2FBQzFCQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNYQSxlQUFlQSxFQUFFQTtnQkFDYkEsZ0VBQWdFQTthQUNuRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDWEEsMkJBQTJCQSxFQUFFQTtnQkFDekJBLHFEQUFxREE7Z0JBQ3JEQSwwQ0FBMENBO2FBQzdDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNYQSxlQUFlQSxFQUFFQTtnQkFDYkEsd0RBQXdEQTthQUMzREEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDWEEsY0FBY0EsRUFBRUE7Z0JBQ1pBLG9EQUFvREE7Z0JBQ3BEQSwwREFBMERBO2dCQUMxREEsMERBQTBEQTtnQkFDMURBLHlEQUF5REE7Z0JBQ3pEQSx3QkFBd0JBO2FBQzNCQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNYQSx5QkFBeUJBLEVBQUVBO2dCQUN2QkEsd0RBQXdEQTtnQkFDeERBLDJEQUEyREE7Z0JBQzNEQSxnQkFBZ0JBO2FBQ25CQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtTQUNkQTtRQUdEQSxJQUFJQSxpQkFBaUJBLEdBQUdBLFVBQUNBLEVBQUVBO1lBQ3ZCQSxNQUFNQSxDQUE0QkEsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBbUJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLGFBQUdBO2dCQUMzRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BCQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUM3QkEsV0FBQ0EsSUFBSUEsV0FBSUEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBZkEsQ0FBZUEsRUFDcEJBLFdBQUNBO3dCQUNHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO3dCQUNoQ0EsQ0FBQ0E7d0JBQ0RBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUM3QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBO2dCQUNEQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUMvQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDUEEsQ0FBQ0EsQ0FBQ0E7UUFFRkEsSUFBSUEsV0FBV0EsR0FBR0EsVUFBQ0EsQ0FBQ0E7WUFDaEJBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1pBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5QkEsSUFBSUEsT0FBT0EsR0FBR0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBRXBGQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxjQUFjQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtnQkFDdERBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO29CQUNsQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsR0FBR0Esb0JBQWFBLENBQUNBLENBQUNBO29CQUNqREEsYUFBYUE7b0JBQ2JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBRURBLEdBQUdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO2dCQUV6QkEsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDNUJBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFDaENBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQy9CQSxDQUFDQSxDQUFDQTtRQUVGQSxtQ0FBMENBLEVBQWNBO1lBQ3BETyxJQUFJQSxNQUFNQSxHQUFHQSxhQUFhQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQTtZQUNsQ0EsSUFBSUEsS0FBS0EsR0FBR0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDaENBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxFQUFFQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFFOUJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO29CQUN6QkEsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsR0FBR0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzFEQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLENBQUNBLEVBQUVBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLE1BQU1BLElBQUlBLEVBQUVBLENBQUNBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBO29CQUM1REEsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0E7b0JBQ2xDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxVQUFVQSxDQUFDQTtnQkFDN0NBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxPQUFPQSxHQUFHQSxpQkFBaUJBLENBQUNBO1lBQ25DQSxDQUFDQTtRQUNMQSxDQUFDQTtRQWhCZVAsZ0NBQXlCQSw0QkFnQnhDQTtRQUVEQSxtQkFBMEJBLElBUXpCQTtZQUNHUSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUNqQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDL0NBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLElBQUlBLElBQUlBLENBQUNBO1lBQ25DQSxzQkFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDeENBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLElBQUlBLENBQUNBO1lBQ3pDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUMzQkEsa0JBQWtCQSxHQUFHQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBO1lBRzdDQSxFQUFFQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxvQkFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9DQSxJQUFJQSxDQUFDQTtvQkFDREEsVUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0Esb0JBQWFBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3REEsQ0FBRUE7Z0JBQUFBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNUQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLENBQUNBO1lBQ0xBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLG9CQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDaERBLGVBQWVBLElBQUlBLFlBQVlBLEVBQUVBLENBQUNBO1lBQ3RDQSxDQUFDQTtRQUNMQSxDQUFDQTtRQTdCZVIsZ0JBQVNBLFlBNkJ4QkE7UUFFREE7WUFDSVMsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxJQUFJQSxVQUFVQSxDQUFDQTtnQkFDZkEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esc0JBQWVBLENBQUNBLENBQUNBLENBQUNBO29CQUNsQkEsVUFBVUEsR0FBR0Esc0JBQWVBLEdBQUdBLEdBQUdBLENBQUNBO29CQUNuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7d0JBQ2JBLFVBQVVBLElBQUlBLFlBQVlBLENBQUNBO29CQUMvQkEsVUFBVUEsR0FBR0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdDQSxDQUFDQTtnQkFFREEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFDN0JBO29CQUNJQSxVQUFVQSxFQUFFQSxlQUFlQTtvQkFDM0JBLGFBQWFBLEVBQUVBLFlBQVlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEdBQUdBLG9CQUFhQSxDQUFDQSxJQUFJQSxJQUFJQTtpQkFDdkVBLEVBQUVBO29CQUNDQSxpQkFBaUJBLEVBQUVBLElBQUlBO29CQUN2QkEsSUFBSUEsRUFBRUEsS0FBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsVUFBVUE7b0JBQzlCQSxPQUFPQSxFQUFFQTt3QkFDTEEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzVCQTtvQkFDREEsZUFBZUEsRUFBRUEsa0JBQWtCQTtpQkFDdENBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQUNBO29CQUNMQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLG9CQUFhQSxDQUFDQTt3QkFDNURBLFFBQVFBLENBQUNBLG9CQUFhQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDL0VBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDZkEsSUFBSUEsT0FBT0EsR0FBR0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBRXBGQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxjQUFjQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTt3QkFDdERBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsR0FBR0Esb0JBQWFBLENBQUNBLENBQUNBO3dCQUVyREEsQ0FBQ0E7d0JBRURBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO3dCQUU3QkEsR0FBR0EsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBRXhCQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDL0JBLENBQUNBO29CQUNEQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFD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TUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQ2RBLENBQUNBO1lBQ0xBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO2dCQUN6QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDdEJBLENBQUNBO1lBQ0xBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQkEsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBOzRCQUM1QkEsRUFBRUEsRUFBRUEsUUFBUUE7NEJBQ1pBLElBQUlBLEVBQUVBLEtBQUtBO3lCQUNkQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFCQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFDcENBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsSUFBSUEsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDWEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3BCQSxPQUFPQSxHQUFHQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDM0JBLElBQUlBO3dCQUNBQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDdkJBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUJBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUM5Q0EsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUNWQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDcENBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FB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SUFBSUEsSUFBSUEsQ0FBQ0E7UUFFNURBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLFNBQVNBLENBQUNBLE1BQU1BLElBQUlBLE9BQU9BLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLFFBQVFBLElBQUlBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBO1FBRW5JQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNiQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNiQSxDQUFDQTtRQUVEQSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVsQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLENBQUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQ0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsTUFBTUEsR0FBR0EsSUFBSUEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFOUJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxJQUFJQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcERBLEVBQUVBLENBQUNBLENBQU9BLEVBQUdBLENBQUNBLE1BQU1BLENBQUNBO29CQUFDQSxRQUFRQSxDQUFDQTtnQkFDL0JBLE1BQU1BLG1CQUFtQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDckNBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBO1lBRTFCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLElBQUlBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUVkQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsVUFBVUEsSUFBSUE7d0JBQy9CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs0QkFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztnQ0FDckIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO2dDQUMxQixTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQzt3QkFDdEMsQ0FBQzt3QkFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzVDLENBQUMsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkJBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO3dCQUM1REEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBOzRCQUM1QkEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7d0JBQzVEQSxJQUFJQTs0QkFDQUEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3pFQSxDQUFDQTtvQkFFREEsTUFBTUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0Es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QU1BLEdBQUdBLFlBQVlBLENBQUNBO1lBQ3JDQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNsRUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBRURQOzs7OztVQUtEQTtRQUNDQSx3QkFBR0EsR0FBSEEsVUFBT0EsSUFBb0JBLEVBQUVBLEtBQVdBO1lBQ3BDUSxJQUFJQSxLQUFLQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUVqQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsRUFBS0EsQ0FBQ0E7WUFFbENBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO2dCQUN0Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFcEVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTs7UUFDRFI7Ozs7O1VBS0RBO1FBQ0NBLDRCQUFPQSxHQUFQQSxVQUFRQSxJQUFzQ0EsRUFBRUEsS0FBV0E7WUFDdkRTLElBQUlBLEtBQUtBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBO1lBRWpDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxL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QUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNwREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsR0FBR0EsQ0FBQ0EsS0FBZUEsQ0FBQ0EsSUFBSUEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO3dCQUNoRUEsQ0FBQ0E7b0JBQ0xBLENBQUNBO2dCQUNMQSxDQUFDQTtnQkFFREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7b0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFlQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDaEVBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFHSkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7b0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFLQSxLQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDL0NBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFFRHBDOzs7O1VBSURBO1FBQ0NBLDZCQUFRQSxHQUFSQSxVQUFTQSxJQUFPQTtZQUNacUMsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLENBQUNBO1FBRURyQzs7OztVQUlEQTtRQUNDQSxnQ0FBV0EsR0FBWEEsVUFBWUEsR0FBV0E7WUFDbkJzQyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEJBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1lBQ3BDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsMkJBQTJCQSxDQUFDQTtZQUN0Q0EsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFRHRDOzs7O1VBSURBO1FBQ0NBLDRCQUFPQSxHQUFQQSxVQUFRQSxJQUFPQSxJQUFZdUMsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFN0R2Qzs7OztVQUlEQTtRQUNDQSxnQ0FBV0EsR0FBWEEsVUFBWUEsSUFBT0EsSUFBWXdDLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3JFeEM7OztVQUdEQTtRQUNDQSw0QkFBT0EsR0FBUEE7WUFDSXlDLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1lBRVhBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO2dCQUN0Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFL0NBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1FBQ2JBLENBQUNBO1FBRUR6Qzs7O1VBR0RBO1FBQ0NBLDBCQUFLQSxHQUFMQTtZQUNJMEMsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsVUFBVUEsQ0FBSUEsSUFBSUEsRUFBRUEsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFM0RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO2dCQUN0Q0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFbERBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQUVEMUM7Ozs7VUFJREE7UUFDQ0EsK0JBQVVBLEdBQVZBLFVBQVdBLEdBQW9CQTtZQUMzQjJDLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxH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QUNBLENBQUNBO29CQUNUQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQTt3QkFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO2dCQUN2RUEsQ0FBQ0E7Z0JBQUNBLElBQUlBO29CQUNGQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7WUFDM0RBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ2xCQSxDQUFDQTtRQUVESCwrQkFBTUEsR0FBTkE7WUFDSUksSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFFOUJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNSQSxJQUFJQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFFZkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7b0JBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUVuREEsSUFBSUEsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FB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QVFBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLFFBQVFBLElBQUlBLFFBQVFBLENBQUNBLFFBQVFBLElBQVVBLElBQUlBLENBQUNBLGFBQWFBLENBQUVBLENBQUNBLFFBQVFBLElBQVVBLElBQUlBLENBQUNBLGFBQWFBLENBQUVBLENBQUNBLElBQUlBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBO1lBRzdMQSxJQUFJQSxDQUFDQSxRQUFTQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsUUFBU0EsQ0FBQ0EsVUFBVUEsR0FBR0EsZ0JBQWdCQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUUzREEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7WUFFdENBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1lBRTVCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUUzQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLEVBQUVBLENBQUNBO1lBRXhCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hEQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLENBQUNBO1lBRURBLEVBQUVB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QSxJQUFJQSxPQUFPQSxZQUFZQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkNBLE1BQU1BLENBQWFBLE9BQVFBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQzdDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxPQUFPQSxPQUFPQSxJQUFJQSxRQUFRQSxJQUFJQSxLQUFLQSxJQUFVQSxPQUFRQSxJQUFVQSxPQUFRQSxDQUFDQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0dBLE1BQU1BLENBQWNBLE9BQVFBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3REQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxJQUFJQSxPQUFPQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekNBLE1BQU1BLENBQVVBLE9BQVFBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlDQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLENBQUNBO1FBQ0xBLENBQUNBO1FBRVNmLHlCQUFRQSxHQUFsQkEsVUFBbUJBLElBQVNBO1lBRXhCZ0IsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDbENBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENB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
