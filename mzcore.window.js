/// <reference path="mzcore.js" />

//REQUIERE jQuery

/**
*

var Ventanita = new Ventana();

Clase Ventana
    Métodos:
        setTitulo(string Titulo);
        
        setContenido(string HTML);
        html(string HTML); // igual a setContenido
        
        CargarAjax(string URL) //Carga una url dentro de la ventana
        
        CargarDOM(elemento jQuery) //Carga el contenido de un elemento dentro de la ventana
        
        show();
        hide();
        
        MostrarLoading(bool Ocultar)

        cerrable(bool MostrarBotonCerrar)
        achicable(bool MostrarBotonMinimizar)
        
        center() //centra la ventana
    
    Callbacks:
        OnClose = function(){ return false; } //Si return TRUE entonces no cierra la ventana
        

*/

(function () {

    if (!jQuery) {
        throw "mzcore.window.js requiere jQuery";
    }

    var ventanas = [];
    var ventanas_count = 0;

    var centramelo = function (coso) {


        if (!(coso instanceof jQuery))
            coso = $(coso);

        if (coso.length == 0) return;

        coso.css("position", "absolute");

        coso.show();

        var ancho = coso.width();
        var alto = coso.height();
        var top = $(window).height() / 2 - alto / 2;
        var left = $(window).width() / 2 - ancho / 2;

        coso.css("top", top);
        coso.css("left", left);
    }

    //TODO: Sacar esto de aca..
    jQuery.fn.center = function () {

        if (!$.browser.msie) {
            //this.hide();

            setTimeout(centramelo, 200, this);
        } else {
            this.hide();

            this.css("position", "absolute");

            var top = 100;
            var left = 100;

            this.css("top", top);
            this.css("left", left);
            this.show();
        }

        return this;
    }



    function Ventana(opc) {
        // Propiedades y métodos estáticos y privadas


        // Propiedades y metodos públicos

        //Constructor

        this.iniciado = false;

        this.DOMOscurecePantalla = null;

        this.check_opantalla = function () {
            if (this.DialogoModal == true) {

                this.DOMOscurecePantalla || (this.DOMOscurecePantalla = $("<div></div>").css(
                {
                    top: '0px',
                    bottom: '0px',
                    left: '0px',
                    right: '0px',
                    position: 'absolute',
                    opacity: 0.5,
                    'z-index': 100
                }
            ).appendTo("body").addClass("opantalla"));
                if (!this.DOMOscurecePantalla.is(":visible"))
                    this.DOMOscurecePantalla.fadeIn();
            } else {
                this.DOMOscurecePantalla && this.DOMOscurecePantalla.remove();
                this.DOMOscurecePantalla = null;
            }
        }



        this.init = function (opc) {
            if (this.iniciado === true)
                return this;

            this.iniciado = true;


            ventanas_count++;

            this.UniqueID = ventanas_count;

            this.DOMID = 'Ventana' + this.UniqueID.toString(16);

            ventanas[this.UniqueID] = this;
        };

        this.TituloVisible = true;
        this.Titulo = 'Titulo';

        this.es_cerrable = true;
        this.es_achicable = true;
        this.achicado = false;

        this.DialogoVisible = false;
        this.DialogoModal = false;

        this.TengoQueCentrar = false;

        this._X = 0;
        this._Y = 0;

        this.OnClose = null;

        this.Offset = { x: 0, y: 0 };

        this.DOMID = 'Ventana';

        this.cont_html = '';

        this.ArmarDOM = function () {

            if (this.DOMParent) {
                this.DOMParent.remove();
            }

            this.DOMParent = $("<div id='" + this.DOMID + "' class='Ventanita'></div>");
            this.DOMTituloContainer = $("<div class='titulo'></div>").appendTo(this.DOMParent);

            this.DOMParent.mousedown(this, function (e) {
                try {
                    e.data.focus();
                } catch (ex) { }
            });

            this.DOMTitulo = $("<span></span>").appendTo(this.DOMTituloContainer);

            this.DOMBotonCerrar = $("<a class='botoncerrar'>X</a>").appendTo(this.DOMTituloContainer);
            this.DOMBotonAchicar = $("<a class='botoncerrar'>_</a>").appendTo(this.DOMTituloContainer);

            this.DOMCargando = $("<div class='loading_box'></div>").appendTo(this.DOMParent);
            this.DOMContenido = $("<div class='contenido'></div>").appendTo(this.DOMParent);

            this.DOMContenido.html(this.cont_html);
            this.DOMTitulo.html(this.Titulo);

            this.DOMParent.hide();

            this.DOMBotonCerrar.ventana = this;

            var self = this;

            this.DOMBotonCerrar.click(function () { self.hide(); });

            this.DOMBotonAchicar.click(function () { self.toggle_achicar(); });

            if (!$.browser.msie) {
                this.DOMParent.draggable({ containment: "body",
                    scroll: false,
                    handle: this.DOMTituloContainer,
                    drag: function (e, ui) {
                        if (ui.position.top < 0) {
                            $$(this.DOMParent).center()
                        }
                    },
                    stop: function (e, ui) {
                        if (ui.position.top < 0) {
                            $$(this.DOMParent).center()
                        }
                    }
                });
            }

            $('body').append(this.DOMParent);

            if (this.es_cerrable == false) {
                this.DOMBotonCerrar.hide();
            }
            if (this.es_achicable == false) {
                this.DOMBotonAchicar.hide();
            }

            if (this.cont_html.length == 0) {
                this.MostrarLoading();
            }

            this.DOMTituloContainer.mousedown(function () { $(this).addClass("draging"); });
            this.DOMTituloContainer.mouseup(function () { $(this).removeClass("draging"); });

            if (this.TengoQueCentrar == true) {
                this.center();
            }
        }

        this.cerrable = function (b) {
            this.es_cerrable = (b ? true : false);
            if (this.DOMParent) {
                if (this.es_cerrable == false) {
                    this.DOMBotonCerrar.hide();
                } else {
                    this.DOMBotonCerrar.show();
                }
            }
            return this;
        }

        this.achicable = function (b) {
            this.es_achicable = (b ? true : false);
            if (this.DOMParent) {
                if (this.es_achicable == false) {
                    this.DOMBotonAchicar.hide();
                } else {
                    this.DOMBotonAchicar.show();
                }
            }
            return this;
        }

        this.visible = function (bool) {
            if (isDef(bool)) {
                if (bool)
                    this.show();
                else
                    this.hide();

                return this;
            } else {
                if (this.DOMParent)
                    return this.DOMParent.is(":visible") || this.DialogoVisible;

                return false;
            }
        }

        this.focus = function () {
            var MaxZindex = 9000;

            $(".Ventanita").each(function () {
                var mizindex = intval($(this).css("z-index"));
                if (mizindex > MaxZindex)
                    MaxZindex = mizindex;
            });

            if (this.DOMOscurecePantalla != null) {
                this.DOMOscurecePantalla.show().css("z-index", MaxZindex + 1);
                MaxZindex++;
            }

            this.DOMParent.css("z-index", MaxZindex + 1);
        }

        this.show = function (c) {
            var EstabaHided = !this.DOMParent || !this.DOMParent.is(":visible");

            if (!this.DOMParent) this.ArmarDOM();

            if (c) this.setContenido(c);

            this.DOMParent.fadeIn("fast");
            this.DialogoVisible = true;

            this.check_opantalla();

            this.focus();

            if (EstabaHided) {
                this.center();
                setTimeout(centramelo, 5, this.DOMParent);
            }


            return this;
        }

        this.hide = function () {
            if (this.OnClose) // si tiene callback antes de cerrar lo llamo
            {
                var res = this.OnClose();
                if (res == true && isDef(res))
                    return this;
            }

            if (this.DialogoVisible == true) {
                this.DOMParent.fadeOut("fast");

                this.DOMOscurecePantalla && this.DOMOscurecePantalla.hide();

                this.DialogoVisible = false;
            }
            return this;
        }

        this.setTitulo = function (str) {
            this.Titulo = str;
            this.TituloVisible = (str.toString().length > 0);

            if (this.DOMParent) {
                if (this.TituloVisible == true) {
                    this.DOMTitulo.show();
                } else {
                    this.DOMTitulo.hide();
                }
                this.DOMTitulo.html(str);
                this.center();
            }
            return this;
        }

        this.setContenido = function (str) {
            if (this.DOMParent) {
                this.DOMContenido.html(str);

                if (this.DOMParent.hasClass("cargando"))
                    this.center();

                this.DOMParent.removeClass("cargando");
                this.DOMCargando.css({ height: 0, display: "none" });

            }
            this.cont_html = str;
            return this;
        }

        this.html = this.setContenido;

        this.MostrarLoading = function (ocultar) {
            if (this.DOMParent) {
                if (!ocultar) {
                    this.DOMCargando.css({ width: max(96, (this.DOMTituloContainer.width() + 5)), height: 96, display: "block" });
                    this.DOMParent.addClass("cargando");
                } else {
                    this.DOMCargando.css({ display: "none" });
                    this.DOMParent.removeClass("cargando");
                }
            }
            return this;
        }

        this.CargarAjax = function (href) {
            var n = this.UniqueID;
            jQuery.get(href, function (a) {
                ventanas[n].setContenido(a);
            });
            return this;
        }

        this.CargarDOM = function (elem) {
            this.setContenido($$(elem).html());
            $$(elem).remove();
            return this;
        }

        this.center = function () {
            if (this.DOMParent) {
                if (this._X == 0) {
                    try {
                        $$(this.DOMParent).center();
                    } catch (e) { }
                }
                this._X = mz.intval(this.DOMParent.css("left"));
                this._Y = mz.intval(this.DOMParent.css("top"));
            } else {
                this.TengoQueCentrar = true;
            }
            return this;
        }

        this.Mover = function (x, y) {
            this.DOMParent.css({ left: x, top: y });
            this._X = x;
            this._Y = y;
            return this;
        }

        this.toggle_achicar = function () {
            if (this.achicado == true) {
                this.DOMContenido.slideDown("fast");
                $("a", this.DOMBotonAchicar).html("_");
                this.achicado = false;
            } else {
                this.DOMContenido.slideUp("fast");
                $("a", this.DOMBotonAchicar).html("+");
                this.achicado = true;
            }
            return this;
        }

        if (typeof opc != "undefined")
            this.init(opc);

        return this;
    }

    //mz.ext("window", Ventana);

    mz.add_prop("window", Ventana);

    mz.add_prop("window", {
        ShowExterno: function (c, elem) {
            ventanas[elem].show(c);
        }
    });

    window.Ventana = mz.window;
})();