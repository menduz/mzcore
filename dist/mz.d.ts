/// <reference path="src/TSD/JQuery.d.ts" />
/// <reference path="src/TSD/Promise.d.ts" />
declare function isDef(b: any): boolean;
declare var window: Window;
declare var global: any;
declare var CBool: (Cosa: any) => boolean;
declare var Symbol: (name: string) => symbol | string;
declare namespace mz {
    interface IWidget {
        DOM: JQuery;
    }
    interface Dictionary<V> {
        [key: string]: V;
    }
    interface Point {
        x: number;
        y: number;
    }
    interface Size {
        width: number;
        height: number;
    }
    interface IGenericCallback {
        (...Args: any[]): void;
    }
    interface IModuleCallback {
        (...Modules: any[]): void;
    }
    var globalContext: any;
    var _debug: any;
    var scriptBase: string;
    var core_path: any;
    function alias(clave: any, ruta: any): void;
    function getPath(path: string, root?: string): any;
    function getElementPosition(element: Element | JQuery): {
        x: number;
        y: number;
    };
    const emptyFn: () => void;
    const oldCopy: (b: any, c: any) => any;
    /**
    Copia todas las propiedades de los parametros dentro del primer parametro. Si se provee un solo parametro, hace una copia.

    La copia se realiza en orden

    <code>
    mz.copy(a, b, c)

    //a <- b copia el contenido de B en A
    //a <- c luego copia el contenido de C en A
    </code>
    */
    function copy<T>(Destination: T): T;
    function copy<T, V>(Destination: T, Source: V): T & V;
    function copy<T, V, V1>(Destination: T, Source: V, Source1: V1): T & V & V1;
    function copy<T, V, V1, V2>(Destination: T, Source: V, Source1: V1, Source2: V2): T & V & V1 & V2;
    function copy<T, V, V1, V2, V3>(Destination: T, Source: V, Source1: V1, Source2: V2, Source3: V3): T & V & V1 & V2 & V3;
    function mapXInto(propiedades: string[], destino: any, ...n_args: any[]): any;
    function mapInto(destino: any, ...n_args: any[]): any;
    function isIterable(a: any): boolean;
    function trim(text: any): string;
    function getDOMID(): string;
    function genUID(): number;
    const intval: (mixed_var: any, base?: number) => number;
    const CBool: (val: any) => boolean;
    /**
    Obtiene el valor de la clave del query string

    @method queryString
    @param {String} key
    */
    const queryString: (key: any) => string;
    /**
    Devuelve un valor booleano en base a la expresion. Si __expr__ es una función, la llama.

    @method readBool
    @param {Expression} expr
    */
    const readBool: (cosa: any, datos: any, datos2: any) => boolean;
    /**
    Devuelve un valor tipo string en base a la expresion. Si __expr__ es una función, la llama.

    @method readString
    @param {Expression} expr
    */
    const readString: (cosa: any, datos: any, datos2: any) => string;
    /**
    Devuelve un valor en base a la expresion. Si __expr__ es una función, la llama.

    @method readVar
    @param {Expression} expr
    */
    const readVar: (cosa: any, datos: any, datos2: any) => any;
    /**
    Crea un delayer para la función

    @method delayer
    @param {Function} callback
    @param {Int} defTimeout
    @return {Function} FunctionDelayer
    */
    const delayer: <T>(fn: T, defTimeout: number, thisp?: any) => T & {
        now: T;
        cancel: () => void;
    };
    /**
    Debounces the current call until the next frame

    @method delayer
    @param {Function} fn
    @return {Function} FunctionDelayer
    */
    const screenDelayer: <T>(fn: T, thisp?: any) => T & {
        now: T;
        cancel: () => void;
    };
    const traspose: (a: any) => any[];
    /**
    Obtiene el valor del Performance Counter

    @method now
    @return {Number} PerformanceCounter
    */
    const now: () => number;
    const blankImage: string;
    const transformTag: any;
    namespace data.order {
        function null_arriba(a: any, b: any, campo: any): number;
        function null_abajo(a: any, b: any, campo: any): number;
        function build(elems: any): any;
    }
    var hardCodedFiles: Dictionary<string>;
    function escapeRegExp(str: any): any;
    function loadCss(url: string): any;
    function fnInfo(fn: any): {
        params: any;
        body: any;
    };
    function compileFilter<T>(filter: (element: T) => boolean): (elements: T[]) => T[];
    function getWindowSize(): Size;
    function globalCallback(cb: Function): string;
    function buscarArgumentoTipo(tipo: any, argu: any): any;
}
declare module mz.view {
    function tmpl(str: string, context: any, scope?: any): any;
    module tmpl {
        var debug: boolean;
        function internalTmpl(s: string, p?: any): Function;
        function expr(s: any, n?: any): string;
        function wrap(s: any, nonull: any): string;
        function split(str: any, substrings: any): any[];
        function extract(str: any, open: any, close: any): any[];
    }
}
declare namespace mz {
    var HIDDEN_PROP: string;
    var hiddenProp: string;
    var TRANSFORM_STYLE: string;
    var TRANSFORM_CSS: string;
}
declare module mz {
    class EventDispatcherBinding {
        id: string;
        cb: any;
        evento: string;
        sharedList: any;
        object: EventDispatcher;
        off(): void;
    }
    class EventDispatcher {
        static EVENTS: {};
        private ed_bindeos;
        private ed_bindeosTotales;
        private ed_bindCount;
        on(event: string, callback: Function, once?: boolean): any;
        once(event: string, callback: Function): any;
        off(bindeo?: string | Function | EventDispatcherBinding, callback?: Function): void;
        emit(event: string, ...params: any[]): any[];
        trigger: (event: string, ...params: any[]) => any[];
    }
}
declare namespace mz {
    class MVCObject extends mz.EventDispatcher {
        static EVENTS: {
            setValues: string;
            valueChanged: string;
        } & {};
        protected data: Dictionary<any>;
        constructor(args?: any);
        getAll(): Dictionary<any>;
        setValues(values: any | MVCObject, emit?: boolean): void;
        set(field: string, value: any, NoTrigerearChanged?: boolean): void;
        get(field: string): any;
    }
}
declare namespace mz.MVCObject {
    function proxy(target: mz.MVCObject, propertyKey: string | symbol): void;
}
declare module mz.core.decorators {
    function LogResult(target: Function, key: string, value: any): {
        value: (...args: any[]) => any;
    };
    function noEnumerable(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function delayer(timeout: number): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function screenDelayer<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void;
}
declare module mz.widgets {
    class TextNode implements mz.IChildWidget {
        private value;
        private component;
        private scope;
        node: Text;
        children: any[];
        listening: EventDispatcherBinding[];
        DOM: JQuery;
        constructor(value: string, component: Widget, scope: any);
        setup(value: string, component: Widget, scope: any): void;
        unmount(): void;
        refreshScope(): void;
        private static pollObjects;
        static returnToPoll(val: TextNode): void;
        static getFromPoll(value: string, component: Widget, scope: any): TextNode;
    }
}
declare module mz {
    class AttributeDirective {
        protected widget: Widget;
        protected component: Widget;
        private _value;
        constructor(widget: Widget, component: Widget, value: any);
        mount(): void;
        unmount(): void;
        protected changed(value: any, prevValue?: any): void;
        value: any;
    }
    module AttributeDirective {
        function Register(attrName: string): <T extends typeof AttributeDirective>(target: T) => void;
        const directives: IMZComponentDirectiveCollection;
    }
    interface IChildWidget extends mz.IWidget {
        node: Node;
        children: IChildWidget[];
        listening: any[];
    }
    interface IMZComponentEvent {
        event: Event;
        data: any;
        element: Element;
        $element: JQuery;
        jQueryEvent?: JQueryEventObject;
    }
    interface IMZComponentDirectiveCollection {
        [attributte: string]: typeof AttributeDirective;
    }
    /**
    * Cacheo en memoria de los templates descargados
    */
    var widgetTemplateSource: {
        [url: string]: any;
    };
    class Widget extends mz.MVCObject implements IChildWidget {
        private _params;
        private _parentComponent;
        static EMPTY_TAG: boolean;
        static props: {};
        DOM: JQuery;
        innerDOM: JQuery;
        rootNode: Element;
        contentNode: Element;
        protected attrs: Dictionary<any>;
        children: IChildWidget[];
        node: Node;
        listening: EventDispatcherBinding[];
        innerWidget: mz.Widget;
        private contentFragment;
        private _contentSelector;
        protected attrDirectives: Dictionary<AttributeDirective>;
        private _unwrapedComponent;
        defaultTemplate: string;
        visible: boolean;
        scope: any;
        scope_changed(scope: any): void;
        constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], _params?: any, _parentComponent?: Widget, scope?: any);
        protected setUnwrapedComponent(value: boolean): void;
        protected generateScopedContent(scope?: any): IChildWidget[];
        attr(attrName: string, value?: any): any;
        refreshScope(): void;
        find(selector: string | Element | JQuery): JQuery;
        protected loadTemplate(url: string, forceSync?: boolean): void;
        protected componentInitialized(): void;
        protected startComponent(xml: Document): any;
        protected startComponent(parts?: string[] | XMLDocument, ...params: any[]): any;
        protected appendChildrens(): void;
        protected setContentSelector(selector: string): boolean;
        append(element: JQuery | mz.IWidget | Node | Element): JQuery;
        appendTo(element: JQuery | mz.IWidget | string | Element): JQuery;
        protected initAttr(attr: any): void;
        /**
         * Resizes the current widget, it also sends a signal "resize" to all the childrens
         */
        resize(): void;
        /**
         *  Destroys the current widget and it's children
         */
        unmount(): void;
        static RegisterComponent(componentName: string): (target: Function) => void;
        static IsEmptyTag(target: typeof Widget): void;
        static Template(template: string, contentSelector?: string): (target: Function) => void;
        static Unwrap(target: Function): void;
    }
    module widgets {
        class BaseElement extends Widget {
            constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], _params?: any, _parentComponent?: Widget, scope?: any);
        }
    }
    module Widget {
        interface HTMLAttributes {
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
declare module mz.widgets {
    class BasePagelet extends Widget {
        constructor(attr?: mz.Dictionary<any>);
    }
    class InlinePagelet extends Widget {
        constructor(template: string, attr?: mz.Dictionary<any>);
    }
}
declare namespace mz.widgets {
    class MzSwitcher extends mz.Widget {
        panelVisible: MzSwitcherPanel;
        panels: Collection<MzSwitcherPanel>;
        constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a: any, b: any, scope: any);
        show(panel: MzSwitcherPanel): void;
        resize(): void;
    }
    class MzSwitcherPanel extends mz.Widget {
        parent: MzSwitcher;
        show(): void;
        isVisible(): boolean;
    }
}
declare var Backbone: any;
declare namespace mz.app {
    interface IAppControllerRoute {
        name: string;
        route: string;
    }
    interface IAppControllerRouteModule extends IAppControllerRoute {
        page: IAppPage;
    }
    interface IAppPage {
        name: string;
        module: string;
        routes: Array<IAppControllerRoute>;
    }
    interface IAppPageModule extends IAppPage {
    }
    class Page extends mz.widgets.MzSwitcherPanel {
        routeHandler: mz.Dictionary<Function> | any;
        parent: PageCoordinator;
        constructor(appController: PageCoordinator);
        handleRoute(routeName: string, ...args: any[]): void;
        show(): void;
        static instance: Page;
    }
    class PageCoordinator extends mz.widgets.MzSwitcher {
        pages: mz.Collection<IAppPageModule>;
        actualPage: Page;
        constructor(opc: {
            templateUrl?: string;
            templateHtml?: string;
            templateSelector?: string;
            pages: string | Array<IAppPage>;
            pagesCollection?: mz.Collection<IAppPageModule>;
        });
        setPages(pages: Array<IAppPage>): void;
        routeHistory: string[];
        loaded(): void;
        show(page: Page): void;
        navigate(route: string, trigger?: boolean): void;
        getPage(pageName: string): Promise<Page>;
    }
}
declare namespace mz.auth.jwt {
    function urlBase64Decode(str: any): any;
    function decodeToken(token: any): any;
    function getTokenExpirationDate(token: any): Date;
    function isTokenExpired(token: string, offsetSeconds?: number): boolean;
}
declare module mz {
    interface I18nTranslate {
        (claveIdioma: string, defaultValue?: string): string;
    }
    interface I18nTranslate {
        faltantes?: any;
        idioma?: any;
    }
    var ñ: I18nTranslate;
}
declare var ñ: mz.I18nTranslate;
interface Date {
    add(intervalo: string, cantidad: number): Date;
    part(intervalo: string): string | number;
    asString(formato: string): string;
}
declare namespace mz.date {
    function parseObject<T>(json: T): T;
    /**
    * An Array of day names starting with Sunday.
    *
    * @example dayNames[0]
    * @result 'Sunday'
    *
    * @name dayNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    var dayNames: string[];
    /**
    * An Array of abbreviated day names starting with Sun.
    *
    * @example abbrDayNames[0]
    * @result 'Sun'
    *
    * @name abbrDayNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    var abbrDayNames: string[];
    /**
    * An Array of month names starting with Janurary.
    *
    * @example monthNames[0]
    * @result 'January'
    *
    * @name monthNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    var monthNames: string[];
    /**
    * An Array of abbreviated month names starting with Jan.
    *
    * @example abbrMonthNames[0]
    * @result 'Jan'
    *
    * @name monthNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    var abbrMonthNames: string[];
    /**
    * The first day of the week for this locale.
    *
    * @name firstDayOfWeek
    * @type Number
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    var firstDayOfWeek: number;
    /**
    * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
    *
    * @name format
    * @type String
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    var format: string;
    /**
    * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
    * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
    *
    * @name format
    * @type String
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    var fullYearStart: string;
    /**
    * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
    * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
    *
    * @example var dtm = Date.fromString("12/01/2008");
    * dtm.toString();
    * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
    *
    * @name fromString
    * @type Date
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    function fromString(s: any, f: any): Date;
    var _offsetServer: number;
    function newSyncro(): Date;
    function sync(url: any): void;
    function parse(date: any, format?: string): any;
    function add(date: any, intervalo: any, numero: any): any;
    function fmt_date(obj_date: any): any;
    function fmt_time(obj_date: any, segundos: any): string;
    function fmt_date_time(obj_date: any, segundos: any): string;
    function toString(date: any, fmt: any): any;
    function fmt_duracion(segundos: any, segs: any): string;
    function parseDuracion(val: any): any;
}
declare module mz.promise {
    function wait(time: number): <T>(data: T) => Promise<T>;
    function yield<T>(data: T): Promise<T>;
    function nextFrame<T>(data: T): Promise<T>;
    function parseStringDates<T>(data: T): Promise<T>;
    var parseJSON: (str: string) => Promise<any>;
}
declare module mz {
    /**
      * xr (c) James Cleveland 2015
      * URL: https://github.com/radiosilence/xr
      * License: BSD
      */
    function xr(args: any): Promise<xr.XrResponse>;
}
declare module mz.xr {
    var Methods: {
        GET: string;
        POST: string;
        PUT: string;
        DELETE: string;
        PATCH: string;
        OPTIONS: string;
    };
    var Events: {
        READY_STATE_CHANGE: string;
        LOAD_START: string;
        PROGRESS: string;
        ABORT: string;
        ERROR: string;
        LOAD: string;
        TIMEOUT: string;
        LOAD_END: string;
    };
    interface IXrEvents {
        readystatechange?: (e: ProgressEvent) => void;
        loadstart?: (e: Event) => void;
        progress?: (e: ProgressEvent) => void;
        abort?: (e: UIEvent) => void;
        error?: (e: ErrorEvent) => void;
        load?: (e: Event) => void;
        timeout?: (e: ProgressEvent) => void;
        loadend?: (e: ProgressEvent) => void;
    }
    interface IXrArgs {
        /**
         * process the response with this function
         */
        load?(x: any, xhr?: XMLHttpRequest): any;
        /**
         *  process the data before send it
         */
        dump?(dataToSend: any): any;
        /**
         * the data sould be sended as raw content
         */
        raw?: boolean;
        /**
         * data to be sent
         */
        data?: any;
        xmlHttpRequest?(): XMLHttpRequest;
        promise?(fn: any): Promise<xr.XrResponse>;
        params?: mz.Dictionary<any>;
        url?: string;
        skipAuthorization?: boolean;
        headers?: mz.Dictionary<any>;
        events?: IXrEvents;
        method?: string;
        withCredentials?: boolean;
    }
    namespace formatters {
        var json: (x: any) => any;
        var raw: (x: any) => any;
        var urlEncoded: (obj: any) => string;
        var multipart: (obj: any) => FormData;
    }
    var defaults: IXrArgs;
    interface XrResponse {
        status: number;
        xhr: XMLHttpRequest;
        response: any;
        data: any;
        url: string;
    }
    /**
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @kind function
     * @param {string} url The URL to be parsed.
     * @description Normalizes and parses a URL.
     * @returns {object} Returns the normalized URL as a dictionary.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *   | search        | The search params, minus the question mark                             |
     *   | hash          | The hash string, minus the hash symbol
     *   | hostname      | The hostname
     *   | port          | The port, without ":"
     *   | pathname      | The pathname, beginning with "/"
     *
     */
    function urlResolve(url: string): {
        href: string;
        protocol: string;
        host: string;
        search: string;
        hash: string;
        hostname: string;
        port: string;
        pathname: string;
    };
    /**
     * Parse a request URL and determine whether this is a same-origin request as the application document.
     *
     * @param {string|object} requestUrl The url of the request as a string that will be resolved
     * or a parsed URL object.
     * @returns {boolean} Whether the request is for the same origin as the application document.
     */
    function urlIsSameOrigin(requestUrl: any): boolean;
    /**
     * var moviles = 'Los Moviles/Autos'
     * mz.xr.urlEncode `@api/v1/${moviles}/1` -> '@api/v1/Los%20Moviles%2FAutos/1'
     */
    function urlEncode(literalSections: TemplateStringsArray, ...substs: any[]): string;
    var getAbsoluteUrl: (path: string) => string;
    function get(url: string, params?: any, args?: IXrArgs): Promise<XrResponse>;
    function put(url: string, data?: any, args?: IXrArgs): Promise<XrResponse>;
    function post(url: string, data?: any, args?: IXrArgs): Promise<XrResponse>;
    function patch(url: string, data?: any, args?: IXrArgs): Promise<XrResponse>;
    function del(url: string, args: IXrArgs): Promise<XrResponse>;
    function options(url: string, args: IXrArgs): Promise<XrResponse>;
}
interface String {
    capitalize(): string;
    setAt(charIndex: number, char: string): string;
    endsWith(part: string): boolean;
    startsWith(part: string): boolean;
    contains(part: string): boolean;
    toCamelCase(): string;
    isValidMail(): boolean;
    /** 'Hola {0}, mi nombre es {1}.'.format('Carlos', 'Esteban') => 'Hola Carlos, mi nombre es Esteban.' */
    format(...params: any[]): string;
}
declare var sp: String;
declare var re: RegExp;
declare namespace mz.oauth2 {
    interface IRoleChecker {
        (role: string): boolean;
    }
    var roleList: string[];
    var currentDomain: string, currentClientID: string;
    function tokenGetter(domain: string): {
        token: string;
        type: string;
    };
    function setToken(domain: string, token?: string, refreshToken?: string, tokenType?: string): void;
    function checkRole(role: string): boolean;
    function pushRoles(roles: string[] | string): void;
    function applyAuthorizationHeaders(xr: xr.IXrArgs): void;
    function configure(opts: {
        loginUrl?: string;
        refreshTokenUrl?: string;
        logoutUrl?: string;
        clientSecret?: string;
        clientId: string;
        scopes?: string[];
        xhrWithCredentials?: boolean;
    }): void;
    function refreshToken(): Promise<xr.XrResponse>;
    function logout(): Promise<xr.XrResponse>;
    function login(username: string, password: string): Promise<xr.XrResponse>;
    function loggedIn(): boolean;
    var on: (event: string, callback: Function, once?: boolean) => any;
    var emit: (event: string, ...params: any[]) => any[];
    var off: (bindeo?: string | Function | EventDispatcherBinding, callback?: Function) => void;
}
declare module mz {
    function require(Module: string): any;
    function require(Module: string, Callback: Function): void;
    function require(Module: string[], Callback: IModuleCallback): void;
    function include(url: string, nombreModulo: string, async?: boolean): boolean;
}
declare module mz.require {
    var routes: {
        key: string;
        source: string | RegExp;
        destination: string | RegExp | ((sourceName: string) => Promise<string>);
    }[];
    function route(matchPath: string | RegExp, destination: RegExp | string | ((sourceName: string) => Promise<string>)): any;
    function route(path: string): Promise<string>;
    function defineFiles(files: mz.Dictionary<string>): void;
}
declare module mz {
    var modules: Dictionary<Module>;
    class Module {
        exports: any;
        id: string;
        loaded: boolean;
        parent: any;
        children: any[];
        filename: string;
        path: string;
        defined: boolean;
        async: boolean;
        callbacks: any[];
        dependencias: {};
        ModuleExports: ModuleExports;
        constructor(name: any);
        getPath(x: any): any;
        require(Module: Array<string> | string, b?: any): void;
        define(...args: any[]): any;
        ñ(a: any, b: any): any;
    }
    class ModuleExports {
        module: Module;
        seteado: boolean;
        constructor(theModule: Module);
        set(factory: any, params: any): void;
    }
}
declare var module: mz.Module;
declare module mz {
    function undefine(mod: string): void;
    function define(ObjetoDefinido: Object): Object;
    function define(Callback: Function): void;
    function define(RequiredModules: string[], Callback: IModuleCallback): void;
    function define(Module: string, ObjetoDefinido: Object): Object;
    function define(Module: string, Callback: Function): void;
    function define(Module: string, RequiredModules: string[], Callback: IModuleCallback): void;
}
declare module mz.define {
    var amd: any;
    var lastModule: Module;
    var currentModule: Module;
}
declare namespace mz {
    class Collection<T> extends MVCObject {
        opciones: IMZCollectionOpc;
        protected array: T[];
        private __indice__;
        static EVENTS: {
            BeforeClearCollection: string;
            AfterClearCollection: string;
            Changed: string;
            ElementInserted: string;
            ElementChanged: string;
            ElementRemoved: string;
            ElementRangeInserted: string;
            CollectionSorted: string;
            ElementRangeRemoved: string;
        } & {
            setValues: string;
            valueChanged: string;
        } & {};
        agregandoLote: boolean;
        constructor(base?: T[], opc?: IMZCollectionOpc);
        first(): T;
        last(): T;
        /**
        Limpia la coleccion
        @method clear
        @param {Boolean} noTriggerear si es "true" entonces no se desencadena ningun evento del tipo "changed"
        */
        clear(noTriggerear?: boolean): void;
        /**
        Tamaño de la coleccion (getter)
        @property length
        */
        /**
        Tamaño de la coleccion (setter)
        @property length
        */
        length: number;
        getLength(): number;
        setLength(nuevoTamanio: number): this;
        /**
        The map() method creates a new array with the results of calling a provided function on every element in this array.
        El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
        @method map
        @param {Function} callback función que se va a ejecutar, a esta function se le pasa 1 argumento, el elemento de la coleccion que se esta iterando
        */
        map<J>(func: (elem: T) => J, thisp?: any): Collection<J>;
        /**
        The forEach() method executes a provided function once per array element.
        El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
        @method forEach
        @param {Function|MzDelegate} callback función que se va a ejecutar, a esta function se le pasan 2 argumentos, el elemento de la coleccion que se esta iterando y el indice (zero based) dentro de la coleccion.
        */
        forEach(func: (elem: T, index: number) => void, thisp?: any): void;
        /**
         * Basicamente lo que hace esta funcion es ejecutar lotes asincronicos que diren X tiempo cada uno, es util para procesar grandes cantidades de informacion y darle un feedback al usuario sin bloquear la pantalla.
         * Si iterationDurationMs es 0, entonces utiliza setImmediate y el tiempo de cada iteracion se setea en 32ms
         */
        asyncForEach(func: (elem: T, index: number) => void, iterationDurationMs?: number): void;
        private _indizar(elem, index);
        private _deindizar(elem);
        protected _reindizar(): void;
        /**
        Obtiene el elemento en la posicion "index" de la coleccion
        @method getAt
        @param {Number} index
        */
        getAt(index: number): T;
        reduce<U>(fn: (prev: U, curr: T, index: number, array: T[]) => U, initialValue?: U): U;
        /**
        Agrupa los elementos de la colección.
        Si "what" es tipo String, entonces va a asumir que es un campo y va a agrupar por ese campo.
        Si "what" es tipo Function, va a evaluar la función por cada elemento de la colección y agrupa por el resultado.

        Este método devuelve un objeto tipo Diccionario con el criterio de evaluación como clave y una coleccion de elementos como value
        @method groupBy
        @param {Mixed} what
        */
        groupBy(what: ((T) => string) | string): Dictionary<Collection<T>>;
        /**
        Obtiene la key de la coleccion
        @property key
        */
        key: string;
        /**
        Inserta un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "insert_at"
        @method insertAt
        @param {Number} indice
        @param {Mixed} elemento
        */
        insertAt(indice: number, elemento: T): void;
        /**
        Remueve un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "remove_at"
        @method removeAt
        @param {Number} indice
        @param {Mixed} elemento
        */
        removeAt(indice: number): T;
        /**
        Cambia un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "set_at"
        @method set_at
        @param {Number} indice
        @param {Mixed} elemento
        */
        setAt(indice: number, elemento: T): void;
        /**
        Inserta un elemento al final de la colección. Dispara evento "insert_at" y "changed" con los mismos argumentos
        @method push
        @param {Mixed} elemento
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        push(elemento: T, noTriggerear?: boolean): number;
        insert: (elemento: T, noTriggerear?: boolean) => number;
        /**
        Quita el elemento al final de la colección. Dispara evento "remove_at" y "changed" con los mismos argumentos
        @method pop
        @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
        */
        pop(noTriggerear?: boolean): T;
        addRange(array: T[] | Collection<T>, noTriggerearCadaUno?: boolean, noTriggerear?: boolean): this;
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        Si la coleccion tiene Key entonces busca en el indice. no importa que no sea el mismo elemento. De otro modo busca la referencia a ese elemento.

        @method update
        @param {Mixed} elemento El elemento a ser actualizado
        */
        update(elemento: T): this;
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        @method updateByKey
        @param {String} key clave a ser buscada en el índice interno
        */
        updateByKey(key: string): this;
        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        @method updateIndex
        @param {Nuber} indice ïndice del elemento a ser actualizado
        */
        updateIndex(index: number): this;
        join(delimitador: string): string;
        /**
        Suma elementos
        @method sum
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        sum(options: {
            groupBy: string;
            exclude?: string[];
            filtroCampos?: string[];
        }): Dictionary<any>;
        /**
         *	Simplemente ordena la colección. "what" puede tener cualquiera de estos formatos
         *		'Campo ASC, CampoB DESC'
         *		function(a, b) { return (a.Campo > b.Campo ? 1 : - 1) }
         *		'Campo'
         *
         *
         *	@method orderBy
         *	@param {Mixed} what
         */
        orderBy(what: ((a: T, b: T) => number) | string): this;
        orderByDesc(what: ((a: T, b: T) => number) | string): this;
        /**
        Devuelve true si hay algun elemento que cumpla con la condición
        @method some
        @param {Function} condicion
        */
        some(condition: (elem: T) => boolean): boolean;
        /**
         *	Devuelve una coleccion de elementos que cumplan con la condición. También se puede llamar usando dos argumentos
         *			.where('Campo', 3)
         *	Y va a devolver una colección con totos los elementos de la primera que tengan Campo == 3
         *	@method where
         *	@param {Function|MzDelegate} condicion
         */
        where(campoOCondicion: string | ((elemento: T) => boolean), valorCampo?: any): Collection<T>;
        /**
        Remueve un elemento buscandolo por clave
        @method removeByKey
        @param {String} key
        */
        removeByKey(key: string): T;
        /**
        Remueve el elemento pasado, o varios elementos en base a una condición.

        - Si se pasa el elemento para remover && la colección tiene clave primaria se va a remover por clave y no por referencia del objeto.
        - Si se pasa uno solo y hay varios elementos que matchean o esta repetido en la colección se va a remover el ultimo.
        - De esta forma se desencadena el evento "remove_at" y "changed" con los mismos argumentos

        Si se pasa una cóndición, el método devuelve una colección con los elementos quitados.

        - De esta forma se desencadena el evento "removed" y "changed" con los mismos argumentos

        @method remove
        @param {Mixed} condicion/elemento
        */
        remove(condicion: ((elemento: T) => boolean) | T): T[];
        /**
        Obtiene el primer elemento que matchee con la condición.
        También se puede llamar usando dos argumentos '.single('idEmpresa', 5)' y va a traer el primer elemento con idEmpresa == 5
        @method single
        @param {Mixed} condicion/campo
        @param {Mixed} equals
        @optional
        */
        single(condicion: ((elemento: T) => boolean)): T;
        /**
        Devuelve true si la coleccion contiene el elemento (busca por referencia, tiene que ser EL MISMO)
        @method contains
        @param {Object} elemento
        */
        contains(elem: T): boolean;
        /**
        Devuelve true si la coleccion contiene la clave
        @method containsKey
        @param {String} key
        */
        containsKey(key: string): boolean;
        /**
        Devuelve el indice de la primer ocurrencia del elemento. Si no lo encuentra devuelve -1
        @method indexOf
        @param {Object} elemento
        */
        indexOf(elem: T): number;
        /**
        Devuelve el indice de la última ocurrencia del elemento. Si no lo encuentra devuelve -1
        @method lastIndexOf
        @param {Object} elemento
        */
        lastIndexOf(elem: T): number;
        /**
        Crea un array y lo llena con el contenido de la colección
        @method toArray
        */
        toArray(): T[];
        /**
        Clona la colección. Las referencias a los objetos van a ser las mismas.
        @method clone
        */
        clone(): Collection<T>;
        /**
        Obtiene un elemento buscando en el indice interno por clave primaria
        @method indexedGet
        @param {String} key
        */
        indexedGet(key: string | number): T;
        /**
        Obtiene el índice un elemento buscando en el indice interno por clave primaria
        @method indexedGetIndex
        @param {String} key
        */
        indexedGetIndex(key: string | number): number;
        /**
        Hace un merge de un elemento dentro de la colección. Busca el elemento por clave primaria y actualiza sus prupiedades copiandole los nuevos campos. Si no lo encuentra lo inserta.
        @method mergeElem
        @param {Object} elem
        */
        mergeElem(elem: T | any): T;
        /**
            Buscar el o los elementos mas grandes
            @method max
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        max(opc: {
            groupBy: string;
            filtroCampos?: string[];
            exclude?: string[];
        }): any;
        /**
            Buscar el o los elementos mas chicos
            @method min
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        min(opc: {
            groupBy: string;
            filtroCampos?: string[];
            exclude?: string[];
        }): any;
        /**
        Promedio de los elementos.
    
        Cada elemento de el array de retorno tiene además la propiedad '[[cantidad]]' que indica la cantidad de elementos de ese subconjunto.
        @method avg
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        avg(opc: any): Dictionary<any>;
        take(cantidad: number, from?: number): any[];
        takeInto(destino: {
            push: (any) => void;
        }, cantidad: number, from?: number): this;
        swapItems(primero: number, segundo: number): this;
        count(groupBy: string | Function): any[];
        /** Reverses the actual collections order */
        reverse(): void;
        /**
         * Mergea una colección contra un array o colección. cuando eliminarNoMatcheados == true, Hace una intersección
         * - Merged = (Original ∈ New) + (New ∉ Original)
         * En todos los casos se va a llamar un evento changed del tipo insert_at, set_at o remove_at dependiendo de la operación.
         */
        mergeArray(array: T[] | any[] | Collection<T>, eliminarNoMatcheados?: boolean): {
            added: T[];
            removed: T[];
        };
        createView(): CollectionView<T>;
        /**
         * Usar con cuidado.
         */
        getPrivateArray(): T[];
    }
    class CollectionView<T> extends Collection<T> {
        constructor(base: Collection<T>, opc: IMZCollectionOpc);
        private _handleChanged(tipo, nuevo, viejo);
        private _remake(noTriggerear?);
        resort(): void;
        refresh(): void;
        filter(filter: (elem: T) => boolean): this;
        orderBy(q: any): this;
        orderByDesc(q: any): this;
        attachTo(obj: any): void;
        detach(): void;
    }
    interface IMZCollectionOpc {
        key?: string;
        initialSize?: number;
    }
}
declare namespace mz.core.dom {
    var adapter: mz.core.dom.AbstractDomAdapter;
    function setRootDomAdapter(theAdapter: mz.core.dom.AbstractDomAdapter): void;
}
declare namespace mz.core.dom {
    /**
     * Provides DOM operations in an environment-agnostic way.
     */
    abstract class AbstractDomAdapter {
        abstract hasProperty(element: any, name: string): boolean;
        abstract setProperty(el: Element, name: string, value: any): any;
        abstract getProperty(el: Element, name: string): any;
        abstract invoke(el: Element, methodName: string, args: any[]): any;
        abstract logError(error: any): any;
        abstract log(error: any): any;
        abstract logGroup(error: any): any;
        abstract logGroupEnd(): any;
        abstract getXHR(): XMLHttpRequest;
        /**
         * Maps attribute names to their corresponding property names for cases
         * where attribute name doesn't match property name.
         */
        attrToPropMap: {
            [key: string]: string;
        };
        abstract parse(templateHtml: string): any;
        abstract query(selector: string): any;
        abstract querySelector(el: any, selector: string): HTMLElement;
        abstract querySelectorAll(el: any, selector: string): any[];
        abstract on(el: any, evt: any, listener: any): any;
        abstract onAndCancel(el: any, evt: any, listener: any): Function;
        abstract dispatchEvent(el: any, evt: any): any;
        abstract createMouseEvent(eventType: any): any;
        abstract createEvent(eventType: string): any;
        abstract preventDefault(evt: any): any;
        abstract isPrevented(evt: any): boolean;
        abstract getInnerHTML(el: any): string;
        abstract getOuterHTML(el: any): string;
        abstract nodeName(node: any): string;
        abstract nodeValue(node: any): string;
        abstract type(node: any): string;
        abstract content(node: any): any;
        abstract firstChild(el: any): Node;
        abstract nextSibling(el: any): Node;
        abstract parentElement(el: any): Node;
        abstract childNodes(el: any): Node[];
        abstract childNodesAsList(el: any): Node[];
        abstract clearNodes(el: any): any;
        abstract appendChild(el: any, node: any): any;
        abstract removeChild(el: any, node: any): any;
        abstract replaceChild(el: any, newNode: any, oldNode: any): any;
        abstract remove(el: any): Node;
        abstract insertBefore(el: any, node: any): any;
        abstract insertAllBefore(el: any, nodes: any): any;
        abstract insertAfter(el: any, node: any): any;
        abstract setInnerHTML(el: any, value: any): any;
        abstract getText(el: any): string;
        abstract setText(el: any, value: string): any;
        abstract getValue(el: any): string;
        abstract setValue(el: any, value: string): any;
        abstract getChecked(el: any): boolean;
        abstract setChecked(el: any, value: boolean): any;
        abstract createComment(text: string): any;
        abstract createTemplate(html: any): HTMLElement;
        abstract createElement(tagName: any, doc?: any): HTMLElement;
        abstract createElementNS(ns: string, tagName: string, doc?: any): Element;
        abstract createTextNode(text: string, doc?: any): Text;
        abstract createScriptTag(attrName: string, attrValue: string, doc?: any): HTMLElement;
        abstract createStyleElement(css: string, doc?: any): HTMLStyleElement;
        abstract createShadowRoot(el: any): any;
        abstract getShadowRoot(el: any): any;
        abstract getHost(el: any): any;
        abstract getDistributedNodes(el: any): Node[];
        abstract clone(node: Node): Node;
        abstract getElementsByClassName(element: any, name: string): HTMLElement[];
        abstract getElementsByTagName(element: any, name: string): HTMLElement[];
        abstract classList(element: any): any[];
        abstract addClass(element: any, classname: string): any;
        abstract removeClass(element: any, classname: string): any;
        abstract hasClass(element: any, classname: string): boolean;
        abstract setStyle(element: any, stylename: string, stylevalue: string): any;
        abstract removeStyle(element: any, stylename: string): any;
        abstract getStyle(element: any, stylename: string): string;
        abstract tagName(element: any): string;
        abstract attributeMap(element: any): Dictionary<string>;
        abstract hasAttribute(element: any, attribute: string): boolean;
        abstract getAttribute(element: any, attribute: string): string;
        abstract setAttribute(element: any, name: string, value: string): any;
        abstract setAttributeNS(element: any, ns: string, name: string, value: string): any;
        abstract removeAttribute(element: any, attribute: string): any;
        abstract templateAwareRoot(el: any): any;
        abstract createHtmlDocument(): HTMLDocument;
        abstract defaultDoc(): HTMLDocument;
        abstract getBoundingClientRect(el: any): any;
        abstract getTitle(): string;
        abstract setTitle(newTitle: string): any;
        abstract elementMatches(n: any, selector: string): boolean;
        abstract isTemplateElement(el: any): boolean;
        abstract isTextNode(node: any): boolean;
        abstract isCommentNode(node: any): boolean;
        abstract isElementNode(node: any): boolean;
        abstract hasShadowRoot(node: any): boolean;
        abstract isShadowRoot(node: any): boolean;
        abstract importIntoDoc(node: Node): Node;
        abstract adoptNode(node: Node): Node;
        abstract getHref(element: any): string;
        abstract getEventKey(event: any): string;
        abstract resolveAndSetHref(element: any, baseUrl: string, href: string): any;
        abstract supportsDOMEvents(): boolean;
        abstract supportsNativeShadowDOM(): boolean;
        abstract getGlobalEventTarget(target: string): any;
        abstract getHistory(): History;
        abstract getLocation(): Location;
        abstract getBaseHref(): string;
        abstract resetBaseElement(): void;
        abstract getUserAgent(): string;
        abstract setData(element: any, name: string, value: string): any;
        abstract getComputedStyle(element: any): any;
        abstract getData(element: any, name: string): string;
        abstract requestAnimationFrame(callback: any): number;
        abstract cancelAnimationFrame(id: any): any;
        abstract performanceNow(): number;
        abstract getAnimationPrefix(): string;
        abstract getTransitionEnd(): string;
        abstract supportsAnimation(): boolean;
    }
}
declare namespace mz.core.dom {
    /**
     * Provides DOM operations in any browser environment.
     */
    abstract class GenericBrowserDomAdapter extends AbstractDomAdapter {
        private _animationPrefix;
        private _transitionEnd;
        constructor();
        getDistributedNodes(el: HTMLElement): Node[];
        resolveAndSetHref(el: HTMLAnchorElement, baseUrl: string, href: string): void;
        supportsDOMEvents(): boolean;
        supportsNativeShadowDOM(): boolean;
        getAnimationPrefix(): string;
        getTransitionEnd(): string;
        supportsAnimation(): boolean;
        getXHR(): XMLHttpRequest;
    }
    class BrowserDomAdapter extends GenericBrowserDomAdapter {
        parse(templateHtml: string): void;
        static makeCurrent(): void;
        hasProperty(element: any, name: string): boolean;
        setProperty(el: any, name: string, value: any): void;
        getProperty(el: any, name: string): any;
        invoke(el: any, methodName: string, args: any[]): any;
        logError(error: any): void;
        log(error: any): void;
        logGroup(error: any): void;
        logGroupEnd(): void;
        attrToPropMap: any;
        query(selector: string): any;
        querySelector(el: any, selector: string): HTMLElement;
        querySelectorAll(el: any, selector: string): any[];
        on(el: any, evt: any, listener: any): void;
        onAndCancel(el: any, evt: any, listener: any): Function;
        dispatchEvent(el: any, evt: any): void;
        createMouseEvent(eventType: string): MouseEvent;
        createEvent(eventType: any): Event;
        preventDefault(evt: Event): void;
        isPrevented(evt: Event): boolean;
        getInnerHTML(el: any): string;
        getOuterHTML(el: any): string;
        nodeName(node: Node): string;
        nodeValue(node: Node): string;
        type(node: HTMLInputElement): string;
        content(node: Node): Node;
        firstChild(el: any): Node;
        nextSibling(el: any): Node;
        parentElement(el: any): Node;
        childNodes(el: any): Node[];
        childNodesAsList(el: any): any[];
        clearNodes(el: any): void;
        appendChild(el: any, node: any): void;
        removeChild(el: any, node: any): void;
        replaceChild(el: Node, newChild: any, oldChild: any): void;
        remove(node: any): Node;
        insertBefore(el: any, node: any): void;
        insertAllBefore(el: any, nodes: any): void;
        insertAfter(el: any, node: any): void;
        setInnerHTML(el: any, value: any): void;
        getText(el: any): string;
        setText(el: any, value: string): void;
        getValue(el: any): string;
        setValue(el: any, value: string): void;
        getChecked(el: any): boolean;
        setChecked(el: any, value: boolean): void;
        createComment(text: string): Comment;
        createTemplate(html: any): HTMLElement;
        createElement(tagName: any, doc?: Document): HTMLElement;
        createElementNS(ns: any, tagName: any, doc?: Document): Element;
        createTextNode(text: string, doc?: Document): Text;
        createScriptTag(attrName: string, attrValue: string, doc?: Document): HTMLScriptElement;
        createStyleElement(css: string, doc?: Document): HTMLStyleElement;
        createShadowRoot(el: HTMLElement): DocumentFragment;
        getShadowRoot(el: HTMLElement): DocumentFragment;
        getHost(el: HTMLElement): HTMLElement;
        clone(node: Node): Node;
        getElementsByClassName(element: any, name: string): HTMLElement[];
        getElementsByTagName(element: any, name: string): HTMLElement[];
        classList(element: any): any[];
        addClass(element: any, classname: string): void;
        removeClass(element: any, classname: string): void;
        hasClass(element: any, classname: string): boolean;
        setStyle(element: any, stylename: string, stylevalue: string): void;
        removeStyle(element: any, stylename: string): void;
        getStyle(element: any, stylename: string): string;
        tagName(element: any): string;
        attributeMap(element: any): Dictionary<string>;
        hasAttribute(element: any, attribute: string): boolean;
        getAttribute(element: any, attribute: string): string;
        setAttribute(element: any, name: string, value: string): void;
        setAttributeNS(element: any, ns: string, name: string, value: string): void;
        removeAttribute(element: any, attribute: string): void;
        templateAwareRoot(el: any): any;
        createHtmlDocument(): HTMLDocument;
        defaultDoc(): HTMLDocument;
        getBoundingClientRect(el: any): any;
        getTitle(): string;
        setTitle(newTitle: string): void;
        elementMatches(n: any, selector: string): boolean;
        isTemplateElement(el: any): boolean;
        isTextNode(node: Node): boolean;
        isCommentNode(node: Node): boolean;
        isElementNode(node: Node): boolean;
        hasShadowRoot(node: any): boolean;
        isShadowRoot(node: any): boolean;
        importIntoDoc(node: Node): any;
        adoptNode(node: Node): any;
        getHref(el: Element): string;
        getEventKey(event: any): string;
        getGlobalEventTarget(target: string): EventTarget;
        getHistory(): History;
        getLocation(): Location;
        getBaseHref(): string;
        resetBaseElement(): void;
        getUserAgent(): string;
        setData(element: any, name: string, value: string): void;
        getData(element: any, name: string): string;
        getComputedStyle(element: any): any;
        requestAnimationFrame(callback: any): number;
        cancelAnimationFrame(id: number): void;
        performanceNow(): number;
    }
}
declare namespace Reflect {
    var MetadataInfo: string | symbol;
    function metadata(metadataKey: any, metadataValue: any): any;
    function setObjectSymbol<T>(target: Object, symbol: string | symbol, value: T): T;
}
declare module mz {
    interface RouterOptions {
        routes: any;
    }
    interface NavigateOptions {
        trigger?: boolean;
    }
    interface TheRouter {
        on(eventName: string, callback?: Function, context?: any): any;
        off(eventName?: string, callback?: Function, context?: any): any;
        trigger(eventName: string, ...args: any[]): any;
        bind(eventName: string, callback: Function, context?: any): any;
        unbind(eventName?: string, callback?: Function, context?: any): any;
        once(events: string, callback: Function, context?: any): any;
        listenTo(object: any, events: string, callback: Function): any;
        listenToOnce(object: any, events: string, callback: Function): any;
        stopListening(object?: any, events?: string, callback?: Function): any;
        /**
        * Routes hash or a method returning the routes hash that maps URLs with parameters to methods on your Router.
        * For assigning routes as object hash, do it like this: this.routes = <any>{ "route": callback, ... };
        * That works only if you set it in the constructor or the initialize method.
        **/
        routes: any;
        constructor(options?: RouterOptions): any;
        initialize(options?: RouterOptions): void;
        route(route: string, name: string, callback?: Function): TheRouter;
        route(route: RegExp, name: string, callback?: Function): TheRouter;
        navigate(fragment: string, options?: NavigateOptions): TheRouter;
        navigate(fragment: string, trigger?: boolean): TheRouter;
    }
    interface mzBackboneRouter extends TheRouter {
        start(options: RouterOptions, cb?: (route: TheRouter) => void): any;
    }
    var route: mzBackboneRouter;
}
declare namespace mz.css {
    function set(selectorOrValues: any, selectorValues?: Dictionary<string | number>): string;
    class Stylesheet {
        prefix: string;
        elem: JQuery;
        estilo: Dictionary<Dictionary<string | number>>;
        destino: JQuery | string;
        constructor(prefix?: string | JQuery);
        enable(): void;
        disable(): void;
        private remake;
        refresh(): void;
        set(property: string, val: Dictionary<string | number>): void;
    }
}
declare class MzModelDirective extends mz.AttributeDirective {
    static symbol2wb: symbol | string;
    static jqueryBindings: string;
    changeBinding: any;
    componentBinding: mz.EventDispatcherBinding;
    widgetValueBinding: mz.EventDispatcherBinding;
    private delayedBinding;
    unmount(): void;
    private teardown();
    changed(value: string, prevVal: string): void;
}
declare namespace mz.widgets {
    class MzInput extends mz.Widget {
        value: any;
    }
}
declare class MzRawDirective extends mz.AttributeDirective {
    changed(val: string): void;
}
declare class MzVisibleDirective extends mz.AttributeDirective {
    static vendorHiddenClass: string;
    private listener;
    mount(): void;
    unmount(): void;
    changed(val: any): void;
}
declare module mz.view {
    function html(literalSections: any, ...substs: any[]): string;
}
declare module mz.view.html {
    function escape(str: any): string;
}
declare namespace JSX {
    interface Element extends mz.Widget {
    }
    interface ElementClass extends mz.Widget {
    }
    interface ElementAttributesProperty {
        props: {};
    }
    interface IntrinsicElements {
        a: mz.Widget.HTMLAttributes;
        abbr: mz.Widget.HTMLAttributes;
        address: mz.Widget.HTMLAttributes;
        area: mz.Widget.HTMLAttributes;
        article: mz.Widget.HTMLAttributes;
        aside: mz.Widget.HTMLAttributes;
        audio: mz.Widget.HTMLAttributes;
        b: mz.Widget.HTMLAttributes;
        base: mz.Widget.HTMLAttributes;
        bdi: mz.Widget.HTMLAttributes;
        bdo: mz.Widget.HTMLAttributes;
        big: mz.Widget.HTMLAttributes;
        blockquote: mz.Widget.HTMLAttributes;
        body: mz.Widget.HTMLAttributes;
        br: mz.Widget.HTMLAttributes;
        button: mz.Widget.HTMLAttributes;
        canvas: mz.Widget.HTMLAttributes;
        caption: mz.Widget.HTMLAttributes;
        cite: mz.Widget.HTMLAttributes;
        code: mz.Widget.HTMLAttributes;
        col: mz.Widget.HTMLAttributes;
        colgroup: mz.Widget.HTMLAttributes;
        data: mz.Widget.HTMLAttributes;
        datalist: mz.Widget.HTMLAttributes;
        dd: mz.Widget.HTMLAttributes;
        del: mz.Widget.HTMLAttributes;
        details: mz.Widget.HTMLAttributes;
        dfn: mz.Widget.HTMLAttributes;
        dialog: mz.Widget.HTMLAttributes;
        div: mz.Widget.HTMLAttributes;
        dl: mz.Widget.HTMLAttributes;
        dt: mz.Widget.HTMLAttributes;
        em: mz.Widget.HTMLAttributes;
        embed: mz.Widget.HTMLAttributes;
        fieldset: mz.Widget.HTMLAttributes;
        figcaption: mz.Widget.HTMLAttributes;
        figure: mz.Widget.HTMLAttributes;
        footer: mz.Widget.HTMLAttributes;
        form: mz.Widget.HTMLAttributes;
        h1: mz.Widget.HTMLAttributes;
        h2: mz.Widget.HTMLAttributes;
        h3: mz.Widget.HTMLAttributes;
        h4: mz.Widget.HTMLAttributes;
        h5: mz.Widget.HTMLAttributes;
        h6: mz.Widget.HTMLAttributes;
        head: mz.Widget.HTMLAttributes;
        header: mz.Widget.HTMLAttributes;
        hr: mz.Widget.HTMLAttributes;
        html: mz.Widget.HTMLAttributes;
        i: mz.Widget.HTMLAttributes;
        iframe: mz.Widget.HTMLAttributes;
        img: mz.Widget.HTMLAttributes;
        input: mz.Widget.HTMLAttributes;
        ins: mz.Widget.HTMLAttributes;
        kbd: mz.Widget.HTMLAttributes;
        keygen: mz.Widget.HTMLAttributes;
        label: mz.Widget.HTMLAttributes;
        legend: mz.Widget.HTMLAttributes;
        li: mz.Widget.HTMLAttributes;
        link: mz.Widget.HTMLAttributes;
        main: mz.Widget.HTMLAttributes;
        map: mz.Widget.HTMLAttributes;
        mark: mz.Widget.HTMLAttributes;
        menu: mz.Widget.HTMLAttributes;
        menuitem: mz.Widget.HTMLAttributes;
        meta: mz.Widget.HTMLAttributes;
        meter: mz.Widget.HTMLAttributes;
        nav: mz.Widget.HTMLAttributes;
        noscript: mz.Widget.HTMLAttributes;
        object: mz.Widget.HTMLAttributes;
        ol: mz.Widget.HTMLAttributes;
        optgroup: mz.Widget.HTMLAttributes;
        option: mz.Widget.HTMLAttributes;
        output: mz.Widget.HTMLAttributes;
        p: mz.Widget.HTMLAttributes;
        param: mz.Widget.HTMLAttributes;
        picture: mz.Widget.HTMLAttributes;
        pre: mz.Widget.HTMLAttributes;
        progress: mz.Widget.HTMLAttributes;
        q: mz.Widget.HTMLAttributes;
        rp: mz.Widget.HTMLAttributes;
        rt: mz.Widget.HTMLAttributes;
        ruby: mz.Widget.HTMLAttributes;
        s: mz.Widget.HTMLAttributes;
        samp: mz.Widget.HTMLAttributes;
        script: mz.Widget.HTMLAttributes;
        section: mz.Widget.HTMLAttributes;
        select: mz.Widget.HTMLAttributes;
        small: mz.Widget.HTMLAttributes;
        source: mz.Widget.HTMLAttributes;
        span: mz.Widget.HTMLAttributes;
        strong: mz.Widget.HTMLAttributes;
        style: mz.Widget.HTMLAttributes;
        sub: mz.Widget.HTMLAttributes;
        summary: mz.Widget.HTMLAttributes;
        sup: mz.Widget.HTMLAttributes;
        table: mz.Widget.HTMLAttributes;
        tbody: mz.Widget.HTMLAttributes;
        td: mz.Widget.HTMLAttributes;
        textarea: mz.Widget.HTMLAttributes;
        tfoot: mz.Widget.HTMLAttributes;
        th: mz.Widget.HTMLAttributes;
        thead: mz.Widget.HTMLAttributes;
        time: mz.Widget.HTMLAttributes;
        title: mz.Widget.HTMLAttributes;
        tr: mz.Widget.HTMLAttributes;
        track: mz.Widget.HTMLAttributes;
        u: mz.Widget.HTMLAttributes;
        ul: mz.Widget.HTMLAttributes;
        "var": mz.Widget.HTMLAttributes;
        video: mz.Widget.HTMLAttributes;
        wbr: mz.Widget.HTMLAttributes;
    }
}
declare type WidgetsType = mz.Widget | string | mz.widgets.TextNode;
declare type WidgetCtor = typeof mz.Widget;
interface T {
    props: any;
}
declare namespace mz.vdom {
    function createElement(type: string | WidgetCtor, props?: any, ...children: WidgetsType[]): mz.Widget;
    var __spread: typeof copy;
}
declare namespace mz {
    /**
     * Hyperscript for JSX or TSX
     */
    function h(componentName: string, attr?: Dictionary<any>, ...children: any[]): Widget;
}
declare module mz.widgets {
    class MzRepeat extends mz.Widget {
        list: mz.Collection<any>;
        afterAdd: (doms: mz.IChildWidget[], scope: any) => void;
        collectionKey: symbol | string;
        private item;
        props: {
            list: mz.Collection<any>;
            afterAdd?: (doms: mz.IChildWidget[], scope: any) => void;
        };
        listenersLista: mz.EventDispatcherBinding[];
        constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], b: any, c: any, scope: any);
        private list_changed(list, prevList);
        unmount(): void;
        ponerElem(itemDeLista: any): void;
        generateScopedContent(scope: any): IChildWidget[];
        private detachAllNodes();
        private delegateUnmountElements(elementoLista);
        redraw(tipo: string, a?: any, b?: any): void;
    }
}
