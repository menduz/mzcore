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
    var Flex = (function (_super) {
        __extends(Flex, _super);
        function Flex() {
            _super.apply(this, arguments);
            this.second = 0;
        }
        Flex.prototype.componentInitialized = function () {
            var _this = this;
            setInterval(function () {
                _this.second = new Date().getSeconds();
            }, 900);
        };
        __decorate([
            Flex.proxy, 
            __metadata('design:type', Number)
        ], Flex.prototype, "second", void 0);
        Flex = __decorate([
            Flex.Template(module.getPath("./flex.xml")), 
            __metadata('design:paramtypes', [])
        ], Flex);
        return Flex;
    })(mz.app.Page);
    return Flex;
});
//# sourceMappingURL=flex.js.map