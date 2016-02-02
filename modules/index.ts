/// <reference path="../dist/mz.d.ts" />
/// <amd-dependency path="bower_components/markdown-it/dist/markdown-it.min.js" name="MarkdownIt" />

declare var MarkdownIt;
mz.alias("views", module.getPath("./views"));

import appController = require('bower_components/mz-appController/mz-appController-base');

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



class Index extends appController.PageCoordinator {
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