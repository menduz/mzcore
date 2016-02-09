var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(a) {
            _super.call(this, a);
            this.loadTemplate(module.getPath('./index.xml'));
        }
        return Main;
    })(mz.app.Page);
    return Main;
});
//# sourceMappingURL=index.js.map