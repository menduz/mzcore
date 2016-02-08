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

    function delegateRefreshScope(e: mz.Widget) {
        if (e && 'refreshScope' in e) {
            //let parent = mz.dom.adapter.parentElement(e.rootNode);
            //let next = mz.dom.adapter.nextSibling(e.rootNode);
            //mz.dom.adapter.remove(e.rootNode);
            e.refreshScope();
            //if (next) {
            //    mz.dom.adapter.insertBefore(next, e.rootNode);
            //} else {
            //    mz.dom.adapter.appendChild(parent, e.rootNode);
            //}
        }

    }

    @mz.Widget.RegisterComponent("mz-repeat")
    @mz.Widget.ConfigureEmptyTag
    export class MzRepeat extends mz.Widget {

        @mz.MVCObject.proxy
        list: mz.Collection<any>;

        @mz.MVCObject.proxy
        afterAdd: (doms: mz.IChildWidget[], scope: any) => void;

        collectionKey: symbol | string;

        private item: any;

        props: {
            list: mz.Collection<any>;
            afterAdd?: (doms: mz.IChildWidget[], scope: any) => void;
        };

        listenersLista: mz.EventDispatcherBinding[];

        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b, c, scope) {
            super(rootNode, attr, [], b, c, scope);

            this.collectionKey = Symbol("mz-repeat-" + mz.genUID());

            this.ponerElem = this.ponerElem.bind(this);
            this.delegateUnmountElements = this.delegateUnmountElements.bind(this);

            // if the list contains elements.
            if (this.list && this.list.length) {
                this.list.forEach(this.ponerElem, this);
            }
        }

        private list_changed(list: mz.Collection<any>, prevList: mz.Collection<any>) {


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

            if (list && !(list instanceof mz.Collection)) {
                console.error(new Error("<mz-repeat> expects attr 'list: mz.Collection'"));
                return;
            }

            if (this.list) {
                this.listenersLista.push(this.list.on('changed', this.redraw.bind(this)));
                this.listenersLista.push(this.list.on('pre_clear', a => this.redraw('pre_clear', a)));

                if (this.list.length && !!this.collectionKey /* collection initialized */)
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

            if (!existia) {
                dom = this.generateScopedContent(itemDeLista);
                itemDeLista[this.collectionKey] = dom;
            }

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

        redraw(tipo?: string, a?, b?) {
            var rebuild = !tipo;

            if (tipo == Collection.EVENTS.ElementChanged && this.collectionKey in b) {
                let widgets = b[this.collectionKey];
                for (var i in widgets) {
                    delegateRefreshScope(widgets[i]);
                }
            } else if (tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged) {
                this.ponerElem(b);
            } else if (tipo == Collection.EVENTS.ElementRemoved && b && b[this.collectionKey]) {
                this.delegateUnmountElements(b);
            } else if (/*tipo == "addRange" || tipo == "filter" ||*/ tipo == Collection.EVENTS.CollectionSorted) {
                rebuild = true;
            } /*else if (tipo == "removed") {
                rebuild = true;
            }*/ else if (tipo == "refresh") {
                this.detachAllNodes();
                this.list.forEach(delegateRefreshScope);
                rebuild = true;
            } else if (tipo == Collection.EVENTS.BeforeClearCollection) {
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