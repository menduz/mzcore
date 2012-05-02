/// <reference path="mzcore.js" />

// Datos Persistentes: LocalStorage, caché de variables.
// SINGLETON


/* Autor:   Agustin Mendez */
/* Desc:    Clase singleton que detecta si hay localstorage y 
            guarda datos en él. Si no hay localstorage se fija
            si hay local DB. y guarda los datos ahi. 
            ,________________,___________________________________________________,
   Métodos: |_____Método_____|__________________Desc_____________________________|
            | get(key)       | devuelve el dato. si no existe devuelve null.     |
            | set(key, dato) | setea el dato. dato = null -> borra el registro.  |
            | clear()        | Vacia todo el caché.                              |
            |________________|___________________________________________________|
   
   Propiedades: bool soportado; -> Soporta local storage?
*/

var DatosPersistentes = mz.ls = (function () {
    //Propiedades y cosas privadas
    var Datos = {};

    //Métodos publicos:
    return {
        set: function(key, data) {
            Datos[key] = data;
            if (mz.browser_caps.localstorage)
                localStorage.setItem(key, JSON.stringify(data));
        },
        get: function(key) {
            try {
                if (mz.browser_caps.localstorage) {
                    if (localStorage.getItem(key) == null || !localStorage.getItem(key)) 
                        return null;
                    return JSON.parse(localStorage.getItem(key));
                } else {
                    if(!Datos[key] || Datos[key] == null) 
                        return null;
                    return Datos[key];
                }
            } catch (r) {
                if(!Datos[key] || Datos[key] == null) 
                    return null;
                return Datos[key];
            }
        },
        has: function(key){
            try {
                if (mz.browser_caps.localstorage) {
                    if (localStorage.getItem(key) == null || !localStorage.getItem(key)) 
                        return false;
                    return true;
                } else {
                    if(!Datos[key] || Datos[key] == null) 
                        return false;
                    return true;
                }
            } catch (r) {
                if(!Datos[key] || Datos[key] == null) 
                    return false;
                return true;
            }
        },
        get_string: function (key) {
            try {
                if (mz.browser_caps.localstorage) {
                    if (localStorage.getItem(key) == null || !localStorage.getItem(key))
                        return null;
                    return localStorage.getItem(key);
                } else {
                    if (!Datos[key] || Datos[key] == null)
                        return null;
                    return JSON.stringify(Datos[key]);
                }
            } catch (r) {
                if (!Datos[key] || Datos[key] == null)
                    return null;
                return JSON.stringify(Datos[key]);
            }
        },
        clear: function() {
            Datos = {};
            if (mz.browser_caps.localstorage)
                localStorage.clear();
        },
        soportado: mz.browser_caps.localstorage
    };
})();

