/// <reference path="../mz.ts" />


namespace mz.css {
    
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
    
    export function set(selectorOrValues: any, selectorValues?: Dictionary<string | number>) {


        var nueva = false;

        var nombre_clase = '';

        if (!isDef(selectorValues)) {
            if (isIterable(selectorOrValues)) {
                var array_clases = [];

                for (var i in selectorOrValues) {
                    if (typeof selectorOrValues[i] != "object") {
                        nueva = true;
                        break;
                    }
                    copy(_estilos_guardados[i] = (_estilos_guardados[i] || {}), selectorOrValues[i]);
                    array_clases.push(i);
                }
                nombre_clase = array_clases.join(" ");
            }

            if (nueva === true) {
                nombre_clase = '.-mzcss-' + (_acum_estilos++).toString(32);
                set(nombre_clase, selectorOrValues as any);
            }
        } else {
            nombre_clase = selectorOrValues;
            copy(_estilos_guardados[selectorOrValues] = (_estilos_guardados[selectorOrValues] || {}), selectorValues);
        }
        _reescribir_css();

        if (nombre_clase.indexOf(".") != -1) {
            return nombre_clase.replace(".", "");
        } else {
            return null;
        }
    }
    
    
    export class Stylesheet {
        prefix: string = null;
        elem: JQuery = $('<link rel="stylesheet" type="text/css">');
        
        estilo : Dictionary<Dictionary<string | number>> = {};
        
        destino: JQuery | string;
        
        constructor(prefix?: string | JQuery){
            
            this.destino = 'head';

            if (prefix instanceof jQuery) {
                this.destino = prefix;

                prefix = ':host';
            }
            
            this.prefix = prefix as string;
            
            $(() => {
                this.enable();
            });
        }
        
        enable(){
            this.elem.appendTo(this.destino);
        }
        
        disable(){
            this.elem.remove();
        }
        
        private remake = null;
        
        refresh(){
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
        }
        
        set(property: string, val: Dictionary<string | number>) {
            this.estilo[property] = this.estilo[property] || {};
            mz.copy(this.estilo[property], val);
            this.refresh();
        }
    }
}