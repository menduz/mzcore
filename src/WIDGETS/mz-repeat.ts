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

    @mz.Widget.RegisterComponent("mz-repeat")
    @mz.Widget.ConfigureEmptyTag
    export class MzRepeat extends mz.Widget {

        @mz.MVCObject.proxy
        list: IForEachable<any>;

        @mz.MVCObject.proxy
        afterAdd: (doms: mz.IChildWidget[], scope: any) => void;

        collectionKey: symbol | string;

        //private item: any;


        props: {
            list: IForEachable<any>;
            afterAdd?: (doms: mz.IChildWidget[], scope: any) => void;
        };

        listenersLista: mz.EventDispatcherBinding[];

        //elementCache: mz.WeakMap<any, mz.Widget[]>;

        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b, c, scope) {
            super(rootNode, attr, [], b, c, scope);

            this.collectionKey = Symbol("mz-repeat-" + mz.genUID());

            this.ponerElem = this.ponerElem.bind(this);
            this.delegateUnmountElements = this.delegateUnmountElements.bind(this);

            // if the list contains elements.
            if (this.list && this.list.length) {
                this.list.forEach(this.ponerElem);
            }
        }

        private list_changed(list: IForEachable<any>, prevList: IForEachable<any>) {



            if (list && list == prevList) {
                if (list instanceof mz.Collection) return;
                this.redraw('refresh');
                return;
            }

            if (this.listenersLista) {
                this.listenersLista.forEach(x => x.off());
                this.listenersLista.length = 0;
            } else if (list) {
                this.listenersLista = [];
            }

            if (prevList && prevList != list) {
                // clean current collection elements
                prevList.forEach(this.delegateUnmountElements as any);
                
               
                this.detachAllNodes();
            } else if (prevList != list) {
                this.detachAllNodes();
            }

            if (this.list && list instanceof mz.Collection) {
                this.listenersLista.push((this.list as mz.Collection<T>).on('changed', this.redraw.bind(this)));
                this.listenersLista.push((this.list as mz.Collection<T>).on('pre_clear', a => this.redraw('pre_clear', a)));
            }

            if (this.list && this.list.length && !!this.collectionKey /* collection initialized */)
                this.redraw('refresh');
        }

        unmount() {
            this.list = null;
            super.unmount();
        }

        ponerElem(itemDeLista) {
            var dom = itemDeLista[this.collectionKey];

            var existia = !!dom;

            if (!existia) {
                itemDeLista[this.collectionKey] = dom = this.generateScopedContent(itemDeLista);
            }

            if (existia) {
                // si el elemento ya existia, llamo a refreshScope
                for (let index = 0; index < dom.length; index++) {
                    let e = dom[index];
                    if (e && (typeof e == "object") && 'refreshScope' in e)
                        e.refreshScope();

                    this.append(e);
                }
            } else {
                for (let index = 0; index < dom.length; index++) {
                    this.append(dom[index]);
                }
            }
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

        private delegateUnmountElements(elementoLista, at?) {
            if (elementoLista[this.collectionKey]) {
                //elementoLista[this.collectionKey].forEach(delegateUnmountElement);
                this.releaseScopedContent(elementoLista[this.collectionKey]);
                delete elementoLista[this.collectionKey];
            }
        }

        redraw(tipo?: string, a?, b?) {
            var rebuild = !tipo;

            if (tipo == Collection.EVENTS.ElementChanged && this.collectionKey in b) {
                let widgets = b[this.collectionKey];

                for (let i = 0; i < widgets.length; i++) {
                    let e = widgets[i];
                    if (e && e.refreshScope) {
                        e.refreshScope();
                    }
                }
            } else if (tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged) {
                this.ponerElem(b);
            } else if (tipo == Collection.EVENTS.ElementRemoved && b && b[this.collectionKey]) {
                this.delegateUnmountElements(b);
            } else if (tipo == Collection.EVENTS.CollectionSorted) {
                rebuild = true;
            } else if (tipo == "refresh") {
                this.detachAllNodes();
                rebuild = true;
            } else if (tipo == Collection.EVENTS.BeforeClearCollection) {
                this.list.forEach(this.delegateUnmountElements);
                return;
            }

            if (tipo == Collection.EVENTS.AfterClearCollection || rebuild) {
                this.detachAllNodes();
            }

            if (rebuild && this.list.length) {
                this.list.forEach(this.ponerElem);
            }
        }
    }
}