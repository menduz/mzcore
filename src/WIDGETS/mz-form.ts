/// <reference path="../view/Widget.ts" />

namespace mz.widgets {
    @mz.Widget.RegisterComponent("mz-form")
    @mz.Widget.ConfigureUnwrapped
    export class MzForm<T> extends mz.widgets.MzInput {
        static ERROR_CLASS = 'has-error';

        private primaryButton: mz.Widget;

        campos: Dictionary<MzInput>;
        private camposArray: MzInput[];

        @MzForm.proxy
        value: T;

        defaults: T;

        private flagAvoidReUpdate: string;

        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b, c, scope) {
            attr['tag'] = attr['tag'] || 'form';
            this.flagAvoidReUpdate = null;



            super(rootNode, attr, children, b, c, scope);

            this.children = this.generateScopedContent(scope);

            this.primaryButton = null;

            this.startComponent();
            this.contentNode = this.contentNode || this.rootNode;

            this.appendChildrens();

            this.defaults = <T>{};
            this.campos = {};
            this.camposArray = [];

            this._findICampos(<any>this);

            this.checkAll = mz.screenDelayer(this.checkAll, this);
        }

        value_changed(val: T, prevVal: T) {
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
        }

        private adoptInput(fieldName: string, component: MzInput) {
            this.campos[fieldName] = component;

            this.camposArray.push(component);

            let defValue = component.attr('default-value');

            if (typeof defValue != "undefined") {
                this.defaults[fieldName] = defValue;
            }

            this.listening.push(component.on("value_changed", val => {
                (this.value || (this.resetForm(), this.value))[fieldName] = val;
                this.flagAvoidReUpdate = fieldName;
                try {
                    this.set('value', this.value);
                } catch (e) {
                    console.error(e);
                }
                this.flagAvoidReUpdate = null;
            }))
        }

        private _findICampos(component: mz.Widget) {
            if (component != this) {
                if (component !== this) {
                    let fieldName = component.attr('field-name');
                    if (fieldName) {
                        this.adoptInput(fieldName, component as MzInput);
                        return;
                    }
                } else {
                    if (component.rootNode && component.rootNode.nodeName.toLowerCase() == "button" && (component.attr('mz-form-primary') || component.attr('type') === "submit")) {
                        this.primaryButton = component;
                    }
                }
            }

            component && component.children && component.children.forEach(c => {
                if (c instanceof mz.Widget)
                    this._findICampos(c);
            });
        }

        fieldIsVisible(fieldName: string): boolean {
            if (fieldName in this.campos) {
                return this.campos[fieldName].visible;
            }
            return false;
        }

        focus(field?: string) {
            if (!field && this.camposArray.length)
                this.camposArray[0].focus && this.camposArray[0].focus();
            else if (field && field in this.campos)
                this.campos[field].focus && this.campos[field].focus();
        }

        errors: string[];

        isValid(): boolean {
            this.errors = [];

            var cumple = true;

            var clase = MzForm.ERROR_CLASS;

            try {
                clase = this.data['error-class'] || clase;
            } catch (e) {

            }

            for (var i in this.campos) {
                if (this.campos[i] instanceof MzInput) {
                    var err = null;

                    try {
                        err = this.campos[i].isValid();
                    } catch (e) {
                        err = e;
                    }

                    if (err === true) {
                        mz.dom.adapter.removeClass(this.campos[i].rootNode, clase);
                    } else {
                        cumple = false;
                        mz.dom.adapter.addClass(this.campos[i].rootNode, clase);

                        if (typeof err === "string" || (<any>err) instanceof Error) {
                            console.error(err, this);
                            this.errors.push(err);
                        }
                    }
                }
            }

            this.primaryButton && this.primaryButton.attr('disabled', !cumple);

            return cumple;
        }

        checkAll(noEmitAlert?: boolean): boolean {
            let cumple = this.isValid();

            if (this.errors.length) {
                this.emit('error', this.errors);
                return false;
            }

            return cumple;
        }

        getDefaultValue(): T {
            let obj = {};
            for (var i in this.campos) {
                obj[i] = this.defaults[i];
                //this.campos[i].value = this.defaults[i];
            }
            return obj as T;
        }

        resetForm() {
            return this.value = this.getDefaultValue();
        }
    }
}