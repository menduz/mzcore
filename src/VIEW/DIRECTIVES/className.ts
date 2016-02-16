@mz.AttributeDirective.Register("class")
class MzClassNameDirective extends mz.AttributeDirective {
    changed(value: string, prevVal: string) {
        if(this.widget.rootNode.className != value)
            //this.widget.rootNode.className = value;
        mz.dom.microqueue.setAttribute(this.widget.rootNode, 'class', value);
    }
}
