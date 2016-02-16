/// <reference path="../mz.ts" />
/// <reference path="../VIEW/Tmpl.ts" />
/// <reference path="../VIEW/Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="Widget.ts" />

module mz.widgets {
    export class TextNode implements mz.IChildWidget {
        rootNode: Text;
        children: any[];
        listening: EventDispatcherBinding[] = [];
        DOM: JQuery;

        constructor(private value: string, private component: Widget, private scope: any) {
            let t = view.tmpl(value, component, scope);

            if (typeof t === "undefined") t = '';

            this.rootNode = mz.dom.adapter.createTextNode(t);
            
            (<any>this.rootNode).$tmpl = value;
            (<any>this.rootNode).$component = component;
            (<any>this.rootNode).$scope = scope;
            (<any>this.rootNode).$widget = this;
        }

        setup(value: string, component: Widget, scope: any) {
            this.value = value;
            this.component = component;
            this.scope = scope;

            let t = view.tmpl(value, component, scope);

            if (typeof t === "undefined" || t === null) t = '';

            //this.rootNode.textContent = t;
            mz.dom.microqueue.setText(this.rootNode, t);
            
            (<any>this.rootNode).$tmpl = value;
            (<any>this.rootNode).$component = component;
            (<any>this.rootNode).$scope = scope;
            (<any>this.rootNode).$widget = this;
        }

        unmount() {
            this.rootNode.remove();
            (<any>this.rootNode).$tmpl = null;
            (<any>this.rootNode).$component = null;
            (<any>this.rootNode).$scope = null;
            (<any>this.rootNode).$widget = null;
            
            for (var i of this.listening) i && i.off && i.off();
            this.listening.length = 0;
            this.value = this.component = this.scope = null;
            TextNode.returnToPoll(this);
        }

        refreshScope() {
            let t = view.tmpl(this.value, this.component, this.scope);
            if (typeof t === "undefined" || t === null) t = '';
            mz.dom.microqueue.setText(this.rootNode, t);
            //if (this.rootNode.textContent != t) {
            //    this.rootNode.textContent = t;
            //}
        }

        private static pollObjects: TextNode[] = [];

        static returnToPoll(val: TextNode) {
            if (val)
                this.pollObjects.push(val);
        }

        static getFromPoll(value: string, component: Widget, scope: any) {
            let elem: TextNode = null;
            if (this.pollObjects.length) {
                elem = this.pollObjects.pop();
                elem.setup(value, component, scope);
                return elem;
            } else {
                return new TextNode(value, component, scope);
            }
        }
    }
}