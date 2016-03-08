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
    var MzTab = (function (_super) {
        __extends(MzTab, _super);
        function MzTab(rootNode, attr, children, a, b, scope) {
            attr['tag'] = 'div';
            if (!('label' in attr))
                throw new Error("MzTab must have 'label' attribute");
            if (!('visible' in attr) || attr['visible'] == undefined)
                attr['visible'] = true;
            _super.call(this, rootNode, attr, children, a, b, scope);
        }
        MzTab.prototype.visible_changed = function (visible) {
            var _this = this;
            requestAnimationFrame(function () {
                if (_this.parent && _this.parent.tabs) {
                    _this.parent.tabs.update(_this);
                }
            });
            if (!visible && this.isVisible() && this.parent) {
                this.parent.show(this.parent.tabs.single(function (x) { return x !== _this; }));
            }
        };
        MzTab.EVENTS = mz.copy({ TabShown: 'tab_shown' }, mz.widgets.MzSwitcherPanel.EVENTS);
        __decorate([
            MzTab.proxy, 
            __metadata('design:type', String)
        ], MzTab.prototype, "label", void 0);
        __decorate([
            MzTab.Attribute, 
            __metadata('design:type', Boolean)
        ], MzTab.prototype, "visible", void 0);
        MzTab = __decorate([
            MzTab.RegisterComponent("mz-tab"),
            MzTab.Template('<div class="mz-tab" />', ':root'),
            MzTab.ConfigureUnwrapped, 
            __metadata('design:paramtypes', [Node, Object, Array, Object, Object, Object])
        ], MzTab);
        return MzTab;
    })(mz.widgets.MzSwitcherPanel);
    exports.MzTab = MzTab;
    ;
    var MzTaber = (function (_super) {
        __extends(MzTaber, _super);
        function MzTaber(rootNode, attr, children, a, b, scope) {
            var _this = this;
            _super.call(this, rootNode, attr, [], a, b, scope);
            this.tabs = new mz.Collection();
            children.forEach(function (child) {
                if (child instanceof MzTab) {
                    _this.tabs.push(child);
                    child.parent = _this;
                    _this.listening.push(child.on('valueChanged', function () { return _this.tabs.update(child); }));
                }
            });
            var firstTab = this.tabs.first();
            if (firstTab) {
                this.show(firstTab);
            }
            this.children = children;
        }
        MzTaber.prototype.show = function (tab) {
            _super.prototype.show.call(this, tab);
            this.tabs && this.tabs.trigger('changed', 'refresh');
            tab.emit(MzTab.EVENTS.TabShown);
        };
        MzTaber.prototype.tabClicked = function (ev) {
            if (ev.data instanceof MzTab) {
                this.show(ev.data);
                this.emit(MzTaber.EVENTS.TabClicked, ev.data);
            }
        };
        MzTaber.EVENTS = mz.copy({ TabClicked: 'tab_clicked' }, mz.widgets.MzSwitcher.EVENTS);
        __decorate([
            MzTaber.proxy, 
            __metadata('design:type', mz.Collection)
        ], MzTaber.prototype, "tabs", void 0);
        MzTaber = __decorate([
            mz.Widget.RegisterComponent("mz-taber"),
            MzTaber.ConfigureUnwrapped,
            MzTaber.Template("\n<div class=\"mz-taber\">\n    <div class=\"mz-taber-nav\">\n        <mz-repeat list=\"{this.tabs}\" tag=\"ul\" class=\"mz-taber-tab-list\">\n            <li onclick=\"{this.tabClicked}\" class=\"mz-taber-tab {active: scope.isVisible()}\">\n                {scope.label}\n            </li>\n        </mz-repeat>\n    </div>\n    <div class=\"mz-taber-content\" />\n</div>\n", '.mz-taber-content'), 
            __metadata('design:paramtypes', [Node, Object, Array, Object, Object, Object])
        ], MzTaber);
        return MzTaber;
    })(mz.widgets.MzSwitcher);
    exports.MzTaber = MzTaber;
    ;
});
//# sourceMappingURL=mz-tabs.js.map