/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />

@mz.AttributeDirective.Register("mz-model")
class MzModelDirective extends mz.AttributeDirective {
    static symbol2wb = Symbol("mz-model-binding");
    static jqueryBindings = 'changed keyup paste lostfocus search';
    static point_expr = /^([a-zA-Z0-9_$]+)\.(.*)$/;

    private static getSelectedOptionScope(HtmlSelect: JQuery): any {
        let actualVal = HtmlSelect.find('option:selected')[0] || HtmlSelect.find('option:first')[0];
        if (!actualVal)
            actualVal = null;
        else
            actualVal = (actualVal as any).$scope || null;
        return actualVal;
    }

    private static getOptionWithScope(HtmlSelect: JQuery, scope): HTMLElement {
        let actualVal = HtmlSelect.find('option');
        for (var index = 0; index < actualVal.length; index++) {
            var element = actualVal[index];
            if ((element as any).$scope == scope) return element;
        }
    }

    changeBinding: any;
    componentBinding: mz.EventDispatcherBinding;
    widgetValueBinding: mz.EventDispatcherBinding;

    setter: (value) => void;
    touch: () => void;
    getter: () => any;

    private delayedBinding = null;

    unmount() {
        this.teardown();
        super.unmount();
    }

    private teardown() {
        this.delayedBinding && this.widget.DOM.off(MzModelDirective.jqueryBindings, this.delayedBinding);
        this.componentBinding && this.componentBinding.off();
        this.componentBinding = null;
        this.delayedBinding = null;
    }

    changed(destinationField: string, prevVal: string) {
        this.teardown();

        if (destinationField.length == 0) return;

        var match: RegExpExecArray;

        var listenVar = destinationField;

        if (match = MzModelDirective.point_expr.exec(destinationField)) {
            this.setter = function(value) {
                let obj = this.component[match[1]] || {};
                obj[match[2]] = value;
                this.component[match[1]] = obj;
            }
            this.touch = function() {
                this.component.touch(match[1]);
            }
            this.getter = function() {
                let obj = this.component[match[1]] || {};
                return obj[match[2]];
            }
            listenVar = match[1];
        } else {
            this.setter = function(v) {
                this.component[destinationField] = v;
            }
            this.getter = function() {
                return this.component[destinationField];
            }
            this.touch = function() {
                this.component.touch(destinationField);
            }
        }



        if (this.widget instanceof mz.widgets.MzInput) {
            this.widgetValueBinding = this.widget.on("value_changed", newVal => {
                if (newVal != this.getter())
                    this.setter(newVal);
                else
                    this.touch();
            });

            this.componentBinding = this.component.on(listenVar + "_changed", () => {
                let actualVal = (this.widget as mz.widgets.MzInput).value;
                let newVal = this.getter();
                if (actualVal != newVal)
                    (this.widget as mz.widgets.MzInput).value = newVal;
            });
        } else if (this.widget.rootNode.nodeName.toUpperCase() == 'INPUT' || this.widget.rootNode.nodeName.toUpperCase() == 'SELECT') {
            let inputType = this.widget.rootNode.nodeName.toUpperCase() == 'SELECT' ? 'select' : mz.dom.adapter.getAttribute(this.widget.rootNode, "type") || "text";
            inputType = inputType.toUpperCase();

            if (inputType == "CHECKBOX") {
                this.delayedBinding = () => {
                    let actualVal = !!(this.widget.rootNode as HTMLInputElement).checked;
                    if (actualVal != CBool(this.getter()))
                        this.setter(actualVal);
                    else
                        this.touch();
                };
        
                // detecto los cambios
                this.changeBinding = this.widget.DOM.on("changed mouseup keyup", this.delayedBinding);

                this.componentBinding = this.component.on(listenVar + "_changed", () => {
                    let actualVal = !!(this.widget.rootNode as HTMLInputElement).checked;

                    let newVal = CBool(this.getter());

                    if (actualVal != newVal)
                        (this.widget.rootNode as HTMLInputElement).checked = CBool(newVal);
                });
            } else if (inputType == "SELECT") {
                this.delayedBinding = () => {
                    let actualVal = MzModelDirective.getSelectedOptionScope(this.widget.DOM);

                    if (actualVal != this.getter())
                        this.setter(actualVal);
                    else
                        this.touch();
                };
        
                // detecto los cambios
                this.changeBinding = this.widget.DOM.on(MzModelDirective.jqueryBindings, this.delayedBinding);

                this.componentBinding = this.component.on(listenVar + "_changed", () => {
                    let actualVal = MzModelDirective.getSelectedOptionScope(this.widget.DOM);

                    let newVal = this.getter();

                    if (actualVal != newVal && (!newVal || newVal.toString() != actualVal)) {
                        this.widget.DOM.find('option').removeProp('selected').removeAttr('selected');

                        let foundOption = MzModelDirective.getOptionWithScope(this.widget.DOM, newVal);
                        if (foundOption)
                            $(foundOption).attr('selected', 'selected').prop('selected', true);
                    }
                });
            } else {
                this.delayedBinding = () => {
                    let actualVal = this.widget.DOM.val();
                    if (actualVal != this.getter())
                        this.setter(actualVal);
                    else
                        this.touch();
                };
        
                // detecto los cambios
                this.changeBinding = this.widget.DOM.on(MzModelDirective.jqueryBindings, this.delayedBinding);

                this.componentBinding = this.component.on(listenVar + "_changed", () => {
                    let actualVal = this.widget.DOM.val();

                    let newVal = this.getter();

                    if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                        this.widget.DOM.val(newVal)
                });
            }


        }
    }
}

namespace mz.widgets {

    @mz.Widget.RegisterComponent('mz-input')
    export class MzInput extends mz.Widget {
        @mz.Widget.proxy
        value: any;

        @mz.Widget.Attribute
        disabled: boolean;

        @mz.Widget.Attribute
        required: boolean;

        @mz.Widget.Attribute
        visible: boolean;

        focus() {
            if (this.rootNode instanceof HTMLElement) {
                (this.rootNode as HTMLElement).focus();
            }
        }

        isValid(): boolean {
            return true;
        }
    }
}