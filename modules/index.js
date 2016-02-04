/// <reference path="../dist/mz.d.ts" />
/// <amd-dependency path="bower_components/markdown-it/dist/markdown-it.min.js" name="MarkdownIt" />
/// <amd-dependency path="backbone" name="backbone" />
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
define(["require", "exports", "bower_components/markdown-it/dist/markdown-it.min.js", "backbone"], function (require, exports, MarkdownIt, backbone) {
    mz.alias("views", module.getPath("./views"));
    var SyntaxHighlighter = (function (_super) {
        __extends(SyntaxHighlighter, _super);
        function SyntaxHighlighter() {
            _super.apply(this, arguments);
        }
        SyntaxHighlighter.prototype.mount = function () {
            var _this = this;
            requestAnimationFrame(function () { return hljs.highlightBlock(_this.widget.rootNode); });
        };
        SyntaxHighlighter = __decorate([
            mz.AttributeDirective.Register('syntax'), 
            __metadata('design:paramtypes', [])
        ], SyntaxHighlighter);
        return SyntaxHighlighter;
    })(mz.AttributeDirective);
    var MarkdownAttr = (function (_super) {
        __extends(MarkdownAttr, _super);
        function MarkdownAttr() {
            _super.apply(this, arguments);
        }
        MarkdownAttr.prototype.mount = function () {
            var _this = this;
            requestAnimationFrame(function () {
                return _this.widget.DOM.html(MarkdownIt.render(_this.widget.DOM.text()));
            });
        };
        MarkdownAttr = __decorate([
            mz.AttributeDirective.Register('markdown'), 
            __metadata('design:paramtypes', [])
        ], MarkdownAttr);
        return MarkdownAttr;
    })(mz.AttributeDirective);
    var Index = (function (_super) {
        __extends(Index, _super);
        function Index() {
            _super.call(this, {
                templateSelector: '.window',
                pages: 'pages.json'
            });
            this.loading = false;
        }
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Boolean)
        ], Index.prototype, "loading", void 0);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Number)
        ], Index.prototype, "now", void 0);
        return Index;
    })(mz.app.PageCoordinator);
    var app = new Index();
    return {};
});
//# sourceMappingURL=index.js.map