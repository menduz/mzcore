

(function (window, undefined) {
    window['console'] = window['console'] || { log: function () { } };

    window['isDef'] = function (b) {
        return b !== undefined || typeof b != "undefined";
    }

    var mzcore = function (array) {
        return new mzcore.fn.init(array);
    };

    mzcore.fn = mzcore.prototype = {
        constructor: mzcore,
        init: function (array) {

        }
    }

    mzcore.fn.init.prototype = mzcore.fn;


    /* Simple JavaScript Inheritance
    * By John Resig http://ejohn.org/
    * MIT Licensed.
    */
    // Inspired by base2 and Prototype
    var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    mzcore.class = function () { };

    // Create a new Class that inherits from this class
    mzcore.class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    mzcore.ext = function (clase, arg1, arg2, undefined) {
        var clase_padre = null;
        var fn_extendedora = null;

        if (typeof arg2 !== undefined && mzcore.tieneCampo(arg1, "extend")) {
            clase_padre = arg1;
            fn_extendedora = arg2;
        } else {
            clase_padre = mzcore.class;
            fn_extendedora = arg1;
        }

        if (clase in mzcore) {
            throw "ERROR: Ya existe " + clase + " en mzcore";
        }

        if (typeof fn_extendedora === "function") {
            mzcore[clase] = clase_padre.extend(fn_extendedora());
        } else {
            mzcore[clase] = clase_padre.extend(fn_extendedora);
        }

        return mzcore[clase];
    }

    mzcore.fmt = (function () {
        var tokenRegex = /\{([^\}]+)\}/g,
                objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
                replacer = function (all, key, obj) {
                    var res = obj;
                    key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                        name = name || quotedName;
                        if (res) {
                            if (name in res) {
                                res = res[name];
                            }
                            typeof res == "function" && isFunc && (res = res());
                            res instanceof Date && isFunc && (res = format_date_time(new Date(res)));
                        }
                    });
                    res = (res == null || res == obj ? all : res) + "";
                    return res;
                };
        return function (str, obj) {
            return String(str).replace(tokenRegex, function (all, key) {
                return replacer(all, key, obj);
            });
        };
    })();

    mzcore.tieneCampo = function (obj, campo) {
        //return Object.prototype.hasOwnProperty.apply(obj || {}, campo);


        if (obj === undefined || obj == null || campo === undefined || campo == null)
            return false;

        if (obj.hasOwnProperty(campo) && obj[campo] !== undefined && obj[campo] != null)
            return true;

        return false;

    };

    mzcore.copy = function (b, c) {
        b = b || {};
        c = c || {};

        function extend(a, b) {
            if (mzcore.tieneCampo(Object.prototype, "__lookupGetter__")) {
                for (var i in b) {
                    var g = b.__lookupGetter__(i),
                        s = b.__lookupSetter__(i);

                    if (g || s) {
                        if (g)
                            a.__defineGetter__(i, g);
                        if (s)
                            a.__defineSetter__(i, s);
                    } else {
                        a[i] = b[i];
                    }
                }
            } else {
                for (var i in b) {
                    a[i] = b[i];
                }
            }
            return a;
        }

        b = extend(b, c);

        if (c.hasOwnProperty && c.hasOwnProperty('toString') && (typeof c.toString != 'undefined') && (b.toString !== c.toString))
            b.toString = c.toString;
        return b;
    }

    mzcore.isIterable = function (a) {
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

    mzcore.add_prop = function (nombre, obj) {
        if (nombre in mzcore)
            mzcore[nombre] = mzcore.copy(mzcore[nombre], obj);
        else
            mzcore[nombre] = obj;
    }

    mzcore.Iterable = mzcore.arrayize = function (a) {
        if (!mzcore.isIterable(a))
            return [a];
        return a;
    }

    mzcore.trim = function (text) {
        try {
            return String(text.toString()).trim();
        } catch (ignored) {
            return "";
        }
    }

    window.intval = mzcore.intval = function (mixed_var, base) {
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



    window.CBool = mzcore.CBool = function (val) {
        if (!val || val == null || val == undefined)
            return false;

        if (intval(val) != 0)
            return true;

        return false;
    }

    mzcore.queryString = function (key) {
        var hu = decodeURI(window.location.search.substring(1));
        var gy = hu.split("&");
        for (i = 0; i < gy.length; i++) {
            ft = gy[i].split("=");
            if (ft[0].toLocaleLowerCase() == key.toLocaleLowerCase()) {
                return ft[1];
            }
        }
        return null;
    }

    mzcore.test = function (fn) {
        try { fn(); }
        catch (e) { return false; }
        return true;
    }

    mzcore.test_until = function (fn) {
        var func = mzcore.Iterable(fn);

        for (var i in func) {
            try {
                if (fn()) return true;
            } catch (e) {
                return false;
            }
        }

        return false;
    }

    mzcore.SoportaLocalStorage = (function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null && window['JSON'] != null;
        } catch (e) {
            return false;
        }
    })();

    mzcore.browser_caps = {
        localstorage: (function () {
            try {
                localStorage.setItem(mod, mod);
                localStorage.removeItem(mod);
                return true;
            } catch (e) {
                return false;
            }
        })(),

        sessionstorage: (function () {
            try {
                sessionStorage.setItem(mod, mod);
                sessionStorage.removeItem(mod);
                return true;
            } catch (e) {
                return false;
            }
        })(),

        webworkers: (function () {
            return !!window.Worker;
        })(),

        hashchange: (function () {
            return /*isEventSupported('hashchange', window) &&*/(document.documentMode === undefined || document.documentMode > 7);
        })()
    }

    window.mz = window.mzcore = mzcore;

})(window);

mzcore.add_prop("json", {
    leer_dates: function (json) {
        var out;

        if (json instanceof Array)
            out = new Array();
        else
            out = {};

        for (var i in json) {
            if (typeof json[i] == "string") {
                if (json[i].indexOf("/Date(") == 0 && json[i].lastIndexOf(")/") == (json[i].length - 2)) {
                    out[i] = mzcore.date.parse(json[i]);
                } else {
                    out[i] = json[i];
                }
            } else {
                if (mzcore.isIterable(json[i])) {
                    out[i] = mzcore.json.leer_dates(json[i]);
                } else {
                    out[i] = json[i];
                }
            }
        }
        return out;
    }
});



(function(){
    var callbacks = {};
    var callbacks_once = {};
    var xhrs = {};

    var enviar_dato = function(url, data){
        var dato = isDef(data) ? data : null;
        
        if(dato != null || mzcore.ls.has("_mzcore_carga_" + url)){
            if(dato != null)
                mzcore.ls.set("_mzcore_carga_" + url, dato);
            else
                dato = mzcore.ls.get("_mzcore_carga_" + url);

            var a_mandar = $.extend(true, {}, dato);

            for(var i in callbacks[url])
                callbacks[url][i](a_mandar);

            for(var i in callbacks_once[url])
                callbacks_once[url][i](a_mandar);

            if(isDef(data))
                callbacks_once[url] = [];
        }
    }

    var data_load = function(url, data){
        try {
            if(url in xhrs)
                if(xhrs[url] != null)
                    xhrs[url].abort();
        } catch (e) {
        
        }

        xhrs[url] = $.postJSON(url, data || {}, function(recv){
            enviar_dato(url, recv);
            xhrs[url] = null;
        });

        xhrs[url].error(function(){
            xhrs[url] = null;
        });

        return xhrs[url];
    }

    data_load.bind = function(url, callback){
        if(url in callbacks)
            callbacks[url].push(callback);
        else
            callbacks[url] = [callback];

        if(mzcore.ls.has("_mzcore_carga_" + url))
            callback(mzcore.ls.get("_mzcore_carga_" + url));
        else
            data_load(url);
    }

    data_load.once = function(url, callback){
        if(url in callbacks_once)
            callbacks_once[url].push(callback);
        else
            callbacks_once[url] = [callback];

        if(mzcore.ls.has("_mzcore_carga_" + url))
            callback(mzcore.ls.get("_mzcore_carga_" + url));
        else
            data_load(url);

    }

    data_load.get = function(url){
        return mzcore.ls.get("_mzcore_carga_" + url);
    }

    data_load.has = function(url){
        return mzcore.ls.has("_mzcore_carga_" + url);
    }

    data_load.set = function(url, data){
        enviar_dato(url, data);
    }

    data_load.load = function(url, data){
        return data_load(url, data);
    }

    mzcore.add_prop("carga", data_load);
})();

mzcore.add_prop("array", {
    last: function (array) {
        var res = array.pop();
        array.push(res);
        
        return res;
    }
});

mzcore.add_prop("ga", {
    track: function (pagina) {
        if(mzcore.tieneCampo(window,"pageTracker"))
            pageTracker._trackPageview(pagina);
    }
});

(function () {
    var _estilos_guardados = {};

    var _hoja_estilo = null;

    var _acum_estilos = (Math.random() * 32565) | 0;

    var _reescribir_css = function(){
        var buffer = '';
        for(var i in _estilos_guardados){
            buffer += i + ' {';

            for(var e in _estilos_guardados[i]){
                buffer += e + ': ' + _estilos_guardados[i][e] + ';';
            }

            buffer += '}';
        }

        //_hoja_estilo.html(buffer);
        _hoja_estilo && _hoja_estilo.remove();
        _hoja_estilo = $("<style>"+buffer+"</style>").appendTo($("body"));
    }

    var _css = function(arg1, arg2){
        //if(_hoja_estilo == null){
        //    _hoja_estilo = $("<style></style>").appendTo($("body"));
        //}

        var nueva = false;

        var nombre_clase = '';
        

        if(!isDef(arg2)){
            if(mzcore.isIterable(arg1)){
                var array_clases = [];

                for(var i in arg1){
                    if(typeof arg1[i] != "object"){
                        nueva = true;
                        break;
                    }
                    mzcore.copy(_estilos_guardados[i] = (_estilos_guardados[i] || {}), arg1[i]);
                    array_clases.push(i);
                }
                nombre_clase = array_clases.join(" ");
            }

            if(nueva === true){
                nombre_clase = '.-mzcss-' + (_acum_estilos++).toString(32);
                _css(nombre_clase, arg1);
            }
        } else {
            nombre_clase = arg1;
            mzcore.copy(_estilos_guardados[arg1] = (_estilos_guardados[arg1] || {}), arg2);
        }
        _reescribir_css();

        if(nombre_clase.indexOf(".") != -1){
            return nombre_clase.replace(".", "");
        } else {
            return null;
        }
    }

    _css.clear = function(arg1){
        if(isDef(arg1)){
            _estilos_guardados[arg1] = {};
        } else {
            _estilos_guardados = {};
        }
        _reescribir_css();
    }

    mzcore.add_prop("css", _css);
})();

Date.prototype.add = function (sInterval, iNum){
  var dTemp = this;
  if (!sInterval || iNum == 0) return dTemp;
  switch (sInterval.toLowerCase()){
    case "ms":
      dTemp.setMilliseconds(dTemp.getMilliseconds() + iNum);
      break;
    case "s":
      dTemp.setSeconds(dTemp.getSeconds() + iNum);
      break;
    case "mi":
    case "m":
      dTemp.setMinutes(dTemp.getMinutes() + iNum);
      break;
    case "h":
      dTemp.setHours(dTemp.getHours() + iNum);
      break;
    case "d":
      dTemp.setDate(dTemp.getDate() + iNum);
      break;
    case "mo":
      dTemp.setMonth(dTemp.getMonth() + iNum);
      break;
    case "y":
      dTemp.setFullYear(dTemp.getFullYear() + iNum);
      break;
  }
  return dTemp;
}

Array.where = function (a,cb) {
    var coll = new Array();

    for (var i in a) {
        if (cb(a[i]))
            coll.push(a[i]);
    }

    return coll;
};

Array.indexOf = function (a, what, i) {
    i = i || 0;

    var L = a.length;

    while (i < L) {
        if (a[i] === what)
            return i;
        ++i;
    }

    return -1;
};

Array.single = function (a, what) {
    for(var i in a)
        if (a[i] === what)
            return a[i];

    return null;
};

mzcore.add_prop("date", {
    parse: function(date){
        function parseJsonDate(d){
            if(!d) return null;
            if(d instanceof Date)
                return d;

            //return eval("new " + d.substr(1).replace("/",""));

            if (d.indexOf("/Date(") == 0 && d.lastIndexOf("/") == (d.length - 1))
                return new Date(intval(d.substr(6)));
    
            return new Date(d);
        }

        function convertirAFechaHora(s) {    
            if(s instanceof Date)
                return s;

            var mes = s.substring(3, 5);
            var dia = s.substring(0, 2);
            var anio = s.substring(6, 10);
            var hora = s.substring(11, 13);
            var min = s.substring(14, 16);
    
            var date = new Date(mes + "/" + dia + "/" + anio + " " + hora + ":" + min);
    
            return date;
        }

        function convertirAFecha(s) {
            if(s instanceof Date)
                return s;

            var mes = s.substring(3, 5);
            var dia = s.substring(0, 2);
            var anio = s.substring(6, 10);
    
            var date = new Date(mes + "/" + dia + "/" + anio + " 00:00");
            return date;
        }

        if(date == null)
            return null;

        if(date instanceof Date)
            return date;
        
        if(typeof date == "string"){
            date = $.trim(date);
            if (date.indexOf("/Date(") == 0 && date.lastIndexOf("/") == (date.length - 1)) {
                return parseJsonDate(date);
            } else if(date.indexOf("/") != -1){
                return convertirAFechaHora(date);
            } if(date.indexOf("UTC") != -1){
                date = date.replace(/-/, "/").replace(/-/, "/");
                date = date.replace(/T/, " ").replace(/Z/, " UTC");
                date = date.replace(/([\+-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
                return new Date(date);
            } else {
                return new Date(date);
            }
        } else if(typeof date == "number"){
            return new Date(date);
        }
    
        return date;
    },
    add: function(date, intervalo, numero){
        return this.parse(date).add(intervalo, numero);
    },
    fmt_date: function (obj_date) {
        if (!(obj_date instanceof Date)) {
            obj_date = parseDate(obj_date);
        }

        var d = obj_date.getDate();
        var m = obj_date.getMonth() + 1;
        var a = obj_date.getFullYear();

        if (m < 10) m = "0" + m.toString();
        if (d < 10) d = "0" + d.toString();
    
        return d.toString() + '/' + m.toString() + '/' + a.toString();
    },
    fmt_time: function(obj_date,segundos) {
        if (!(obj_date instanceof Date)) {
            obj_date = parseDate(obj_date);
        }
    
    

        var hr  = obj_date.getHours();
        var min = obj_date.getMinutes();
        var seg = obj_date.getSeconds();
    
        if (min < 10) min = "0" + min.toString();
        if (hr < 10) hr = "0" + hr.toString();
        if (seg < 10) seg = "0" + seg.toString();
    
        segundos = segundos || false;
    
        return hr.toString() + ':' + min.toString() + (segundos != false ? ":" + seg.toString() : '');
    },
    fmt_date_time: function(obj_date,segundos) {
        segundos = segundos || false;
        return this.fmt_date(obj_date) + ' ' + this.fmt_time(obj_date,segundos);
    }
});

mzcore.add_prop("despacho", {
    calcular_teorico: function (segundos, hora_inicio) {
        var DiaInicio = null;

        if (isDef(hora_inicio)) {
            if (hora_inicio instanceof Date)
                DiaInicio = new Date(hora_inicio);
            else {
                DiaInicio = new Date();
                DiaInicio.setHours(0);
                DiaInicio.setMinutes(0);
                DiaInicio.setSeconds(0);
                DiaInicio.setMilliseconds(0);
                DiaInicio.setSeconds(intval(hora_inicio));
            }
        }

        return DiaInicio.add("s", intval(segundos));
    }
});