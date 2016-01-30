/// <reference path="../mz.ts" />
/// <reference path="../VIEW/Tmpl.ts" />
/// <reference path="../VIEW/Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="Widget.ts" />

module mz.widgets {
    export class TextNode implements mz.IChildWidget {
        node: Text;
        children: any[];
        listening: EventDispatcherBinding[] = [];
        DOM: JQuery;

        constructor(private value: string, private component: Widget, private scope: any) {
            var t = view.tmpl(value, component, scope);

            if (typeof t === "undefined") t = '';

            this.node = document.createTextNode(t);
            
            (<any>this.node).$tmpl = value;
            (<any>this.node).$component = component;
            (<any>this.node).$scope = scope;
            (<any>this.node).$widget = this;
        }

        setup(value: string, component: Widget, scope: any) {
            this.value = value;
            this.component = component;
            this.scope = scope;

            var t = view.tmpl(value, component, scope);

            if (typeof t === "undefined" || t === null) t = '';

            this.node.textContent = t;
            
            (<any>this.node).$tmpl = value;
            (<any>this.node).$component = component;
            (<any>this.node).$scope = scope;
            (<any>this.node).$widget = this;
        }

        unmount() {
            this.node.remove();
            (<any>this.node).$tmpl = null;
            (<any>this.node).$component = null;
            (<any>this.node).$scope = null;
            (<any>this.node).$widget = null;
            
            for (var i of this.listening) i && i.off && i.off();
            this.listening.length = 0;
            this.value = this.component = this.scope = null;
            TextNode.returnToPoll(this);
        }

        refreshScope() {
            let t = view.tmpl(this.value, this.component, this.scope);
            if (typeof t === "undefined" || t === null) t = '';
            if (this.node.textContent != t) {
                this.node.textContent = t;
            }
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