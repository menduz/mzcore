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
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs() {
            _super.apply(this, arguments);
        }
        Tabs.prototype.gotoNamedTab = function () { this.namedTab.show(); };
        Tabs = __decorate([
            Tabs.Template(module.getPath("./tabs.xml")), 
            __metadata('design:paramtypes', [])
        ], Tabs);
        return Tabs;
    })(mz.app.Page);
    return Tabs;
});
//# sourceMappingURL=tabs.js.map