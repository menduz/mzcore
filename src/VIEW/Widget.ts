/// <reference path="../mz.ts" />
/// <reference path="Tmpl.ts" />
/// <reference path="Helpers.ts" />
/// <reference path="../CORE/MVCObject.ts" />
/// <reference path="../CORE/Decorators.ts" />
/// <reference path="TextNode.ts" />


module mz {
    export interface IChildWidget extends mz.IWidget {
        node: Node;
        children: IChildWidget[];
        listening: any[];
    }

    export interface IMZComponentEvent {
        event: Event;
        data: any;
        element: Element;
        $element: JQuery;
        jQueryEvent?: JQueryEventObject;
    }

    export interface IMZComponentDirective<T extends mz.Widget> {
        (value: any, widget: T, parent: Widget): void;
    }

    export interface IMZComponentDirectiveCollection {
        [attributte: string]: IMZComponentDirective<any>;
    }

    function delegateRefreshScope(e) {
        if (e && typeof e == "object") {
            'refreshScope' in e && e.refreshScope();
        }
    }



    var templateCache: Dictionary<Document> = {};

    var paramRegex = /^__(\d)+$/;
    var tieneLlaves = /\{|\}/;

    var testScope = /^{scope\./;

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

    /**
    * Esta función es usada para bindear un atributo a los cambios de MVCObject que pueden llegar a modificar el valor del atributo
    */
    function bindWidgetAttr(attrName, attrValue, observable: MVCObject, widget: Widget | JQuery, scope: any) {
        var match;
        
        // attr="{hola}" 
        // mando directamente Val(hola) a el atributo
        if (match = lonelyProperty.exec(attrValue)) {
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
                    var t = view.tmpl(attrValue, observable, scope);
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
    * Cacheo en memoria de los templates descargados
    */
    export var widgetTemplateSource: {
        [url: string]: any;
    } = {};

    function domToWidgets(node: Node, params, component: Widget, scope): Widget | IChildWidget {
        var match;

        // text node, comment, etc
        if (node.nodeValue) {
            var value = node.nodeValue;

            if (value.trim().length === 0) {
                return;
            }

            match = value.match(paramRegex);

            if (match)
                return params[parseInt(match[1])];

            if (tieneLlaves.test(value)) {
                var childWidget = widgets.TextNode.getFromPoll(value, component, scope);

                // Si el valor del text se no mete en el scope directamente "{scope.hola}"
                if (component && !(testScope.test(value))) {


                    if (match = lonelyProperty.exec(value)) {
                        childWidget.listening.push(component.on(match[1] + '_changed', function(a, b) {
                            if (a != b) {
                                if (typeof a === "undefined" || a === null) a = '';
                                if (childWidget.node.textContent != a)
                                    childWidget.node.textContent = a;
                            }
                        }));
                    } else {
                        childWidget.listening.push(component.on('valueChanged', function(data, elem, a, b) {
                            if (a != b && value.indexOf(elem) != -1) {
                                let t = view.tmpl(value, component, scope);
                                if (typeof t === "undefined" || t === null) t = '';
                                if (childWidget.node.textContent != t) {
                                    childWidget.node.textContent = t;
                                }
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
        var bindeableAttrs = {};

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
                        attrs[attr.name] = attrs[attr.name].bind(component);//testScope.test(attr.value) ? scope : component);
                    }  
                    // el atributo puede llegar a cambiar, tiene una llave. Lo marco como elegible para escuchar los cambios del MVCObject
                    else if (tieneLlaves.test(attr.value)) {
                        bindeableAttrs[attr.name] = attr.value;

                        attrs[':' + attr.name + '_upd'] = (function(value, component, scope) {
                            return function() {
                                return view.tmpl(value, component, scope);
                            }
                        })(attr.value, component, scope);
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

    function getChildNodes(node: Node, params, component: Widget, scope): IChildWidget[] {
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
                element: widget.rootNode,
                $element: widget.DOM,
                jQueryEvent: event
            };

            return originalCallback.call(widget, eventObject);
        }
    }

    function errorLoadingTemplate(ev: Event) {
        console.error("Error loading template. ", this, ev);
    }



    var regexpOn = /^on[_]{0,1}(.*)$/;
    var regexpAttrBinded = /^:(.*)_upd$/;
    var ignoredAttrs = { tag: 1 };

    export class Widget extends mz.MVCObject implements IChildWidget {
        static EMPTY_TAG = false;
        static props = {};

        DOM: JQuery;
        innerDOM: JQuery;
        rootNode: Element;
        contentNode: Element;
        protected attrs: Dictionary<any> = {};
        children: IChildWidget[];
        node: Node;
        listening: EventDispatcherBinding[] = [];
        innerWidget: mz.Widget = null;
        private contentFragment: DocumentFragment;
        private _contentSelector: string;

        private _unwrapedComponent: boolean;

        defaultTemplate: string;

        @mz.MVCObject.proxy
        visible: boolean;

        @mz.MVCObject.proxy
        scope: any;

        scope_changed(scope) {
            (<any>this.rootNode).$scope = scope;
        }

        constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], private _params: any = null, private _parentComponent: Widget = null, scope = null) {
            super();

            this.contentFragment = document.createDocumentFragment();
            this.contentNode = this.rootNode = document.createElement(attr && attr["tag"] || rootNode && rootNode.nodeName || (<any>this["constructor"]).nodeName || (<any>this["constructor"]).name || 'div');


            (<any>this.rootNode).$widget = this;
            (<any>this.rootNode).$component = _parentComponent || this;

            this.node = rootNode || this.rootNode;

            this.DOM = $(this.rootNode);

            this.scope = scope || null;

            this.children = children;
            this.attrs = attr || {};

            if (this.defaultTemplate) {
                this.startComponent([this.defaultTemplate]);
            }

            if (attr) {
                this.initAttr(attr);
            }

            if (this.defaultTemplate) {
                this.appendChildrens();
            }
        }

        protected setUnwrapedComponent(value: boolean) {
            if (this._unwrapedComponent != undefined) {
                throw new Error("unwrapedComponent can be setted only once");
            }

            this._unwrapedComponent = value;

            if (value) {
                var originalNode = this.rootNode;

                if (this.innerDOM) {
                    this.DOM = this.innerDOM;
                    this.rootNode = this.DOM[0];
                }

                if (originalNode && originalNode.parentElement && this.rootNode != originalNode) {
                    originalNode.parentElement.replaceChild(this.rootNode, originalNode)
                }
            }
        }

        protected generateScopedContent(scope?): IChildWidget[] {
            return getChildNodes(this.node, this._params, this._parentComponent, scope || this);
        }

        protected visible_changed(val) {
            if (val && CBool(val) && val !== "0" && val.toString().toLowerCase() != "false") {
                this.DOM.removeClass('mz-hidden').removeAttr('aria-hidden').removeAttr(mz.HIDDEN_PROP);
            } else {
                this.DOM.addClass('mz-hidden').attr('aria-hidden', "true").attr(mz.HIDDEN_PROP, mz.HIDDEN_PROP);
            }
        }

        attr(attrName: string, value?: any) {
            let attrNameLower = attrName.toLowerCase();

            if (value === undefined) {
                return this.get(attrName) || this.DOM.attr(attrName);
            } else {

                var boolAttr = attrNameLower in boolAttrs;
                var typeofValue = typeof value;

                if (boolAttr) {
                    if (typeofValue === "function")
                        value = value();

                    value = CBool(value) && value.toString().toLowerCase() !== "false" && value !== "0";
                }

                this.set(attrName, value);
                this.attrs[attrName] = value;

                if (attrNameLower in Widget.directives && Widget.directives[attrNameLower]) {
                    Widget.directives[attrNameLower](value, this, this._parentComponent);
                } else if (boolAttr) {
                    if (value) {
                        this.DOM.prop(attrName, value);
                    } else {
                        this.DOM.removeProp(attrName);
                    }
                } else if (regexpOn.test(attrName) && typeofValue === "function") {
                    var cbName = regexpOn.exec(attrName)[1];

                    if (/^on_/.test(attrName))
                        this.listening.push(this.on(cbName, value));
                    else
                        this.DOM.on(cbName, getJQueryEventWrapper(value, this));
                } else {
                    if (!(/^:/.test(attrName)) && (typeofValue === "string" || typeofValue === "number" || typeofValue === "boolean")) {
                        if (attrNameLower in ignoredAttrs) return;

                        this.DOM.attr(attrName, value);
                    }
                }
            }
        }



        refreshScope() {
            let data = this.data;

            // the attrs who has the form ":(attName)_upd" (regexpAttrBinded) are attr generators for "attrName"
            for (var i in data) {
                let match = null;

                if (typeof data[i] == "function" && (match = regexpAttrBinded.exec(i))) {
                    this.attr(match[1], data[i]());
                }
            }

            this.children.forEach(delegateRefreshScope);
        }


        // Finds an element within this component
        find(selector: string | Element | JQuery): JQuery {
            return this.DOM.find(<any>selector);
        }

        protected loadTemplate(url: string, forceSync: boolean = false) {
            if (url in widgetTemplateSource) {
                this.startComponent(widgetTemplateSource[url]);
                return;
            }

            let xhr = new XMLHttpRequest();

            let transformedUrl = mz.getPath(url);

            xhr.addEventListener('load', (ev) => {
                if (xhr.responseXML && xhr.responseXML instanceof Document) {
                    widgetTemplateSource[url] = xhr.responseXML;
                    this.startComponent(xhr.responseXML);
                    this.componentInitialized();
                    requestAnimationFrame(() => this.resize());
                } else if (xhr.responseText && xhr.responseText.length) {
                    widgetTemplateSource[url] = [xhr.responseText];
                    this.startComponent([xhr.responseText], []);
                    this.componentInitialized();
                    requestAnimationFrame(() => this.resize());
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

                if (!this._contentSelector) {
                    if (doc.firstChild && doc.firstChild.childNodes.length == 0)
                        this._contentSelector = ':root';
                    else
                        this._contentSelector = 'content';
                }

                this.innerWidget = <Widget>domToWidgets(doc.firstChild, params, this, this.scope);

                this.innerDOM = this.innerWidget.DOM;
            }

            if (this._unwrapedComponent) {
                let originalNode = this.rootNode, originalNode$ = this.DOM;

                if (this.innerDOM) {
                    this.DOM = this.innerDOM;
                    this.rootNode = this.DOM[0];

                    if (this.rootNode != originalNode) {
                        for (var i = 0; i < originalNode.attributes.length; i++) {
                            var attrib = originalNode.attributes[i];

                            if (!('specified' in attrib) || attrib.specified) {
                                if (attrib.name.toLowerCase() == "class")
                                    this.DOM.addClass(attrib.value);
                                else
                                    this.DOM.attr(attrib.name, attrib.value);
                            }
                        }

                        if (originalNode && originalNode.parentElement) {
                            originalNode.parentElement.replaceChild(this.rootNode, originalNode.parentElement)
                        }
                    }
                }
            }

            if (this.innerDOM || !this.contentNode)
                this.contentNode = this.innerDOM && this.innerDOM[0] || this.rootNode || this.contentNode;

            if (this.innerDOM && this.innerDOM != this.DOM)
                this.innerDOM.appendTo(this.DOM);

            let apendeado = false;

            if (this._contentSelector)
                apendeado = this.setContentSelector(this._contentSelector);

            if (!apendeado)
                this.appendChildrens();

            return this.innerWidget;
        }

        protected appendChildrens() {
            this.children.forEach((element: any) => {
                if (element && typeof element == "object") {
                    if ('rootNode' in element && element.rootNode instanceof HTMLElement)
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

        protected setContentSelector(selector: string): boolean {
            this._contentSelector = selector;
            if (this.innerDOM) { // Component started
                var prevContent = this.contentNode;
                this.contentNode = selector == ":root" ? this.rootNode : (<HTMLElement>this.rootNode).querySelector(selector);

                if (prevContent !== this.contentNode && this.contentNode) {
                    this.appendChildrens();
                    return true;
                }
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
                    this.contentNode.appendChild((<widgets.TextNode>element).node);
                } else if (element instanceof $) {
                    return (<JQuery>element).appendTo($(this.contentNode));
                } else if ('DOM' in element && (<IWidget>element).DOM instanceof $) {
                    return (<IWidget>element).DOM.appendTo($(this.contentNode));
                } else {
                    return $(element).appendTo($(this.contentNode));
                }
            }
        }

        appendTo(element: JQuery | mz.IWidget | string | Element) {
            if (element && element instanceof Widget) {
                return (<mz.Widget>element).append(this);
            } else if (element && typeof element == "object" && 'DOM' in (<any>element) && (<any>element).DOM instanceof $) {
                return (<mz.IWidget>element).DOM.append(this.DOM);
            } else if (element && element instanceof $) {
                return (<JQuery>element).append(this.DOM);
            } else {
                return $(element).append(this.DOM);
            }
        }

        protected initAttr(attr: any) {

            if (attr) {
                if (!this.attrs) this.attr = attr;
                for (let i in attr) {
                    this.attr(i, attr[i]);
                }
                if ('class' in attr && this.visible == false) {
                    this.visible_changed(false);
                }
            }
        }
        /**
         * Resizes the current widget, it also sends a signal "resize" to all the childrens
         */
        resize() {
            this.emit('resize');
            this.innerWidget && this.innerWidget.resize && this.innerWidget.resize();
            this.children.forEach((e: any) => e && typeof e == 'object' && e.resize && e.resize());
        }
        /**
         *  Destroys the current widget and it's children
         */
        unmount() {
            this.DOM.remove();
            this.innerDOM = null;
            this.emit('unmount');
            this.off();
            for (let i of this.listening) i && i.off && i.off();
            this.listening.length = 0;
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

        static IsEmptyTag(target: typeof Widget) {
            target.EMPTY_TAG = true;
        }

        static Template(template: string, contentSelector?: string) {
            return function(target: Function) {
                target.prototype.defaultTemplate = template;

                if (contentSelector && contentSelector.length)
                    target.prototype._contentSelector = contentSelector;
            }
        }

        static Unwrap(target: Function) {
            target.prototype._unwrapedComponent = true;
        }
    }
    export module widgets {
        export class BaseElement extends Widget {
            constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], _params: any = null, _parentComponent: Widget = null, scope = null) {
                if (rootNode) attr['tag'] = rootNode.nodeName;
                super(rootNode, attr, children, _params, _parentComponent, scope);
                this.appendChildrens();
            }
        }
    }

    export module Widget {
        export var directives: IMZComponentDirectiveCollection = {};
        export function registerDirective<T extends mz.Widget>(attrName: string, callback: (value: any, widget: T, parent: Widget) => void) {
            let lowerCaseName = attrName.toLowerCase();
            if (lowerCaseName in directives) {
                console.warn("There is alredy a directive for '" + lowerCaseName + "'. It would be replaced.");
            }

            directives[lowerCaseName] = callback;
        }

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

module mz.widgets {
    export class BasePagelet extends Widget {
        constructor(attr?: mz.Dictionary<any>) {
            super(null, attr || {}, [], this, this, this);
        }
    }

    export class InlinePagelet extends Widget {
        constructor(template: string, attr?: mz.Dictionary<any>) {
            super(null, attr || {}, [], this, this, this);
            this.startComponent([template]);
        }
    }
}

