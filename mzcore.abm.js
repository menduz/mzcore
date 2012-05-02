/// <reference path="mzcore.js" />

/*
Objetivo de esto!:


Yo cargo un archivo plano que tenga un json, en ese archivo va a venir información sobre pantallas ABM que se van a generar en JavaScript.
Y la entrada y salida de datos se hace por POST y GET a webs que vienen en ese mismo json.

Modelo de archivo para generar ABM:

{
campos: [
{ 
name:       "UserNombre",
def:    "Ingrese su nombre aqui",
tipo:       "text",
label:      "Nombre"
},
{
name:       "UserApellido",
def:    "Ingrese su apellido aqui",
tipo:       "text",
label:      "Apellido"
}
],
opciones: {
permite_insertar:   true,
permite_editar:     true,
permite_borrar:     true,
get_url:            "Ajax.aspx?get=true&idMovil={idMovil}",
post_url:           "Ajax.aspx?post=true",
delete_url:         "Ajax.aspx?delete=true&idMovil={idMovil}",
selector_destino:   "#divloco",
skin:               funcion(campos,opciones,datos)
}
};


TIPOS DE CAMPOS:
    text
        placeholder
    textarea
    color
    date
    datetime
    duracion (returns int de segundos)
    int (text input returns int)
    hidden
    select
        origen: function( callback(datos, opc NuevoValor, opc CampoClave, opc CampoValor) )
    checkbox
        returns bool

*/

(function () {

    var pABMs = [];
    var pABMc = 0;

    function AjaxABM(opc) {

        this.campos = [];
        this.datos = {};

        this.llegaron_datos = false;

        this.callback_send = function (datos) { };
        this.callback_cancell = function (datos) { };
        this.callback_onchange = function () { };

        this.OnShow = function () { return true; };


        this.get_element_parent = function () {
            var elem = this.opciones.selector_destino;

            if (elem instanceof Ventana) {
                return $("#" + elem.DOMID);
            } else {
                return $$(elem);
            }
        };

        this.input = function (cual) {
            var el = $("#" + this.opciones.DOMID + "_" + cual, this.get_element_parent());

            if (el.length == 0)
                el = $("." + this.opciones.DOMID + "_" + cual, this.get_element_parent());
            return el;
        };

        this.label = function (cual) {
            return $("." + this.opciones.DOMID + "-label_" + cual, this.get_element_parent());
        };

        this.Morfismo = function (campos, opciones) {
            if (opciones) copy_properties(this.opciones, opciones);
            this.campos = [];
            for (var i in campos) {
                if (campos[i].name) {
                    this.campos[campos[i].name] = campos[i];
                }
            }
        }

        this.iniciado = false;

        this.init = this.Init = function (opc) {
            if (this.iniciado === true)
                return this;

            this.iniciado = true;

            pABMc++;
            pABMs[pABMc] = this;

            this.campos = [];
            this.datos = {};

            this.llegaron_datos = false;

            this.callback_send = function (datos) { };
            this.callback_cancell = function (datos) { };
            this.callback_onchange = function () { };

            this.OnShow = function () { return true; };

            this.opciones = {
                DOMID: 'ABM_' + pABMc.toString(16),
                permite_insertar: false,
                permite_editar: false,
                permite_borrar: false,
                get_url: "", //"Ajax.aspx?get=true&idMovil={idMovil}",
                post_url: "", //"Ajax.aspx?post=true",
                delete_url: "", //"Ajax.aspx?delete=true&idMovil={idMovil}",
                get_method: "get",
                selector_destino: null,
                skin: function (campos, opciones, datos) {
                    var rt = '';
                    rt = '<div class="tablaABM"><table>';

                    rt += mz.abm.ABMVistaComunCampos(campos, opciones, datos);

                    rt += '</table>';

                    rt += '</div><div class="barra_botones">';

                    if (mz.has("mapa") && mz.mapa.MapaInstanciado == true && datos.Latitud) {
                        rt += '<input type="button" value="Ver en el mapa" onclick="Mapa_SetCenter(' + datos.Latitud + ',' + datos.Longitud + ')"/>';
                    }

                    rt += '</div>';
                    return rt;
                }
            };

            this.pABMc = pABMc;

            if (typeof opc == "string") {
                var n = this;
                $.getJSON(opc, function (j) {
                    n.Morfismo(j.datos, j.opciones);
                });
            } else {
                mz.copy(this.opciones, opc || {});
            }
        }

        this.recvDatosSelect = function (campo, datos_select, CampoClave, CampoValor) {
            var i = campo;

            if (this.campos[i].tipo == "select") {
                var el = $("#" + this.opciones.DOMID + "_" + this.campos[i].name).html('');
                if (this.campos[i].editable) {


                    var UltimoGrupo = 0;

                    var DondePonerOption = el;

                    var prev = $("option:selected", el);

                    if (prev.length > 0) {
                        if (intval(prev.val()))
                            this.datos[this.campos[i].name] = prev.val();
                    }

                    for (var e in datos_select) {
                        if (datos_select[e]._Orden && UltimoGrupo != datos_select[e]._Orden) {
                            UltimoGrupo = datos_select[e]._Orden;

                            if (UltimoGrupo == null)
                                DondePonerOption = el
                            else
                                DondePonerOption = $("<optgroup label='" + datos_select[e].NombreGrupo + "'></optgroup>").appendTo(el);
                        }

                        DondePonerOption.append("<option value='" + (datos_select[e][CampoClave || 'value'] || datos_select[e].id || 0) + "'>" + (datos_select[e][CampoValor || 'label'] || datos_select[e].Nombre) + "</option>");

                    }
                    //console.log("el campo selectado es " + this.campos[i].name + " con val " + this.datos[this.campos[i].name]);
                    $('option[value="' + this.datos[this.campos[i].name] + '"]', el).attr("selected", "selected").prop("selected", true);
                } else {
                    for (var e in datos_select) {
                        var val = (datos_select[e][CampoClave || 'value'] || datos_select[e].id || 0);
                        if (val && val == this.datos[this.campos[i].name]) {
                            el.html(datos_select[e][CampoValor || 'label'] || datos_select[e].Nombre);
                            break;
                        }
                    }
                }
            }
        }

        this.ArmarDOM = function () {
            if (this.llegaron_datos) {
                $h(this.opciones.selector_destino).html(this.opciones.skin(this.campos, this.opciones, this.datos));

                try {
                    $('.timestamp').timeago();
                } catch (ee) { }

                for (var i in this.campos) {
                    if (this.campos[i].origen) {


                        var c = (function (clase, select) {
                            return function (d, nuevoVal, CampoClave, CampoValor) {
                                if (isDef(nuevoVal) && nuevoVal !== null)
                                    clase.datos[i] = nuevoVal;
                                clase.recvDatosSelect(select, d, CampoClave, CampoValor);
                            };
                        })(this, i);

                        this.campos[i].cb_origen = c;

                        var datos_select = this.campos[i].origen(this.campos[i].cb_origen, this.datos);

                        if (mzcore.isIterable(datos_select))
                            this.recvDatosSelect(i, datos_select);
                    }
                }

                var n = this.pABMc;

                var elem = this.get_element_parent();

                $("input", elem).bind('keypress', function (event) {
                    if (event.keyCode === 13) {
                        pABMs[n].Enviar();
                        event.preventDefault();
                        return false;
                    }
                });



                (function (abm) {
                    $("input", elem).bind("change keyup", function () {
                        abm._Cambiado();
                        abm.GetDatos();
                    });
                    $("select", elem).change(function () {
                        abm._Cambiado();
                        abm.GetDatos();
                        if ($(this).attr("binded")) {
                            var datos_select = abm.campos[$(this).attr("binded")].origen(abm.campos[$(this).attr("binded")].cb_origen, abm.datos);

                            if (hasArrayNature(datos_select))
                                abm.recvDatosSelect($(this).attr("binded"), datos_select);
                        }
                    });
                })(this);

                $("form", elem).attr("onsubmit", function (event) {
                    pABMs[n].Enviar();
                    event.preventDefault();
                    return false;
                });

                $('.timeEntry', elem).timeEntry({
                    show24Hours: true,
                    useMouseWheel: true,
                    spinnerImage: 'javaScript/jquery/plugins/timeentry/spinnerOrange.png'
                });

                $('.dateEntry', elem).dateEntry({
                    useMouseWheel: true,
                    dateFormat: formato_fecha_calendario
                });

                $('.dateEntry', elem).datepicker({
                    showOn: "button",
                    buttonImage: "Imagenes/Calendario.PNG",
                    buttonImageOnly: true,
                    dateFormat: "dd/mm/yy",
                    onClose: function (dateText, inst) {
                        $(this).val(dateText);
                        $(this).dateEntry('setDate', dateText);
                        return false;
                    },
                    onSelect: function (dateText, inst) {
                        $(this).val(dateText);
                        $(this).dateEntry('setDate', dateText);
                        return false;
                    }
                });

                //$(".editColor", elem).mColorPicker();

                elem.trigger("abm_show", [this]);

                if (this.OnShow) {
                    this.OnShow();
                }
            } else {
                if ($h(this.opciones.selector_destino).MostrarLoading)
                    $h(this.opciones.selector_destino).MostrarLoading();
            }
        }

        this.Enviar = function () {
            return this.callback_send(this.GetDatos());
        };
        this._Cambiado = function () {
            return this.callback_onchange();
        };
        this.Mostrar = function (destino) {
            if (destino) {
                if (this.opciones.selector_destino != null) {
                    $h(this.opciones.selector_destino).html('');
                }
                this.opciones.selector_destino = destino;
            }

            if (this.opciones.selector_destino != null) {
                if (TieneCampo(this.opciones.selector_destino, "setContenido"))
                    this.opciones.selector_destino.show();
                this.ArmarDOM();
            }
        }

        this.SetDatos = this.CargarDatos = function (json) {
            this.llegaron_datos = true;

            this.datos = json;
            //this.datos = json;
            this.Mostrar();
        }

        this.Obtener = function (params) {
            if (this.opciones.selector_destino != null) {
                var n = this.pABMc;
                if (this.opciones.get_method == "get") {
                    $.getJSON(_tx(this.opciones.get_url, params), function (j) {
                        pABMs[n].llegaron_datos = true;
                        pABMs[n].CargarDatos(j);
                    });
                } else {
                    $.postJSON(_tx(this.opciones.get_url, params), params, function (j) {
                        pABMs[n].llegaron_datos = true;
                        pABMs[n].CargarDatos(j);
                    });
                }
            }
        }

        this.GetDatos = function () {
            for (var i in this.campos) {



                var retval = this.datos[this.campos[i].name];

                if (!!this.campos[i].editable) {

                    var elem_dato = this.input(this.campos[i].name);

                    if (elem_dato.length > 0) {
                        switch (this.campos[i].tipo) {
                            case "duracion":
                                retval = Number(elem_dato.val().substr(0, 2)) * 3600 + Number(elem_dato.val().substr(3, 4)) * 60;
                                break;
                            case "date":
                                retval = elem_dato.dateEntry('getDate'); //convertirAFecha(elem_dato.val());
                                retval.setHours(0);
                                retval.setMinutes(0);
                                retval.setSeconds(0);
                                break;
                            case "datetime":
                                /*
                            
                                retval = $("#" + this.opciones.DOMID + "_" + this.campos[i].name + "d", elem).dateEntry('getDate'); //convertirAFecha(elem_dato.val());
                                var time = $("#" + this.opciones.DOMID + "_" + this.campos[i].name + "t", elem).timeEntry('getTime');
                                retval.setHours(time.getHours());
                                retval.setMinutes(time.getMinutes());
                                retval.setSeconds(time.getSeconds());
                            
                                */

                                retval = convertirAFechaHora(
                                    this.input(this.campos[i].name + "d").val() + " " +
                                    this.input(this.campos[i].name + "t").val()
                                );

                                break;
                            case "label":
                            case "label2":
                                //retval = this.datos[this.campos[i].name];
                                //Dejo el dato como está en la memoria.
                                break;
                            case "check":
                            case "checkbox":
                                retval = elem_dato.prop("checked");
                                break;
                            case "int":
                                retval = mz.intval(elem_dato.val());
                                break;
                            case "color":
                                retval = elem_dato.val().replace("#", "");
                                break;
                            case "select":
                                var elm = $("option:selected", elem_dato);

                                if (!elm.prop("disabled"))
                                    retval = elm.val();

                                break;
                            default:
                                retval = elem_dato.val();
                                break;
                        }
                    }

                    this.datos[this.campos[i].name] = retval;
                }
            }

            return this.datos;
        }


        this.SetDato = function (key, val) {
            this.datos[key] = val;

            this.input(key).val(val);

            if (this.campos[key]) {
                switch (this.campos[key].tipo) {
                    case "label":
                        this.label(key).html(_tx(this.campos[key].label || '', this.datos));
                        break;
                    case "label2":
                        this.label(key).html(_tx(this.campos[key].caption || '', this.datos));
                        break;
                    case "duracion":
                        val = intval(val);
                        this.label(key).html(format_duracion(val) + " " + idioma["abbr_horas"]);
                        this.input(key).val(format_duracion(val));
                        break;
                    case "date":
                        val = mz.date.parse(val);

                        this.label(key).html(format_date(val));
                        this.input(key);

                        this.input(key).val(format_date(val)).dateEntry('setDate', format_date(val));

                        break;
                    case "text":
                        this.label(key).html(val);
                        this.input(key).val(val);
                        break;
                    case "datetime":
                        val = mz.date.parse(val);

                        this.label(key).html(format_date_time(val));
                        this.input(key).val(format_date_time(val));

                        this.input(key + "d").val(format_date(val)).dateEntry("setDate", format_date(val));
                        this.input(key + "t").val(format_time(val)).timeEntry("setTime", format_time(val));

                        break;
                    case "check":
                    case "checkbox":
                        this.label(key).html(val ? 'Si' : 'No');
                        this.input(key).prop("checked", val);
                        break;
                    case "color":
                        val = "#" + ((val || '').replace("#", ""));

                        if (val == "#")
                            val = "#000";

                        this.input(key).html(val).css("background-color", val);
                        this.label(key).html(val).css("background-color", val);

                        break;
                    default:
                        this.input(key).html(_tx(this.campos[key].caption || '', this.datos));
                }
            } else {
                this.input(key).html(val).val(val);
            }
        }

        if (typeof opc != "undefined")
            this.init(opc);

        return this;
    }

    mz.add_prop("abm", AjaxABM);

    window.AjaxABM = mz.abm; //mz.ext("abm", AjaxABM);

    mz.add_prop("abm", {
        ABMVistaComunCampos: function (campos, opciones, datos) {
            var rt = '';
            for (var n in campos) {


                if (!!campos[n].editable || !campos[n].hasOwnProperty("editable")) {
                    campos[n].editable = true;
                } else {
                    campos[n].editable = false;
                }

                var c = campos[n];

                switch (c.tipo) {
                    case 'label':
                    case 'html':
                        rt += '<tr><td colspan="2" class="' + opciones.DOMID + '-label_' + c.name + '">' + _tx(c.label || c.html, datos) + '</td></tr>';
                        break;
                    case 'label2':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td><span class="' + opciones.DOMID + '-label_' + c.name + '">' + _tx(c.caption, datos) + '</span></td></tr>';
                        break;
                    case 'duracion':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';

                        if (c.editable) {
                            rt += '<input class="timeEntry" id="' + opciones.DOMID + '_' + c.name + '" type="text" value="' + format_duracion(datos[c.name]) + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '">' + format_duracion(datos[c.name]) + " " + idioma["abbr_horas"] + '</span>';
                        }

                        rt += '</td></tr>';
                        break;
                    case 'date':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';

                        if (c.editable) {
                            rt += '<input class="dateEntry" id="' + opciones.DOMID + '_' + c.name + '" type="text" value="' + (TieneCampo(datos, c.name) ? format_date(datos[c.name]) : '') + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '">' + (TieneCampo(datos, c.name) ? format_date(datos[c.name]) : '') + '</span>';
                        }

                        rt += '</td></tr>';
                        break;

                    case 'datetime':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';

                        rt += '<input id="' + opciones.DOMID + '_' + c.name + '" type="hidden" value="' + (TieneCampo(datos, c.name) ? format_date_time(datos[c.name]) : '') + '"/>';

                        if (c.editable) {
                            rt += '<input class="dateEntry" id="' + opciones.DOMID + '_' + c.name + 'd" type="text" value="' + (TieneCampo(datos, c.name) ? format_date(datos[c.name]) : '') + '"/>';
                            rt += '<input class="timeEntry" id="' + opciones.DOMID + '_' + c.name + 't" type="text" value="' + (TieneCampo(datos, c.name) ? format_time(datos[c.name]) : '') + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '">' + (TieneCampo(datos, c.name) ? format_date_time(datos[c.name]) : '') + '</span>';
                        }

                        rt += '</td></tr>';
                        break;
                    case 'textarea':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';

                        if (c.editable) {
                            rt += '<textarea id="' + opciones.DOMID + '_' + c.name + '">' + (datos[c.name] != null ? datos[c.name] : (c.def || "")) + '</textarea>';
                        } else {
                            rt += '<p class="' + opciones.DOMID + '-label_' + c.name + '">' + (datos[c.name] != null ? datos[c.name] : (c.def || "")) + '</p>';
                        }

                        rt += '</td></tr>';
                        break;

                    case 'color':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';

                        datos[c.name] = datos[c.name].replace("#", "");

                        if (c.editable) {

                            rt += '<input class="editColor" hex="true" data-hex="true" type="color" id="' + opciones.DOMID + '_' + c.name + '" style="background-color:#' + datos[c.name] + '" value="#' + (datos != null ? datos[c.name] : c.def) + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '" style="background-color:#' + datos[c.name] + '">' + datos[c.name] + '</span>';
                        }

                        rt += '</td></tr>';
                        break;
                    case 'select':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';
                        if (c.editable) {
                            rt += '<select id="' + opciones.DOMID + '_' + c.name + '" ' + (c.binded ? 'binded="' + c.binded + '"' : '') + '><option disabled="disabled">Cargando...</option></select>';
                        } else {
                            rt += '<span id="' + opciones.DOMID + '_' + c.name + '"><small>Cargando...</small></span>';
                        }
                        rt += '</td></tr>';
                        break;

                    case 'check':
                    case 'checkbox':
                        rt += '<tr><td class="t"><label for="' + opciones.DOMID + '_' + c.name + '">' + _tx(c.label, datos) + '</label></td><td>';
                        if (c.editable) {
                            rt += '<input type="checkbox" id="' + opciones.DOMID + '_' + c.name + '" name="' + opciones.DOMID + '_' + c.name + '" ' + ((datos != null ? datos[c.name] : false) ? 'checked' : '') + '/>';
                        } else {
                            rt += '<span id="' + opciones.DOMID + '_' + c.name + '"><b>' + ((datos != null ? datos[c.name] : false) ? 'Si' : 'No') + '</b></span>';
                        }
                        rt += '</td></tr>';
                        break;
                    case 'hidden':
                        rt += '<tr style="display:none"><td><input type="hidden" id="' + opciones.DOMID + '_' + c.name + '" value="' + (datos != null ? datos[c.name] : c.def) + '"/></td></tr>';
                        break;

                    case 'int':
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';
                        if (c.editable) {
                            rt += '<input type="text" id="' + opciones.DOMID + '_' + c.name + '" value="' + mz.intval((datos != null ? datos[c.name] : c.def) || "") + '" placeholder="' + (c.placeholder || '') + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '">' + mz.intval(datos[c.name] || "") + '</span>';
                        }
                        rt += '</td></tr>';
                        break;

                    case 'text':
                    default:
                        rt += '<tr><td class="t">' + _tx(c.label, datos) + '</td><td>';
                        if (c.editable) {
                            rt += '<input type="text" id="' + opciones.DOMID + '_' + c.name + '" value="' + ((datos != null ? datos[c.name] : c.def) || "") + '" placeholder="' + (c.placeholder || '') + '"/>';
                        } else {
                            rt += '<span class="' + opciones.DOMID + '-label_' + c.name + '">' + (datos[c.name] || "") + '</span>';
                        }
                        rt += '</td></tr>';
                        break;
                }
            }
            return rt;
        }
    });


    window.ABMVistaComunCampos = mz.abm.ABMVistaComunCampos;


})()