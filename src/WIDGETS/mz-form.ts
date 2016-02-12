/// <reference path="../view/Widget.ts" />

namespace mz.widgets {
    @mz.Widget.RegisterComponent("mz-form")
    
    /**
     * @attr: "error-class" determines the css class used when a field is required and is not set or does not validate data. Default: "has-error"
     */
    export class MzForm<T> extends mz.Widget {
        static EMPTY_TAG = true;

        primaryButton: mz.Widget;

        campos: Dictionary<MzInput>;
        private camposArray: MzInput[];

        defaults: T;

        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b, c, scope) {

            attr['tag'] = attr['tag'] || 'div';

            super(rootNode, attr, children, b, c, scope);

            this.children = this.generateScopedContent(this);

            this.primaryButton = null;

            this.startComponent();

            this.defaults = <T>{};
            this.campos = {};
            this.camposArray = [];

            this._findICampos(<any>this);

            if (this.primaryButton && this.primaryButton.attr("disabled") == undefined) {
                this.on('valueChanged', delayer(() => {
                    this.primaryButton.attr('disabled', !this.checkAll(true))
                }, 50));
                this.primaryButton.attr('disabled', !this.checkAll(true))
            }
        }

        setValues(a) {
            super.setValues(a);
            this.primaryButton && this.primaryButton.attr('disabled', !this.checkAll(true))
        }

        private _findICampos(component: MzInput) {
            if (component) {
                if (typeof (<any>component) == "object") {
                    if (component instanceof MzInput) {
                        let fieldName = component.attr('field-name');
                        if (!fieldName) {
                            console.warn("all mz-icampo tags should have the attr 'field-name'", component);
                        } else {
                            ((campo) => {
                                var iCampoWidget = component;

                                this.campos[campo] = iCampoWidget;

                                this.camposArray.push(iCampoWidget);

                                let defValue = component.attr('default-value');

                                if (typeof defValue != "undefined") {
                                    this.defaults[campo] = defValue;
                                    this.set(campo, defValue);
                                }

                                if (isDef(this.get(campo))) iCampoWidget.value = this.get(campo);
                            })(fieldName);
                        }
                    } else {
                        if (component.rootNode && component.rootNode.nodeName.toLowerCase() == "button" && component.attr('mz-form-primary')) {
                            this.primaryButton = component;
                        }
                    }
                }

                component && component.children && component.children.forEach(c => {
                    if (!(c instanceof MzForm))
                        this._findICampos(<any>c);
                });
            }
        }

        fieldIsVisible(fieldName: string): boolean {
            if (fieldName in this.campos) {
                return this.campos[fieldName].DOM.is(':visible');
            }
            return false;
        }

        focus(field?: string) {
            if (!field && this.camposArray.length)
                this.camposArray[0].focus && this.camposArray[0].focus();
            else if (field && field in this.campos)
                this.campos[field].focus && this.campos[field].focus();
        }

        checkAll(noEmitAlert?: boolean): boolean {
            var errores = [];
            var cumple = true;

            var clase = 'has-error';

            try {
                clase = this.attr['error-class'] || clase;
            } catch (e) {

            }

            for (var i in this.campos) {
                if (this.campos[i] instanceof MzInput) {
                    var err = this.campos[i].checkValid(this.data);

                    if (err === true) {
                        mz.dom.adapter.removeClass(this.campos[i].rootNode, clase);
                    } else if (!noEmitAlert) {
                        cumple = false;
                        mz.dom.adapter.addClass(this.campos[i].rootNode, clase);
                        if (typeof err === "string" || (<any>err) instanceof Error) {
                            errores.push(err);
                        }
                    } else cumple = false;
                }
            }

            if (errores.length) {
                alert(errores.join('\n'));
                return false;
            }

            return cumple;

        }

        clearValues() {
            for (var c in this.campos)
                this.set(c, this.campos[c].attr('default-value') || null);
        }

        getFormValues(): T {
            var t = {};

            for (var i in this.campos) {
                t[i] = this.data[i];
            }

            return <T>t;
        }

        set(key: string, value: any) {
            super.set(key, value);
            if (this.campos && key in this.campos) {
                this.campos[key].value = value;
            }
        }
    }
}