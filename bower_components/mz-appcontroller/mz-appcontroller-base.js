/// <amd-dependency path="backbone"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "backbone"], function (require, exports) {
    if (!Backbone)
        throw new Error("mz-appcontroller requires Backbone");
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(appController) {
            _super.call(this, null, { tag: 'div', }, [], this, this, this);
            this.routeHandler = {};
            this.parent = appController;
        }
        Page.prototype.handleRoute = function (routeName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        Page.prototype.show = function () {
            var _this = this;
            _super.prototype.show.call(this);
            this.parent.actualPage = this;
            requestAnimationFrame(function () { return _this.resize(); });
            // phonegap!
            document.addEventListener("resetScrollView", function () {
                _this.resize();
            });
        };
        return Page;
    })(mz.widgets.MzSwitcherPanel);
    exports.Page = Page;
    var PageCoordinator = (function (_super) {
        __extends(PageCoordinator, _super);
        function PageCoordinator(opc) {
            var _this = this;
            _super.call(this, null, { tag: 'div', class: 'mz-page-coordinator' }, [], this, this, this);
            this.pages = opc.pagesCollection || new mz.collection(null, { key: "name" });
            this.setUnwrapedComponent(true);
            if (opc.templateHtml && opc.templateUrl) {
                throw new Error("You must set only templateUrl or templateHtml, not both.");
            }
            if (!opc.pages) {
                throw new Error("You must provide 'pages: Url(.json) | Array[]' option.");
            }
            if (typeof opc.pages == "string") {
                mz.xr.get(opc.pages).then(function (x) { return _this.setPages(x.data); });
            }
            else if (opc.pages instanceof Array) {
                this.setPages(opc.pages);
            }
            else {
                throw new TypeError("opc.pages must be an Array or Url(.json)");
            }
            if (opc.templateHtml)
                this.startComponent([opc.templateHtml]);
            else if (opc.templateUrl)
                this.loadTemplate(opc.templateUrl);
            else
                $(function () {
                    var frag = document.createElement("app");
                    frag.appendChild(document.querySelector(opc.templateSelector || "body *"));
                    _this.startComponent(frag);
                });
            $(function () {
                _this.appendTo("body");
            });
        }
        PageCoordinator.prototype.setPages = function (pages) {
            var routes = {};
            var bindRoutes = {};
            this.pages.clear();
            for (var _i = 0; _i < pages.length; _i++) {
                var page = pages[_i];
                if (page.routes && page.routes.length) {
                    for (var _a = 0, _b = page.routes; _a < _b.length; _a++) {
                        var route = _b[_a];
                        if (route.route in bindRoutes)
                            console.warn("Route " + route.route + " duplicated on page " + page.name + ".");
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
            var routerParam = {
                routes: bindRoutes
            };
            this.routeHistory = [];
            var that = this;
            for (var i in routes) {
                (function (route) {
                    routerParam[route.name] = function () {
                        var t = arguments;
                        that.getPage(route.page.name).then(function (modulo) {
                            if (route.name in modulo.routeHandler) {
                                modulo.routeHandler[route.name].apply(modulo, t);
                            }
                            modulo.handleRoute.apply(modulo, [route.name].concat(t));
                            that.show(modulo);
                            that.routeHistory.push(Backbone.history.getFragment());
                        });
                    };
                })(routes[i]);
            }
            ;
            mz.route.start(routerParam);
            this.emit('loaded');
            this.loaded();
        };
        PageCoordinator.prototype.loaded = function () {
        };
        PageCoordinator.prototype.show = function (page) {
            if (page instanceof Page) {
                _super.prototype.show.call(this, page);
                this.actualPage = page;
            }
            else
                throw new Error("App only shows instances of Page");
        };
        PageCoordinator.prototype.navigate = function (route, trigger) {
            if (trigger === void 0) { trigger = true; }
            mz.route.navigate(route, trigger);
        };
        PageCoordinator.prototype.getPage = function (pageName) {
            var _this = this;
            var page = this.pages.indexedGet(pageName);
            if (page == null)
                return Promise.reject(Error("Page not found"));
            return new Promise(function (ok) {
                mz.require(page.module, function (modulo) {
                    if (modulo.instance)
                        return ok(modulo.instance);
                    ok(modulo.instance = new modulo(_this));
                });
            });
        };
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Page)
        ], PageCoordinator.prototype, "actualPage", void 0);
        return PageCoordinator;
    })(mz.widgets.MzSwitcher);
    exports.PageCoordinator = PageCoordinator;
});
//# sourceMappingURL=mz-appcontroller-base.js.map