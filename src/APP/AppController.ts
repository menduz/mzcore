/// <reference path="../WIDGETS/mz-switcher.ts" />

declare var Backbone;

namespace mz.app {
    export interface IAppControllerRoute {
        name: string;
        route: string;
    }

    export interface IAppControllerRouteModule extends IAppControllerRoute {
        page: IAppPage;
    }

    export interface IAppPage {
        name: string;
        module: string;
        routes: Dictionary<string>;
    }

    export interface IAppPageModule extends IAppPage {

    }

    /**
     * Binds a ROUTE_NAME to this method.
     * pages.json#
     * [{ 
     *   name: "index", 
     *   module: "index.ts",
     *   routes: { 
     *     "index/:id": "ROUTE_NAME" 
     *   }
     * }, 
     * ...]
     * By default, the target method's name is used
     */
    export function RouteName(route_name?: string) {
        return function(target: Page, propertyKey: string | symbol) {
            if (target[propertyKey] && typeof target[propertyKey] === "function") {
                target[propertyKey].isRouteHandler = route_name || propertyKey;
            }
        }
    }


    export class Page extends mz.widgets.MzSwitcherPanel {
        routeHandler: mz.Dictionary<Function> | any;
        parent: PageCoordinator;

        constructor(appController?: PageCoordinator) {
            super(null, { tag: 'div', }, [], this, this, this);
            this.routeHandler = {};

            var componentProps = Object.getPrototypeOf ? Object.getPrototypeOf(this) : (this['__proto__']);

            if (componentProps) {
                for (var i in componentProps) {
                    if (typeof this[i] == "function" && this[i].isRouteHandler) {
                        this.routeHandler[this[i].isRouteHandler] = this[i];
                    }
                }
            }

            this.parent = appController;

            this.resize = mz.screenDelayer(this.resize, this);
        }

        handleRoute(routeName: string, ...args: any[]) {

        }

        show() {
            super.show();
            this.parent.actualPage = this;
            this.parent.actualPageName = this.pageControllerName;

            requestAnimationFrame(() => this.resize());
        
            // phonegap!
            document.addEventListener("resetScrollView", () => {
                this.resize();
            });

            $(window).on('resize', () => this.resize());
        }

        pageControllerName: string;

        static instance: Page;
    }

    @mz.Widget.ConfigureUnwrapped
    @mz.Widget.Template(null, 'content')
    export class PageCoordinator extends mz.widgets.MzSwitcher {
        pages: mz.Collection<IAppPageModule>;

        @mz.MVCObject.proxy
        actualPage: Page;

        @mz.MVCObject.proxy
        actualPageName: string;

        @mz.MVCObject.proxy
        loadingPage: boolean;

        constructor(opc: {
            templateSelector?: string;
            pages: string | Array<IAppPage>;
        }) {
            super(null, { tag: 'div', class: 'mz-page-coordinator' }, [], this, this, undefined);

            this.loadingPage = true;

            this.pages = new mz.Collection<IAppPageModule>(null, { key: "name" });

            if (!opc.pages) {
                throw new Error("You must provide 'pages: Url(.json) | Array[]' option.")
            }

            if (typeof opc.pages == "string") {
                mz.xr.get(<string>opc.pages).then(x => this.setPages(x.data));
            } else if (opc.pages instanceof Array) {
                this.setPages(<Array<IAppPage>>opc.pages);
            } else {
                throw new TypeError("opc.pages must be an Array or Url(.json)");
            }

            if (opc.templateSelector)
                $(() => {
                    var frag = document.createElement("app");


                    let elem = document.querySelector(opc.templateSelector || "body *");

                    if (!elem) {
                        console.error("PageCoordinator: Target not fund!. Selector: " + opc.templateSelector || "body *")
                        return;
                    }

                    let parentNode = frag.parentNode;

                    if (parentNode && elem && this.rootNode && elem != this.rootNode) {
                        mz.dom.adapter.replaceChild(parentNode, this.rootNode, elem);
                        frag.appendChild(elem);
                        this.startComponent(<any>frag);
                    } else {
                        frag.appendChild(elem);
                        this.startComponent(<any>frag);
                        this.appendTo("body");
                    }
                });
            else
                $(() => {
                    this.appendTo("body");
                });
        }

        setPages(pages: Array<IAppPage>) {
            var routes: mz.Dictionary<IAppControllerRouteModule> = {};

            var bindRoutes = {};

            this.pages.clear();

            for (let page of pages) {
                if (page.routes) {
                    for (let route in page.routes) {
                        let action_name = page.routes[route];

                        if (typeof action_name !== "string") {
                            console.error(`invalid action name for route ${page.name}[${route}], type of action must be a string value instead is: `, action_name);
                            continue;
                        }

                        if (route in bindRoutes)
                            console.warn(`Route ${route} duplicated.`);

                        if ('routes' === action_name) {
                            console.error('PageCoordinator: Action name "routes" not allowed');
                            continue;
                        }

                        routes[action_name] = {
                            page: page,
                            route: route,
                            name: action_name
                        };

                        bindRoutes[route] = action_name;
                    }
                }

                this.pages.push(page);
            }

            var routerParam: any = {
                routes: bindRoutes
            };

            var that = this;

            for (var i in routes) {
                ((route: IAppControllerRouteModule) => {
                    routerParam[route.name] = function() {
                        var t = <any>arguments;
                        that.loadingPage = true;
                        that.getPage(route.page.name).then((modulo: Page) => {
                            if (modulo.routeHandler && route.name in modulo.routeHandler) {
                                modulo.routeHandler[route.name].apply(modulo, t);
                            }

                            modulo.handleRoute(route.name, ...t);
                            that.show(modulo);
                            that.emit('route', route.name, ...t);
                            that.emit('history', Backbone.history.getFragment());

                            that.loadingPage = false;
                        });
                    };
                })(routes[i]);
            };

            mz.route.start(routerParam, () => {
                this.emit('loaded');
                this.loadingPage = false;
                this.loaded();
            });


        }

        loaded() {

        }

        show(page: Page) {
            if (page instanceof Page) {
                super.show(page);
                this.actualPage = page;
                this.actualPageName = page.pageControllerName;
            } else throw new Error("App only shows instances of Page");
        }

        navigate(route: string, trigger: boolean = true) {
            mz.route.navigate(route, trigger);
        }

        getPage(pageName: string): Promise<Page> {
            var page = this.pages.indexedGet(pageName);

            if (page == null)
                return Promise.reject(new Error("Page not found"));

            return new Promise(ok => {
                mz.require(page.module, (modulo: typeof Page) => {
                    if (modulo.instance)
                        return ok(modulo.instance);

                    modulo.instance = new modulo(this);
                    modulo.instance.parent = this;
                    modulo.instance.pageControllerName = pageName;

                    ok(modulo.instance);
                });
            });
        }
    }
}