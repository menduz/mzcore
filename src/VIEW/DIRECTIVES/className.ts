

@mz.AttributeDirective.Register("class")
class MzClassNameDirective extends mz.AttributeDirective {
    changed(value: string, prevVal: string) {
        if (this.widget.rootNode.className != value)
            this.widget.rootNode.className = value;

        if (this.widget[MzClassNameDirective.ENSURED_CLASSNAME]) {
            let classList: string[] = this.widget[MzClassNameDirective.ENSURED_CLASSNAME];
            for (var i = 0; i < classList.length; i++) {
                let className = classList[i];
                this.widget.rootNode.classList.add(className);
            }
        }
        //mz.dom.microqueue.setAttribute(this.widget.rootNode, 'class', value);
    }
}

namespace MzClassNameDirective {
    export const ENSURED_CLASSNAME = Symbol('mz-ensured-classname');

    export function EnsureClassName<TFunction extends Function>(classNames: string): ClassDecorator {
        return function(target: TFunction): TFunction | void {
            let ensuredArray: string[] = target.prototype[ENSURED_CLASSNAME] = target.prototype[ENSURED_CLASSNAME] || [];
            let classNamesList = classNames.split(/\s*/g);
            for (var i = 0; i < classNamesList.length; i++) {
                let element = classNamesList[i];
                if (ensuredArray.indexOf(element) == -1)
                    ensuredArray.push(element);
            }
            return target;
        }
    }
}