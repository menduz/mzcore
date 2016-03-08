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
define(["require", "exports"], function (require, exports) {
    mz.loadCss(module.getPath('./uikit.css'));
    function activatePlugin() { }
    exports.activatePlugin = activatePlugin;
    var sidebarList = [];
    var MzSidebar = (function (_super) {
        __extends(MzSidebar, _super);
        function MzSidebar(rootNode, attr, children, a, b, scope) {
            var _this = this;
            if (!('opened' in attr))
                attr['opened'] = false;
            this.backdrop = $('<div class="mz-fit" style="z-index:99990;">');
            _super.call(this, rootNode, attr, children, a, b, scope);
            this.width = parseFloat(attr['width'] || 256);
            this.DOM.css({
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: this.width,
                transition: 'all .2s ease'
            });
            this.backdrop.on('mousedown touchstart', function () { _this.opened = false; });
            sidebarList.push(this);
            this.startComponent();
        }
        MzSidebar.prototype.opened_changed = function (visible) {
            if (visible) {
                this.backdrop.appendTo(this.DOM.parent());
                this.DOM.css({
                    zIndex: 99999,
                    transform: "translate3d(0, 0, 0)",
                    //opacity: 1,
                    pointerEvents: 'auto'
                });
                if (this.panel) {
                    $(this.panel).css({
                        transition: 'all .2s ease',
                        transform: "translate3d(" + this.width + "px, 0, 0)"
                    });
                }
            }
            else {
                this.backdrop.detach();
                this.DOM.css({
                    zIndex: 99999,
                    transform: "translate3d(-" + this.width + "px, 0, 0)",
                    //opacity: 0,
                    pointerEvents: 'none'
                });
                if (this.panel) {
                    $(this.panel).css({
                        transition: 'all .2s ease',
                        transform: "translate3d(0, 0, 0)"
                    });
                }
            }
        };
        MzSidebar.prototype.width_changed = function (width) {
            this.DOM.css({
                width: width,
                transform: "translate3d(-" + (this.attr('visible') ? 0 : this.width) + "px, 0, 0)"
            });
        };
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Number)
        ], MzSidebar.prototype, "width", void 0);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', String)
        ], MzSidebar.prototype, "panel", void 0);
        __decorate([
            MzSidebar.Attribute, 
            __metadata('design:type', Boolean)
        ], MzSidebar.prototype, "opened", void 0);
        MzSidebar = __decorate([
            MzSidebar.RegisterComponent("mz-sidebar"),
            MzSidebar.ConfigureUnwrapped,
            MzSidebar.Template('<nav />', ':root'), 
            __metadata('design:paramtypes', [HTMLElement, Object, Array, Object, Object, Object])
        ], MzSidebar);
        return MzSidebar;
    })(mz.Widget);
    exports.MzSidebar = MzSidebar;
    ;
    var MzSidebarToggler = (function (_super) {
        __extends(MzSidebarToggler, _super);
        function MzSidebarToggler() {
            _super.apply(this, arguments);
        }
        MzSidebarToggler.prototype.toggle = function () {
            if (!sidebarList.length)
                return;
            // TODO: SEARCH BY ID
            var sidebar = sidebarList[sidebarList.length - 1];
            sidebar.opened = !sidebar.opened;
        };
        MzSidebarToggler = __decorate([
            mz.Widget.RegisterComponent('mz-sidebar-toggler'),
            mz.Widget.ConfigureUnwrapped,
            mz.Widget.Template('<button onclick="{this.toggle}" />', ':root'), 
            __metadata('design:paramtypes', [])
        ], MzSidebarToggler);
        return MzSidebarToggler;
    })(mz.Widget);
    exports.MzSidebarToggler = MzSidebarToggler;
});
//# sourceMappingURL=mz-sidebar.js.map