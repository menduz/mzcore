/// <reference path="../dist/mz.d.ts" />
/// <amd-dependency path="bower_components/markdown-it/dist/markdown-it.min.js" name="MarkdownIt" />
/// <amd-dependency path="bower_components/backbone/backbone.js" name="backbone" />

declare var MarkdownIt;
mz.alias("views", module.getPath("./views"));

declare var hljs;

@mz.AttributeDirective.Register('syntax')
class SyntaxHighlighter extends mz.AttributeDirective {
    mount() {
        requestAnimationFrame(() => hljs.highlightBlock(this.widget.rootNode));
    }
}

@mz.AttributeDirective.Register('markdown')
class MarkdownAttr extends mz.AttributeDirective {
    mount() {
        requestAnimationFrame(() =>
            this.widget.DOM.html(MarkdownIt.render(this.widget.DOM.text()))
        );
    }
}

class Index extends mz.app.PageCoordinator {
    @mz.MVCObject.proxy
    loading: boolean = false;

    @mz.MVCObject.proxy
    now: number;

    constructor() {
        super({
            templateSelector: '.window',
            pages: 'pages.json'
        });
        
    }
}
new Index;