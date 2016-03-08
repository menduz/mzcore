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
define(["require", "exports", './mz-sidebar', './mz-autocomplete', './mz-tabs'], function (require, exports, mz_sidebar_1, mz_autocomplete_1, mz_tabs_1) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    mz.loadCss(module.getPath('./uikit.css'));
    __export(mz_sidebar_1);
    __export(mz_autocomplete_1);
    __export(mz_tabs_1);
    var MzClear = (function (_super) {
        __extends(MzClear, _super);
        function MzClear() {
            _super.apply(this, arguments);
        }
        MzClear = __decorate([
            MzClear.Template('<div style="clear:both" />'),
            MzClear.ConfigureUnwrapped,
            MzClear.RegisterComponent('clear'), 
            __metadata('design:paramtypes', [])
        ], MzClear);
        return MzClear;
    })(mz.Widget);
    exports.MzClear = MzClear;
});
//# sourceMappingURL=index.js.map