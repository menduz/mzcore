/// <reference path="../Widget.ts" />
/// <reference path="className.ts" />

@mz.AttributeDirective.Register("visible")
class MzVisibleDirective extends mz.AttributeDirective {
    static vendorHiddenClass = 'mz-hidden';

    private listener: mz.EventDispatcherBinding;

    mount() {
        this.listener = this.widget.on('class_changed', () => this.changed(this.value))
    }

    unmount() {
        this.listener.off();
        this.listener = null;
    }

    changed(val) {
        if (!CBool(val)) {
            mz.dom.adapter.addClass(this.widget.rootNode, MzVisibleDirective.vendorHiddenClass);
            try {
                mz.dom.adapter.setAttribute(this.widget.rootNode, 'aria-hidden', 'true');
            } catch (e) { }
            try {
                mz.dom.adapter.setAttribute(this.widget.rootNode, mz.HIDDEN_PROP, mz.HIDDEN_PROP);
            } catch (e) { }
        } else {
            mz.dom.adapter.removeClass(this.widget.rootNode, MzVisibleDirective.vendorHiddenClass);
            try {
                mz.dom.adapter.removeAttribute(this.widget.rootNode, 'aria-hidden');
            } catch (e) { }
            try {
                mz.dom.adapter.removeAttribute(this.widget.rootNode, mz.HIDDEN_PROP);
            } catch (e) { }
        }
    }
}