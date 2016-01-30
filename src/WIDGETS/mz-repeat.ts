/// <reference path="../view/Widget.ts" />

module mz.widgets {

    function delegateUnmountElement(widget) {
        if (widget && typeof widget == "object") {
            if ('unmount' in widget)
                widget.unmount()
            else
                widget.DOM && widget.DOM.remove();
        }
    }

    function delegateRefreshScope(e) {
        if (e && typeof e == "object") {
            'scope' in e && (e.scope = e.scope);
            'refreshScope' in e && e.refreshScope();
        }
    }

    @mz.Widget.RegisterComponent("mz-repeat")
    @mz.Widget.IsEmptyTag
    export class MzRepeat extends mz.Widget {

        @mz.MVCObject.proxy
        list: mz.collection<any>;

        @mz.MVCObject.proxy
        afterAdd: (doms: mz.IChildWidget[], scope: any) => void;

        collectionKey: symbol | string;

        private item: any;

        props: {
            list: mz.collection<any>;
            afterAdd?: (doms: mz.IChildWidget[], scope: any) => void;
        };

        listenersLista: mz.EventDispatcherBinding[];

        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b, c, scope) {
            super(rootNode, attr, [], b, c, scope);

            this.collectionKey = Symbol("mz-repeat-" + mz.genUID());

            this.ponerElem = this.ponerElem.bind(this);
            this.delegateUnmountElements = this.delegateUnmountElements.bind(this);
        }

        private list_changed(list, prevList) {
            if (list === prevList) return;

            if (this.listenersLista) {
                this.listenersLista.forEach(x => x.off());
                this.listenersLista.length = 0;
            } else if (list) {
                this.listenersLista = [];
            }

            if (prevList) {
                // clean current collection elements
                prevList.forEach(this.delegateUnmountElements);

                this.detachAllNodes();
            }

            if (list && !(list instanceof mz.collection)) {
                console.error(new Error("<mz-repeat> expects attr 'list: mz.collection'"));
                return;
            }

            if (this.list) {
                this.listenersLista.push(this.list.on('changed', this.redraw.bind(this)));
                this.listenersLista.push(this.list.on('pre_clear', a => this.redraw('pre_clear', a)));

                if (this.list.length)
                    this.redraw('refresh');
            }
        }

        unmount() {
            this.list = null;
            super.unmount();
        }

        ponerElem(itemDeLista) {
            this.item = itemDeLista;

            var dom = itemDeLista[this.collectionKey];

            var existia = !!dom;

            dom = itemDeLista[this.collectionKey] = dom || this.generateScopedContent(itemDeLista);

            dom.forEach((e) => {
                // si el elemento ya existia, llamo a refreshScope
                if (existia && e && (typeof e == "object") && 'refreshScope' in e)
                    e.refreshScope();

                this.append(e);
            });
        }

        generateScopedContent(scope): IChildWidget[] {
            var t = super.generateScopedContent(scope);
            this.afterAdd && this.afterAdd(t, scope);
            return t;
        }

        private detachAllNodes() {
            let child: Node = null;
            while (child = this.contentNode.firstChild) {
                this.contentNode.removeChild(child);
            }
        }

        private delegateUnmountElements(elementoLista) {
            if (elementoLista[this.collectionKey]) {
                elementoLista[this.collectionKey].forEach(delegateUnmountElement);

                delete elementoLista[this.collectionKey];
            }
        }

        redraw(tipo: string, a?, b?) {
            var that = this;

            var rebuild = !tipo;

            if (tipo == "set_at" && b[this.collectionKey]) {
                b[this.collectionKey].forEach(delegateRefreshScope);
            } else if (tipo == "insert_at" || tipo == "set_at") {
                this.ponerElem(b);
            } else if (tipo == "remove_at" && b && b[this.collectionKey]) {
                this.delegateUnmountElements(b);
            } else if (tipo == "addRange" || tipo == "removed" || tipo == "filter" || tipo == "swap" || tipo == "sort") {
                rebuild = true;
            } else if (tipo == "refresh") {
                this.detachAllNodes();
                this.list.forEach(delegateRefreshScope);
                rebuild = true;
            } else if (tipo == "pre_clear") {
                this.list.forEach(this.delegateUnmountElements);
                return;
            }

            if (tipo == "clear" || rebuild) {
                this.detachAllNodes();
            }

            if (rebuild && this.list.length) {
                this.list.forEach(this.ponerElem, this);
            }
        }
    }
}