/// <reference path="../Widget.ts" />

@mz.AttributeDirective.Register("visible")
class MzVisibleDirective extends mz.AttributeDirective {
    static vendorHiddenClass = 'mz-hidden';
    
    private listener: mz.EventDispatcherBinding;
    
    mount(){
        this.listener = this.widget.on('class_changed', () => this.changed(this.value))
    }
    
    unmount(){
        this.listener.off();
    }
    
    changed(val){
        if (CBool(val)) {
            this.widget.DOM.addClass(MzVisibleDirective.vendorHiddenClass).removeAttr('aria-hidden').removeProp(mz.HIDDEN_PROP);
        } else {
            this.widget.DOM.removeClass(MzVisibleDirective.vendorHiddenClass).attr('aria-hidden', "true").prop(mz.HIDDEN_PROP, true);
        }
    }
}