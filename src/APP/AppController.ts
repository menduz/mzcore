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
        routes: Array<IAppControllerRoute>;
    }

    export interface IAppPageModule extends IAppPage {

    }

    export class Page extends mz.widgets.MzSwitcherPanel {
        routeHandler: mz.Dictionary<Function> | any;
        parent: PageCoordinator;

        constructor(appController: PageCoordinator) {
            super(null, { tag: 'div', }, [], this, this, this);
            this.routeHandler = {};
            this.parent = appController;
        }

        handleRoute(routeName: string, ...args: any[]) {

        }

        show() {
            super.show();
            this.parent.actualPage = this;
            requestAnimationFrame(() => this.resize());
        
            // phonegap!
            document.addEventListener("resetScrollView", () => {
                this.resize();
            });
        }

        static instance: Page;
    }

    @mz.Widget.ConfigureUnwrapped
    @mz.Widget.Template(null, 'content')
    export class PageCoordinator extends mz.widgets.MzSwitcher {
        pages: mz.Collection<IAppPageModule>;

        @mz.MVCObject.proxy
        actualPage: Page;
        
        @mz.MVCObject.proxy
        loadingPage: boolean = true;

        constructor(opc: {
            templateUrl?: string;
            templateHtml?: string;
            templateSelector?: string;
            pages: string | Array<IAppPage>;
            pagesCollection?: mz.Collection<IAppPageModule>;
        }) {
            super(null, { tag: 'div', class: 'mz-page-coordinator' }, [], this, this, undefined);

            this.pages = opc.pagesCollection || new mz.Collection<IAppPageModule>(null, { key: "name" });

            

            if (opc.templateHtml && opc.templateUrl) {
                throw new Error("You must set only templateUrl or templateHtml, not both.")
            }

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

            if (opc.templateHtml)
                this.startComponent([opc.templateHtml]);
            else if (opc.templateUrl)
                this.loadTemplate(opc.templateUrl);
            else
                $(() => {
                    var frag = document.createElement("app");

                    frag.appendChild(document.querySelector(opc.templateSelector || "body *"));

                    this.startComponent(<any>frag);
                });

            $(() => {
                this.appendTo("body");
            });
        }

        setPages(pages: Array<IAppPage>) {
            var routes: mz.Dictionary<IAppControllerRouteModule> = {};

            var bindRoutes = {};

            this.pages.clear();

            for (let page of pages) {
                if (page.routes && page.routes.length) {
                    for (let route of page.routes) {

                        if (route.route in bindRoutes)
                            console.warn(`Route ${route.route} duplicated on page ${page.name}.`);

                        routes[route.name] = {
                            page: page,
                            route: route.route,
                            name: route.name
                        };

                        bindRoutes[route.route] = route.name;
                    }
                }

                this.pages.push(page);
            }

            var routerParam: any = {
                routes: bindRoutes
            };

            this.routeHistory = [];

            var that = this;
            
            if(!mz.globalContext.Backbone && !('backbone' in mz.modules && (Backbone = mz.require('backbone')) && Backbone.history))
                throw new Error("AppController requires Backbone, please install it before creating this.");

            for (var i in routes) {
                ((route: IAppControllerRouteModule) => {
                    routerParam[route.name] = function() {
                        var t = <any>arguments;
                        that.loadingPage = true;
                        that.getPage(route.page.name).then((modulo: Page) => {
                            if (route.name in modulo.routeHandler) {
                                modulo.routeHandler[route.name].apply(modulo, t);
                            }

                            modulo.handleRoute(route.name, ...t);
                            that.show(modulo);

                            that.routeHistory.push(Backbone.history.getFragment());
                            that.loadingPage = false;
                        });
                    };
                })(routes[i]);
            };

            mz.route.start(routerParam);

            this.emit('loaded');
            this.loaded();
        }

        routeHistory: string[];

        loaded() {

        }

        show(page: Page) {
            if (page instanceof Page) {
                super.show(page);
                this.actualPage = page;
            } else throw new Error("App only shows instances of Page");
        }

        navigate(route: string, trigger: boolean = true) {
            mz.route.navigate(route, trigger);
        }

        getPage(pageName: string): Promise<Page> {
            var page = this.pages.indexedGet(pageName);

            if (page == null)
                return Promise.reject(Error("Page not found"));

            return new Promise(ok => {
                mz.require(page.module, (modulo: typeof Page) => {
                    if (modulo.instance)
                        return ok(modulo.instance);

                    ok(modulo.instance = new modulo(this));
                });
            });
        }
    }
}