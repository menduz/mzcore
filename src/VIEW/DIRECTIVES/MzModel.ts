/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />

@mz.AttributeDirective.Register("mz-model")
class MzModelDirective extends mz.AttributeDirective {
    static symbol2wb = Symbol("mz-model-binding");
    static jqueryBindings = 'changed keyup paste lostfocus search';

    changeBinding: any;
    componentBinding: mz.EventDispatcherBinding;
    widgetValueBinding: mz.EventDispatcherBinding;

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

        if(this.widget instanceof mz.widgets.MzInput){
            this.widgetValueBinding = this.widget.on("value_changed", newVal => {
                if (newVal != this.component[value])
                    this.component[value] = newVal;
            });
            
            this.componentBinding = this.component.on(value + "_changed", newVal => {
                let actualVal = (this.widget as mz.widgets.MzInput).value;

                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    (this.widget as mz.widgets.MzInput).value = newVal; 
            });
        } else if (value && (this.widget.rootNode.nodeName.toUpperCase() == 'INPUT' || this.widget.rootNode.nodeName.toUpperCase() == 'SELECT')) {
            this.delayedBinding = () => {
                let actualVal = this.widget.DOM.val();
                if (actualVal != this.component[value])
                    this.component[value] = actualVal;
            };
        
            // detecto los cambios
            this.changeBinding = this.widget.DOM.on(MzModelDirective.jqueryBindings, this.delayedBinding);

            this.componentBinding = this.component.on(value + "_changed", newVal => {
                let actualVal = this.widget.DOM.val();

                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    this.widget.DOM.val(newVal)
            });
        }
    }
}

namespace mz.widgets {
    export class MzInput extends mz.Widget {
        @mz.MVCObject.proxy
        value;
    }
}