/// <reference path="TSD/JQuery.d.ts" />
/// <reference path="TSD/Promise.d.ts" />

if (typeof this.jQuery === "undefined") {
    throw new Error("jQuery not present");
}

function isDef(b) {
    return typeof b != "undefined";
};

declare var window: Window;
declare var global: any;
declare var CBool: (Cosa: any) => boolean;
declare var Symbol: (name: string) => symbol | string;

namespace mz {
    export interface IWidget {
        DOM: JQuery;
    }

    export interface Dictionary<V> {
        [key: string]: V;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Size {
        width: number;
        height: number;
    }

    export interface IGenericCallback {
        (...Args: any[]): void;
    }
    export interface IModuleCallback {
        (...Modules: any[]): void;
    }

    export var globalContext: any = (window as any) || typeof global != "undefined" && global;




    (function() {
        let UID = 1;
        globalContext.Symbol = globalContext.Symbol || function(a) {
            return `[[${a}-${UID++}]]`;
        }
    })();

    export var _debug = (window as any)._debug || window.location.search.match('(\\?|&)mz-debug') !== null;

    var scripts = document.getElementsByTagName('script'),
        test, mzcorePath, i, ln, scriptSrc, match, lang;
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
    export var core_path = (mzcorePath || '').toString();

    (core_path.substr(-1) !== '/') && (core_path += '/');




    export function alias(clave, ruta) {
        (ruta.substr(-1) !== '/') && (ruta += '/');
        alias_routes[clave] = ruta;
    };

    var alias_routes = {
        mz: core_path
    };

    export function getPath(path: string, root?: string) {
        var io = 0,
            clave = null,
            base = root || core_path;

        (base.substr(-1) !== '/') && (base += '/');

        if (path) {
            if (path.substr(0, 1) == '@' && (io = path.indexOf('/')) != -1 && (clave = path.substr(1, io - 1)) && alias_routes.hasOwnProperty(clave)) {
                path = path.replace('@' + clave + '/', alias_routes[clave]);
            }

            return path.substr(0, 2) in { './': 1, '~/': 1 } ? base + path.substr(2) : path;
        }

        return base;
    };



    // element helpers
    
    export function getElementPosition(element: Element | JQuery) {

        var elm: HTMLElement = element as any;

        if (element instanceof jQuery)
            elm = element[0];

        var x = 0;
        var y = 0;


        if (elm) {
            x = elm.offsetLeft; // set x to elm’s offsetLeft
            y = elm.offsetTop; // set y to elm’s offsetTop

            elm = elm.offsetParent as HTMLElement; // set elm to its offsetParent

            //use while loop to check if elm is null
            // if not then add current elm’s offsetLeft to x
            //offsetTop to y and set elm to its offsetParent
            while (elm != null) {
                x = (x | 0) + elm.offsetLeft | 0;
                y = (y | 0) + elm.offsetTop | 0;
                elm = elm.offsetParent as HTMLElement;
            }
        }
        return {
            x: x,
            y: y
        };
    };

    export const emptyFn = function() { };

    export const oldCopy = function(b, c) {
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
    
    /**
    Copia todas las propiedades de los parametros dentro del primer parametro. Si se provee un solo parametro, hace una copia.

    La copia se realiza en orden

    <code>
    mz.copy(a, b, c)

    //a <- b copia el contenido de B en A
    //a <- c luego copia el contenido de C en A
    </code>
    */
    //export function copy( Destination: Object, ...Sources: Object[] ): Object;
    
    export function copy<T>(Destination: T): T;
    export function copy<T, V>(Destination: T, Source: V): T & V;
    export function copy<T, V, V1>(Destination: T, Source: V, Source1: V1): T & V & V1;
    export function copy<T, V, V1, V2>(Destination: T, Source: V, Source1: V1, Source2: V2): T & V & V1 & V2;
    export function copy<T, V, V1, V2, V3>(Destination: T, Source: V, Source1: V1, Source2: V2, Source3: V3): T & V & V1 & V2 & V3;
    export function copy<T>(Destination: T): T {
        var dest = arguments[0] || {};

        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                dest = oldCopy(dest, arguments[i]);
            }
            return dest;
        }

        if (arguments.length == 1) {
            return oldCopy({}, arguments[0]);
        }

        return dest;
    };


    export function mapXInto(propiedades: string[], destino: any, ...n_args: any[]) {
        if (arguments.length) {
            for (var i = 1; i < arguments.length; i++) {
                for (var prop in propiedades) {
                    if (arguments[i] && (propiedades[prop] in arguments[i]))
                        destino[propiedades[prop]] = arguments[i][propiedades[prop]];
                }
            }
        }

        return destino;
    };

    export function mapInto(destino: any, ...n_args: any[]) {
        var argumentos = Array.prototype.slice.call(arguments);
        argumentos.unshift(Object.keys(destino));
        return mapXInto.apply(null, argumentos);
    };

    export function isIterable(a) {
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

    export function trim(text) {
        try {
            return String(text.toString()).trim();
        } catch (ignored) {
            return "";
        }
    }

    var contador_doms = 0;

    export function getDOMID() {
        return "mz-elem-" + (contador_doms++);
    }

    export function genUID() {
        return (contador_doms++);
    }

    export const intval = mz.globalContext.intval = function(mixed_var, base?: number): number {
        var tmp;

        var type = typeof (mixed_var);

        if (type === 'boolean') {
            return +mixed_var;
        } else if (type === 'string') {
            tmp = parseInt(mixed_var, base || 10);
            return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
        } else if (type === 'number' && isFinite(mixed_var)) {
            return mixed_var | 0;
        } else {
            return 0;
        }
    }

    console.log('MZCORE: /--==<{[One Script To Rule Them All ಠ_ಠ]}>==--/');

    export const CBool = mz.globalContext.CBool = function(val): boolean {
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

        if (intval(val) != 0)
            return true;

        return false;
    }

    var theQueryString: Dictionary<string> = {};

    window.location && window.location.search.toString().replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) {
            theQueryString[$1] = $3;
            return $0;
        }
    );

    /**
	Obtiene el valor de la clave del query string

	@method queryString
	@param {String} key
	*/
    export const queryString = function(key): string {
        if (key in theQueryString)
            return theQueryString[key];
        return null;
    }

    /**
	Devuelve un valor booleano en base a la expresion. Si __expr__ es una función, la llama.

	@method readBool
	@param {Expression} expr
	*/
    export const readBool = function(cosa, datos, datos2): boolean {
        if (typeof cosa == 'function')
            return !!cosa(datos, datos2);
        return !!cosa;
    }

    /**
	Devuelve un valor tipo string en base a la expresion. Si __expr__ es una función, la llama.

	@method readString
	@param {Expression} expr
	*/
    export const readString = function(cosa, datos, datos2): string {
        if (typeof cosa == 'function') {
            var a = cosa(datos, datos2);
            if (a != null) return '' + a;
            return '';
        }
        return '' + isDef(cosa) && cosa !== null ? cosa : '';
    }

    /**
	Devuelve un valor en base a la expresion. Si __expr__ es una función, la llama.

	@method readVar
	@param {Expression} expr
	*/
    export const readVar = function(cosa, datos, datos2): any {
        if (typeof cosa == 'function')
            return cosa(datos, datos2);
        return cosa;
    }

    /**
	Crea un delayer para la función

	@method delayer
	@param {Function} callback
	@param {Int} defTimeout
	@return {Function} FunctionDelayer
	*/
    export const delayer = function <T>(fn: T, defTimeout: number, thisp?) {
        var timer = null;
        defTimeout = defTimeout || 16;

        var ret: T & {
            now: T;
            cancel: () => void;
        } = function() {
            timer && clearTimeout(timer);
            var a = arguments;
            thisp = thisp || this;
            timer = setTimeout(function() {
                (fn as any).apply(thisp || null, a);
                timer = null;
            }, defTimeout);
            return timer;
        } as any;

        ret.now = function() {
            timer && clearTimeout(timer);
            timer = null;
            return (fn as any).apply(thisp || null, arguments);
        } as any;

        ret.cancel = function() {
            timer && clearTimeout(timer);
            timer = null;
        }

        return ret;
    }

    /**
    Debounces the current call until the next frame

    @method delayer
    @param {Function} fn
    @return {Function} FunctionDelayer
    */
    export const screenDelayer = function <T>(fn: T, thisp?) {
        var timer = null;

        var ret: T & {
            now: T;
            cancel: () => void;
        } = function() {
            timer && cancelAnimationFrame(timer);
            var a = arguments;
            thisp = thisp || this;
            timer = requestAnimationFrame(function() {
                (fn as any).apply(thisp || null, a);
                timer = null;
            });
            return timer;
        } as any;

        ret.now = function() {
            timer && cancelAnimationFrame(timer);
            timer = null;
            return (fn as any).apply(thisp || null, arguments);
        } as any;

        ret.cancel = function() {
            timer && cancelAnimationFrame(timer);
            timer = null;
        }

        return ret;
    }

    export const traspose = function(a) {
        return Object.keys(a[0]).map(function(c) {
            return a.map(function(r) {
                return r[c];
            });
        });
    }

    /**
	Obtiene el valor del Performance Counter

	@method now
	@return {Number} PerformanceCounter
	*/
    export const now = 'performance' in window && window.performance.now ?
        function() {
            return window.performance.now()
        } :
        function() {
            return (new Date()).getTime()
        };

    export const blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    export const transformTag = null;

    export namespace data.order {

        export function null_arriba(a, b, campo) {
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
        export function null_abajo(a, b, campo) {
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
        export function build(elems) {
            if (typeof elems == 'function') return elems;

            var null_abajo = this.null_abajo,
                null_arriba = this.null_arriba;

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

            return function(a, b) {
                var tmp = 0;

                for (var i in elems) {
                    if (typeof elems[i] == "string") {
                        tmp = null_abajo(a, b, elems[i]);
                    } else {
                        if (elems[i].null_abajo) {
                            tmp = null_abajo(a, b, elems[i].campo);
                        } else {
                            tmp = null_arriba(a, b, elems[i].campo);
                        }
                        if (elems[i].invertir)
                            tmp *= -1;
                    }
                    if (tmp != 0)
                        return tmp;
                }

                return tmp;
            }
        }
    }



    export var hardCodedFiles: Dictionary<string> = {};

    export function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    var cssCargados = {};

    export function loadCss(url: string) {
        url = getPath(url);

        if (url in cssCargados) return cssCargados[url];

        var estilos = document.getElementsByTagName('link'),
            i, ln;

        for (i = 0, ln = estilos.length; i < ln; i++) {
            if (estilos[i].rel == 'stylesheet' && estilos[i].href.split('?')[0] == url) return;
        }

        if ('createStyleSheet' in document) {
            return cssCargados[url] = (document as any).createStyleSheet(url);
        } else {
            var style = $("<link rel='stylesheet' href='" + url + "' type='text/css' />");
            //$(function () {
            style.appendTo($("head"))
            //});
            return cssCargados[url] = style;
        }
    }

    export function fnInfo(fn) {
        var fnRegex = /^function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;
        var matches = fn.toString().match(fnRegex);
        return {
            params: matches[1].split(","),
            body: matches[2]
        };
    }

    export function compileFilter<T>(filter: (element: T) => boolean): (elements: T[]) => T[] {
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
            //"}"
        ].join("");

        tpl = tpl.replace(/\$filter\$/gi, filterBody);
        tpl = tpl.replace(/\$item\$/gi, filterInfo.params[0]);
        tpl = tpl.replace(/\$args\$/gi, filterInfo.params[1]);

        var fn: any = new Function("_items,_args", tpl);
        fn.displayName = fn.name = "compiledFilter";
        return fn;
    }

    export function getWindowSize(): Size {
        var winW = 630,
            winH = 460;
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
    };


    var uid = 0;
    export function globalCallback(cb: Function) {
        uid++;
        mz["__" + uid] = cb;
        return "mz.__" + uid;
    }

    export function buscarArgumentoTipo(tipo, argu) {
        var args = argu || arguments.callee.caller.arguments;
        if (typeof tipo == 'string') {
            for (var i in args) {
                if (typeof args[i] == tipo) {
                    return args[i];
                }
            }
        } else if (typeof tipo == 'function') {
            for (var i in args) {
                if (args[i] instanceof tipo) {
                    return args[i];
                }
            }
        }
    }
}