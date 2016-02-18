/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />

@mz.AttributeDirective.Register("mz-model")
class MzModelDirective extends mz.AttributeDirective {
    static symbol2wb = Symbol("mz-model-binding");
    static jqueryBindings = 'changed keyup paste lostfocus search';
    static point_expr = /^([a-zA-Z0-9_$]+)\.(.*)$/;

    changeBinding: any;
    componentBinding: mz.EventDispatcherBinding;
    widgetValueBinding: mz.EventDispatcherBinding;
    
    setter: (value) => void;
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

    changed(value: string, prevVal: string) {
        this.teardown();
        var match : RegExpExecArray;
        
        var listenVar = value;
        
        if(match = MzModelDirective.point_expr.exec(value)){
            this.setter = function(value){
                let obj = this.component[match[1]] || {};
                obj[match[2]] = value;
                this.component[match[1]] = obj;
            }
            this.getter = function(){
                let obj = this.component[match[1]] || {};
                return obj[match[2]];
            }
            listenVar = match[1];
        } else {
            this.setter = function(value){
                this.component[value] = value;
            }
            this.getter = function(){
                return this.component[value];
            }
        }

        

        if (this.widget instanceof mz.widgets.MzInput) {
            this.widgetValueBinding = this.widget.on("value_changed", newVal => {
                if (newVal != this.getter())
                    this.setter(newVal);
            });

            this.componentBinding = this.component.on(listenVar + "_changed", () => {
                let actualVal = (this.widget as mz.widgets.MzInput).value;
                let newVal = this.getter();
                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    (this.widget as mz.widgets.MzInput).value = newVal;
            });
        } else if (value && (this.widget.rootNode.nodeName.toUpperCase() == 'INPUT' || this.widget.rootNode.nodeName.toUpperCase() == 'SELECT')) {
            this.delayedBinding = () => {
                let actualVal = this.widget.DOM.val();
                if (actualVal != this.getter())
                    this.setter(actualVal);
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

namespace mz.widgets {

    @mz.Widget.RegisterComponent('mz-input')
    export class MzInput extends mz.Widget {
        @mz.Widget.proxy
        value: any;

        @mz.Widget.Attribute
        disabled: boolean;

        @mz.Widget.Attribute
        visible: boolean;

        focus() {
            if (this.rootNode instanceof HTMLElement) {
                (this.rootNode as HTMLElement).focus();
            }
        }

        checkValid(formData: any): boolean {
            return true;
        }
    }
}