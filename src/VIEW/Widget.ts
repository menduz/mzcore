/// <reference path="../mz.ts" />
/// <reference path="Tmpl.ts" />
/// <reference path="Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="../CORE/Decorators.ts" />
/// <reference path="TextNode.ts" />
/// <reference path="../CORE/DOM/MicroQueue.ts" />


module mz {
    export class AttributeDirective {
        protected _value;

        constructor(protected widget: Widget, protected component: Widget, value) {
            this.value = value;
            this.mount();
        }

        mount() {

        }

        unmount() {
            delete this.widget;
            delete this._value;
        }

        protected changed(value, prevValue?) {

        }

        set value(value) {
            if (value !== this._value) {
                let prevValue = this._value;
                this._value = value;
                this.changed(value);
            }
        }

        get value() {
            return this._value;
        }
    }

    export module AttributeDirective {
        export function Register(attrName: string) {
            return function <T extends typeof AttributeDirective>(target: T) {
                let lowerCaseName = attrName.toLowerCase();

                if (lowerCaseName in AttributeDirective.directives) {
                    console.warn("There is alredy a directive for '" + lowerCaseName + "'. It would be replaced.");
                }

                AttributeDirective.directives[lowerCaseName] = target;
            }
        }

        export const directives: IMZComponentDirectiveCollection = {};
    }

    export interface IChildWidget extends mz.IWidget {
        rootNode: Node;
        children: IChildWidget[];
        listening: any[];
    }

    export interface IMZComponentEvent {
        event: Event;
        data: any;
        element: HTMLElement;
    }

    export interface IMZComponentDirectiveCollection {
        [attributte: string]: typeof AttributeDirective;
    }

    var templateCache: Dictionary<Document> = {};

    var paramRegex = /^__(\d+)$/;
    var tieneLlaves = /\{|\}/;

    var testScope = /^{scope\./;

    const enableListener = function(listener: EventDispatcherBinding) {
        listener.enable()
    }

    function setScopeRecursiveAndEnableListeners(list: any[], scope: any) {
        for (let i = 0; i < list.length; i++) {
            let w = list[i];
            if (w) {
                if (w instanceof widgets.TextNode) {
                    w.scope = scope;
                    w.refreshScope();
                } else if (w instanceof Widget) {
                    w.children && w.children.length && setScopeRecursiveAndEnableListeners(w.children as any, scope);
                    w.listening && w.listening.forEach(enableListener);
                    w.scope = scope;
                    w.refreshScope();

                }
            }
        }
    }

    var containsScope = /[\{|\s|\(|\[]scope[\.|\s|\[|\(]/;

    var parser = new DOMParser();
    var errorDoc, errorNs;
    try {
        errorDoc = parser.parseFromString('INVALID', 'text/xml');
        errorNs = errorDoc.getElementsByTagName("parsererror")[0].namespaceURI;
    } catch (e) { }
    
    // turns the array of string parts into a DOM
    // throws if the result is an invalid XML document.
    function quasiToDom(parts: TemplateStringsArray) {

        // turn ["<div class='", "'>Hi</div>"]
        // into "<div class='__0'>Hi</div>"
        var xmlstr = parts.reduce((xmlstr, part, i) => {
            xmlstr += part;
            if (i != parts.length - 1) { // the last part has no ending param
                xmlstr += `__${i}`;
            }

            return xmlstr;
        }, "");
        
        
        

        // parse into DOM, check for a parse error
        // browser's DOMParser is neat, but error handling is awful
        var doc = parser.parseFromString(xmlstr, 'text/xml');
        var errors = doc.getElementsByTagNameNS(errorNs, 'parsererror');
        var error = '';
        if (errors.length > 0) {
            error = errors[0].textContent.split('\n')[0];
            throw `invalid jsx: ${error}\n${xmlstr}`;
        }

        return doc;
    }

    var lonelyProperty = /^\{([A-Za-z0-9_$\-]+)\}$/;
    var lonelyPropertyThis = /^\{this\.([A-Za-z0-9_$\-]+)\}$/;


    /**
    * Esta función es usada para bindear un atributo a los cambios de MVCObject que pueden llegar a modificar el valor del atributo
    */
    function bindWidgetAttr(attrName, attrValue, observable: MVCObject, widget: Widget | JQuery, scope: any) {
        var match;
        
        // attr="{hola}" 
        // mando directamente Val(hola) a el atributo
        if ((match = lonelyProperty.exec(attrValue)) || (match = lonelyPropertyThis.exec(attrValue))) {
            return observable.on(match[1] + '_changed', function(a, b) {
                if (a !== b) {
                    if (widget.attr(attrName) != a)
                        widget.attr(attrName, a);
                }
            });
        } 
        // attr="{this.hola}"
        // mando Tmpl("{this.hola}", MVCObject, scope)
        else {
            return observable.on('valueChanged', function(data, elem, a, b) {
                if (a !== b && attrValue.indexOf(elem) != -1) {
                    var t = view.tmpl(attrValue, observable, (widget as any).data.scope);
                    if (widget.attr(attrName) != t)
                        widget.attr(attrName, t);
                }
            });
        }
    }

    var boolAttrs: any = ('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,' +
        'defaultchecked,defaultmuted,defaultselected,defer,disabled,draggable,enabled,formnovalidate,hidden,' +
        'indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,' +
        'pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,spellcheck,translate,truespeed,' +
        'typemustmatch,visible').split(',');
    boolAttrs.forEach(a => boolAttrs[a] = true);





    /** 
    * Local template's document caché
    */
    export var widgetTemplateSource: {
        [url: string]: any;
    } = {};

    var tmpl_pointer = view.tmpl;

    function domToWidgets(node: Node, params, component: Widget, scope?: any): Widget | IChildWidget {
        var match;

        // text node, comment, etc
        
        if (node instanceof CDATASection) {
            return <any>mz.dom.adapter.createTextNode(node.nodeValue);
        }



        var hasScope = arguments.length == 4;

        if (node.nodeValue) {

            if (node.nodeType == node.COMMENT_NODE) return;

            var value = node.nodeValue;

            if (value.trim().length === 0) {
                return;
            }

            match = value.match(paramRegex);

            if (match)
                return params[parseInt(match[1])];


            // detect if we have {} on the text
            if (tieneLlaves.test(value)) {
                var childWidget = widgets.TextNode.getFromPoll(value, component, scope);

                // We don't mess with "{scope.hola}" expr
                // But we do with 
                if (component && !(testScope.test(value))) {

                    // If the expr is "{prop}" or "{this.prop}" we assume a proxy
                    if ((match = lonelyProperty.exec(value)) || (match = lonelyPropertyThis.exec(value))) {
                        childWidget.listening.push(component.on(match[1] + '_changed', function(a, b) {
                            if (a != b) {
                                if (typeof a === "undefined" || a === null) a = '';
                                //if (childWidget.rootNode.textContent != a)
                                //    childWidget.rootNode.textContent = a;
                                mz.dom.microqueue.setText(childWidget.rootNode, a);
                            }
                        }));
                    } else {
                        // catch other samples, ex: "$ {this.value + scope.value} {currency}"
                        childWidget.listening.push(component.on('valueChanged', function(data, elem, a, b) {
                            if (a != b && value.indexOf(elem) != -1) {
                                childWidget.refreshScope();
                            }
                        }));
                    }
                }

                return childWidget;
            }

            if (typeof value == "string")
                return <any>document.createTextNode(value);

            return <any>value;
        }

        var widgetCtor: typeof Widget;
        match = node.localName.match(paramRegex)
        widgetCtor = match ? params[parseInt(match[1])] : (<any>mz).widgets[node.localName.toLowerCase()];

        var name = null;
        // attributes of the node
        var attrs: Dictionary<any> = {};


        /** 
         * Guardo en este diccionario los atributos del widget que puedo llegar a bindear al objeto (los que tienne llaves)
         * */
        var bindeableAttrs: Dictionary<string> = {};

        let listenersConLlaves = [];



        for (var i = node.attributes.length - 1; i >= 0; i--) {
            var attr = node.attributes[i];

            attrs[attr.name] = attr.value;

            match = attr.value.match(paramRegex);

            // __0, __1
            if (match) {
                attrs[attr.name] = params[parseInt(match[1])];
            } else {
                if (typeof attr.value === "string") {
                    attrs[attr.name] = view.tmpl(attr.value, component, scope);

                    if (typeof attrs[attr.name] === "function") {
                        attrs[attr.name] = attrs[attr.name].bind(component);
                    }
                    // el atributo puede llegar a cambiar, tiene una llave. Lo marco como elegible para escuchar los cambios del MVCObject
                    else if (tieneLlaves.test(attr.value)) {
                        bindeableAttrs[attr.name] = attr.value;
                    }
                }
            }

            if (attr.name == 'name') {
                name = attrs[attr.name];
            }

            if (attr.name == 'scope') {
                scope = attrs[attr.name];
            }
        }

        widgetCtor = widgetCtor || widgets.BaseElement;

        var hijos = widgetCtor.EMPTY_TAG ? [] : getChildNodes(node, params, component, scope);

        var ret: Widget = new widgetCtor(node, attrs, hijos, params, component, scope);

        for (let attrName in bindeableAttrs) {
            listenersConLlaves.push({
                name: attrName,
                fn: (function(value, component) {
                    return function() {
                        return tmpl_pointer(value, component, ret.scope || undefined);
                    }
                })(bindeableAttrs[attrName], component)
            });
        }



        if (listenersConLlaves.length)
            ret.mustUpdateOnScopeChange = listenersConLlaves;

        for (var at in bindeableAttrs) {
            if (typeof bindeableAttrs[at] == "string" && component)
                ret.listening.push(bindWidgetAttr(at, bindeableAttrs[at], component, ret, scope));
        }


        if (node.nodeName == "content" && (!(<any>component)._contentSelector || (<any>component)._contentSelector == "content")) {
            component.contentNode = ret.rootNode;
        }

        if (name && component) {
            component[name] = ret;
        }

        return ret;
    }

    function getChildNodes(node: Node, params, component: Widget, scope?): IChildWidget[] {
        // recursively turn children into components
        var childNodes: IChildWidget[] = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var childWidget = domToWidgets(node.childNodes[i], params, component, scope);

            if (childWidget) {
                childNodes.push(childWidget);
            }
        }
        return childNodes;
    }

    function getJQueryEventWrapper(originalCallback, widget) {
        return function(event) {
            var eventObject = {
                event: event.originalEvent,
                data: widget.scope,
                element: widget.rootNode
            };

            return originalCallback.call(widget, eventObject);
        }
    }

    function errorLoadingTemplate(ev: Event) {
        console.error("Error loading template. ", this, ev);
    }



    var regexpOn = /^on[_]{0,1}(.*)$/;
    var ignoredAttrs = { tag: 1 };

    export class Widget extends mz.MVCObject implements IChildWidget {
        static EMPTY_TAG = false;
        static props = {};
        static nodeName = null;

        static EVENTS = mz.copy({
            ComponentUnmounted: 'unmount',
            ComponentResized: 'resize',
            ComponentMounted: 'mount'
        }, mz.MVCObject.EVENTS)

        private scopedContentPool: Widget[][];

        rootNode: Element;
        
        // element where all the children will be appended
        
        contentNode: Element;
        originalNode: Node;

        children: IChildWidget[];

        listening: EventDispatcherBinding[] = [];
        innerWidget: mz.Widget = null;

        mustUpdateOnScopeChange: any[];

        private contentFragment: DocumentFragment;
        private _contentSelector: string;

        protected attrDirectives: Dictionary<AttributeDirective>;

        private _unwrapedComponent: boolean;

        defaultTemplate: string;
        selectorTemplate: string;
        remoteTemplate: string;

        @mz.MVCObject.proxy
        scope: any;

        scope_changed(scope) {
            (<any>this.rootNode).$scope = scope;
        }

        private _cachedDOM: JQuery;

        get DOM(): JQuery {
            return this._cachedDOM || (this._cachedDOM = $(this.rootNode));
        }

        constructor(originalNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], private _params: any = null, private _parentComponent: Widget = null, scope?: any) {
            super();

            this.originalNode = originalNode;

            this.contentFragment = document.createDocumentFragment();
            this.contentNode = this.rootNode = document.createElement(attr && attr["tag"] || originalNode && originalNode.nodeName || (<any>this["constructor"]).nodeName || (<any>this["constructor"]).name || 'div');

            (<any>this.rootNode).$widget = this;
            (<any>this.rootNode).$component = _parentComponent;

            this.scope = scope;

            this.children = children;

            if (this.defaultTemplate) {
                this.startComponent([this.defaultTemplate]);
                mz.dom.microqueue.callback(() => {
                    this.componentInitialized();
                    this.emit(Widget.EVENTS.ComponentMounted)
                });

            }

            if (attr) {
                this.initAttr(attr);
            }

            if (this.defaultTemplate) {
                this.appendChildrens();
            }

            if (this.remoteTemplate)
                this.loadTemplate(this.remoteTemplate);
        }

        protected generateScopedContent(scope?): IChildWidget[] {
            
            // check if i have an element from object pool
            if (this.scopedContentPool && this.scopedContentPool.length) {
                let scopedContent = this.scopedContentPool.pop();
                setScopeRecursiveAndEnableListeners(scopedContent, scope);
                return scopedContent;
            }
            
            // elsewhere, let's create the object
            return getChildNodes(this.originalNode, this._params, this._parentComponent, scope || null);
        }

        protected releaseScopedContent(scopedContent: Widget[]) {
            // create object poll if necesary
            if (!this.scopedContentPool)
                this.scopedContentPool = [];

            for (var i = 0; i < scopedContent.length; i++) {
                var e = scopedContent[i];
                if (e.rootNode) mz.dom.adapter.remove(e.rootNode);
                if (e.listening) {
                    for (let evt = 0; evt < e.listening.length; evt++) {
                        e.listening[evt].disable();
                    }
                }
            }

            this.scopedContentPool.push(scopedContent);
        }

        attr(attrName: string, value?: any) {
            let attrNameLower = attrName.toLowerCase();

            if (arguments.length == 1) {
                if (this.attrDirectives && attrNameLower in this.attrDirectives)
                    return this.attrDirectives[attrNameLower].value;

                return this.data[attrName];
            } else {
                var boolAttr = attrNameLower in boolAttrs;
                var typeofValue = typeof value;

                if (boolAttr) {
                    if (typeofValue === "function")
                        value = value();

                    value = CBool(value);

                    typeofValue = "boolean";
                }

                let prevValue = this.get(attrName);

                if (attrNameLower in AttributeDirective.directives && AttributeDirective.directives[attrNameLower]) {
                    if (!this.attrDirectives)
                        this.attrDirectives = {};

                    if (attrNameLower in this.attrDirectives)
                        this.attrDirectives[attrNameLower].value = value;
                    else
                        this.attrDirectives[attrNameLower] = new AttributeDirective.directives[attrNameLower](this, this._parentComponent, value);

                    this.set(attrName, this.attrDirectives[attrNameLower].value);
                } else {
                    this.set(attrName, value);
                    if (boolAttr) {
                        if (value) {
                            if (!mz.dom.adapter.hasAttribute(this.rootNode, attrName))
                                mz.dom.adapter.setAttribute(this.rootNode, attrName, attrName);
                        } else {
                            if (mz.dom.adapter.hasAttribute(this.rootNode, attrName))
                                mz.dom.adapter.removeAttribute(this.rootNode, attrName);
                        }
                    } else if (regexpOn.test(attrName) && typeofValue === "function" && value !== prevValue) {
                        var cbName = regexpOn.exec(attrName)[1];

                        if (/^on_/.test(attrName)) {
                            prevValue && this.off(cbName, prevValue);
                            this.listening.push(this.on(cbName, value));
                        } else {
                            this.DOM.off(cbName);
                            this.DOM.on(cbName, getJQueryEventWrapper(value, this));
                        }
                    } else {
                        if ((typeofValue === "string" || typeofValue === "number" || typeofValue === "boolean") && !(/^:/.test(attrName))) {
                            if (attrNameLower in ignoredAttrs) return;

                            mz.dom.microqueue.setAttribute(this.rootNode, attrName, value);
                            //mz.dom.adapter.setAttribute(this.rootNode, attrName, value);
                        }
                    }
                }
            }
        }



        refreshScope() {
            // attr generators
            if (this.mustUpdateOnScopeChange) {
                for (var i = 0; i < this.mustUpdateOnScopeChange.length; i++) {
                    let e = this.mustUpdateOnScopeChange[i];
                    this.attr(e.name, e.fn());
                }
            }

            for (let index = 0; index < this.children.length; index++) {
                let e = this.children[index] as any;
                if (e && typeof e == "object") {
                    e.refreshScope && e.refreshScope();
                }
            }
        }

        // Finds an element within this component
        find(selector: string): Element[] {
            mz.dom.microqueue.flush();
            return mz.dom.adapter.querySelectorAll(this.rootNode, selector);
        }

        protected loadTemplate(url: string, forceSync: boolean = false) {
            if (url in widgetTemplateSource) {
                this.startComponent(widgetTemplateSource[url]);
                this.componentInitialized();
                //this.emit(Widget.EVENTS.ComponentMounted);
                //requestAnimationFrame(() => this.resize());
                mz.dom.microqueue.callback(() => {
                    this.resize();
                    this.emit(Widget.EVENTS.ComponentMounted);
                });
                return;
            }

            let xhr = new XMLHttpRequest();

            let transformedUrl = mz.getPath(url);

            xhr.addEventListener('load', (ev) => {
                if (xhr.responseXML && xhr.responseXML instanceof Document) {
                    widgetTemplateSource[url] = xhr.responseXML;
                    this.startComponent(xhr.responseXML);
                    this.componentInitialized();
                    //this.emit(Widget.EVENTS.ComponentMounted);
                    mz.dom.microqueue.callback(() => {
                        this.resize();
                        this.emit(Widget.EVENTS.ComponentMounted);
                    });
                    //requestAnimationFrame(() => this.resize());
                } else if (xhr.responseText && xhr.responseText.length) {
                    widgetTemplateSource[url] = [xhr.responseText];
                    this.startComponent([xhr.responseText], []);
                    this.componentInitialized();
                    //this.emit(Widget.EVENTS.ComponentMounted);
                    mz.dom.microqueue.callback(() => {
                        this.resize();
                        this.emit(Widget.EVENTS.ComponentMounted);
                    });
                    //requestAnimationFrame(() => this.resize());
                } else {
                    throw new TypeError("Unexpected response for mz.Widget.loadTemplate. Url: " + transformedUrl + ' (' + url + ')');
                }
            });

            xhr.onerror = errorLoadingTemplate;

            xhr.open("GET", transformedUrl, !forceSync);
            xhr.send();
        }

        protected componentInitialized() {

        }

        protected startComponent(xml: Document);
        protected startComponent(parts?: string[] | XMLDocument, ...params);
        protected startComponent(parts?: any, ...params) {
            if (parts) {
                let doc: Document = parts instanceof Array ? quasiToDom(parts) : parts;

                params = params || [];
                params.forEach((e, i) => {
                    if (typeof e === "function")
                        params[i] = e.bind(this);
                });

                if (doc.childNodes.length > 1) console.warn("Only one child node is allowed per widget.", doc, this);

                this.innerWidget = <Widget>domToWidgets(doc.firstChild, params, this);
            }

            if (this._unwrapedComponent) {
                let originalNode = this.rootNode;

                if (this.innerWidget) {
                    this.rootNode = this.innerWidget.rootNode;

                    if (this.rootNode != originalNode) {
                        for (var i = 0; i < originalNode.attributes.length; i++) {
                            var attrib = originalNode.attributes[i];

                            if (!('specified' in attrib) || attrib.specified) {
                                if (attrib.name.toLowerCase() == "class")
                                    mz.dom.adapter.addClass(this.rootNode, attrib.value);
                                else
                                    mz.dom.adapter.setAttribute(this.rootNode, attrib.name, attrib.value);
                            }
                        }

                        if (originalNode && originalNode.parentElement) {
                            mz.dom.adapter.replaceChild(originalNode.parentElement, this.rootNode, originalNode);
                        }
                    }
                }
            } else {
                this.innerWidget && mz.dom.adapter.appendChild(this.rootNode, this.innerWidget.rootNode);
            }

            if (!this.contentNode)
                this.contentNode = this.rootNode || this.contentNode;

            let apendeado = false;

            if (this._contentSelector)
                apendeado = this.findContentSelector();

            if (!apendeado)
                this.appendChildrens();

            return this.innerWidget;
        }

        protected appendChildrens() {
            this.children.forEach((element: any) => {
                if (element && typeof element == "object") {
                    if ('rootNode' in element && element.rootNode instanceof Node)
                        this.contentFragment.appendChild(element.rootNode);
                    else if ('DOM' in element && element.DOM)
                        element.DOM.appendTo(this.contentFragment);
                    else if ('node' in element && element.node)
                        this.contentFragment.appendChild(element.node);
                    else if (element instanceof Node)
                        this.contentFragment.appendChild(element);
                    else if ((<any>mz)._debug)
                        console.warn("Trying to add unknown child ", element, " to Widget!", this);
                } else if (element && typeof element == "string" && element.length > 0) {
                    this.contentFragment.appendChild(document.createTextNode(element));
                }
            });

            if (this.contentNode) {
                this.contentNode.appendChild(this.contentFragment);
            } else if (this.contentFragment.firstChild) {
                console.error("There is child elements on a Widget with wrong or without contentSelector ", this);
            }
        }

        protected findContentSelector(): boolean {
            var prevContent = this.contentNode;

            this.contentNode = this._contentSelector == ":root" ? this.rootNode : mz.dom.adapter.querySelector(this.rootNode, this._contentSelector);

            if (prevContent !== this.contentNode && this.contentNode) {
                this.appendChildrens();
                return true;
            }


            return false;
        }

        append(element: JQuery | mz.IWidget | Node | Element) {
            if (element && typeof element == "object") {
                if (element instanceof Node) {
                    this.contentNode.appendChild(element);
                } else if (element instanceof Widget) {
                    this.contentNode.appendChild((<mz.Widget>element).rootNode);
                } else if (element instanceof widgets.TextNode) {
                    this.contentNode.appendChild((<widgets.TextNode>element).rootNode);
                } else if (element instanceof $) {
                    return (<JQuery>element).appendTo($(this.contentNode));
                } else if ('DOM' in element && (<IWidget>element).DOM instanceof $) {
                    return (<IWidget>element).DOM.appendTo($(this.contentNode));
                } else {
                    return this.contentNode && $(element).appendTo(this.contentNode);
                }
            }
        }

        appendTo(element: JQuery | mz.IWidget | string | Element) {
            if (element && element instanceof Widget) {
                return element.append(this);
            } else if (element && typeof element == "object" && 'DOM' in (<any>element) && (<any>element).DOM instanceof $) {
                return (<mz.IWidget>element).DOM.append(this.rootNode);
            } else if (element && element instanceof $) {
                return (<JQuery>element).append(this.rootNode);
            } else {
                return $(element).append(this.rootNode);
            }
        }

        protected initAttr(attr: any) {
            if (attr) {
                for (let i in attr) {
                    this.attr(i, attr[i]);
                }
            }
        }
        /**
         * Resizes the current widget, it also sends a signal "resize" to all the childrens
         */
        resize() {
            this.emit(Widget.EVENTS.ComponentResized);
            this.innerWidget && this.innerWidget.resize && this.innerWidget.resize();
            this.children.forEach((e: any) => e && typeof e == 'object' && e.resize && e.resize());
        }
        /**
         *  Destroys the current widget and it's children
         */
        unmount() {
            if (this.attrDirectives)
                for (let i in this.attrDirectives)
                    ('unmount' in this.attrDirectives) && this.attrDirectives[i].unmount();

            mz.dom.adapter.remove(this.rootNode);
            this._cachedDOM && this._cachedDOM.remove();

            this.emit(Widget.EVENTS.ComponentUnmounted);
            this.off();

            if (this.scopedContentPool) {
                for (var i = 0; i < this.scopedContentPool.length; i++) {
                    var p = this.scopedContentPool[i];
                    for (var sub_i = 0; sub_i < p.length; sub_i++) {
                        var element = p[sub_i];
                        'unmount' in element && element.unmount()
                    }
                    p.length = 0;
                }
                this.scopedContentPool.length = 0;
                delete this.scopedContentPool;
            }

            for (let i of this.listening)
                i && i.off && i.off();

            this.listening.length = 0;

            delete this.data;

            for (let e of this.children) {
                if ('unmount' in e) (<any>e).unmount();
            }

            this.children.length = 0;
        }

        static RegisterComponent(componentName: string) {
            return function(target: Function) {

                if (componentName.toLowerCase() in (<any>mz).widgets)
                    console.warn("Component ", componentName, " alredy registered");

                (<any>target).nodeName = componentName;

                (<any>mz).widgets[componentName.toLowerCase()] = target;
            }
        }

        static ConfigureEmptyTag(target: Function) {
            (target as any).EMPTY_TAG = true;
        }

        static Template(template: string, contentSelector?: string) {
            if (template) {
                if (/^<(.*)>/.test(template.trim()))
                    return function(target: Function) {
                        target.prototype.defaultTemplate = template;

                        if (contentSelector && contentSelector.length)
                            target.prototype._contentSelector = contentSelector;
                    }
                else if (template.startsWith('#')) {
                    return function(target: Function) {
                        target.prototype.selectorTemplate = template;

                        if (contentSelector && contentSelector.length)
                            target.prototype._contentSelector = contentSelector;
                    }
                } else {
                    return function(target: Function) {
                        target.prototype.remoteTemplate = template;

                        if (contentSelector && contentSelector.length)
                            target.prototype._contentSelector = contentSelector;
                    }
                }
            } else return function(target: Function) {
                if (contentSelector && contentSelector.length)
                    target.prototype._contentSelector = contentSelector;
            }
        }

        static ConfigureUnwrapped(target: Function) {
            target.prototype._unwrapedComponent = true;
        }

        static ConfigureTag(tagName: string) {
            return function(target: Function) {
                target.prototype.tagName = true;
            }
        }

        static Attribute(target: mz.Widget, propertyKey: string | symbol) {
            if (delete target[propertyKey]) {
                Object.defineProperty(target, propertyKey.toString(), {
                    get: function() {
                        return this.attr(propertyKey);
                    },
                    set: function(value) {
                        this.attr(propertyKey, value);
                    },
                    enumerable: true
                });
            }
        }
    }

    export namespace Widget {


        export interface HTMLAttributes {
            accept?: string;
            acceptCharset?: string;
            accessKey?: string;
            action?: string;
            allowFullScreen?: boolean;
            allowTransparency?: boolean;
            alt?: string;
            async?: boolean;
            autoComplete?: boolean;
            autoFocus?: boolean;
            autoPlay?: boolean;
            cellPadding?: number | string;
            cellSpacing?: number | string;
            charSet?: string;
            checked?: boolean;
            classID?: string;
            cols?: number;
            colSpan?: number;
            content?: string;
            contentEditable?: boolean;
            contextMenu?: string;
            controls?: any;
            coords?: string;
            crossOrigin?: string;
            data?: string;
            dateTime?: string;
            defaultChecked?: boolean;
            defaultValue?: string;
            defer?: boolean;
            dir?: string;
            disabled?: boolean;
            download?: any;
            draggable?: boolean;
            encType?: string;
            form?: string;
            formAction?: string;
            formEncType?: string;
            formMethod?: string;
            formNoValidate?: boolean;
            formTarget?: string;
            frameBorder?: number | string;
            headers?: string;
            height?: number | string;
            hidden?: boolean;
            high?: number;
            href?: string;
            hrefLang?: string;
            htmlFor?: string;
            httpEquiv?: string;
            icon?: string;
            label?: string;
            lang?: string;
            list?: string;
            loop?: boolean;
            low?: number;
            manifest?: string;
            marginHeight?: number;
            marginWidth?: number;
            max?: number | string;
            maxLength?: number;
            media?: string;
            mediaGroup?: string;
            method?: string;
            min?: number | string;
            multiple?: boolean;
            muted?: boolean;
            name?: string;
            noValidate?: boolean;
            open?: boolean;
            optimum?: number;
            pattern?: string;
            placeholder?: string;
            poster?: string;
            preload?: string;
            radioGroup?: string;
            readOnly?: boolean;
            rel?: string;
            required?: boolean;
            role?: string;
            rows?: number;
            rowSpan?: number;
            sandbox?: string;
            scope?: string;
            scoped?: boolean;
            scrolling?: string;
            seamless?: boolean;
            selected?: boolean;
            shape?: string;
            size?: number;
            sizes?: string;
            span?: number;
            spellCheck?: boolean;
            src?: string;
            srcDoc?: string;
            srcSet?: string;
            start?: number;
            step?: number | string;
            style?: string;
            tabIndex?: number;
            target?: string;
            title?: string;
            type?: string;
            useMap?: string;
            value?: string;
            width?: number | string;
            wmode?: string;
            class?: string;

            // Non-standard Attributes
            autoCapitalize?: boolean;
            autoCorrect?: boolean;
            property?: string;
            itemProp?: string;
            itemScope?: boolean;
            itemType?: string;
            unselectable?: boolean;

        }
    }
}

namespace mz.widgets {
    export class BaseElement extends Widget {
        constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], _params: any = null, _parentComponent: Widget = null, scope = null) {
            if (rootNode) attr['tag'] = rootNode.nodeName;
            super(rootNode, attr, children, _params, _parentComponent, scope);
            this.appendChildrens();
        }
    }

    export class BasePagelet extends Widget {
        constructor(attr?: mz.Dictionary<any>) {
            super(null, attr || {}, [], this, this, null);
        }
    }

    export class InlinePagelet extends Widget {
        constructor(template: string, attr?: mz.Dictionary<any>) {
            super(null, attr || {}, [], this, this, null);
            this.startComponent([template]);
        }
    }
}

