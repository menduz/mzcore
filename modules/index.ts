/// <reference path="../dist/mz.d.ts" />
/// <amd-dependency path="bower_components/markdown-it/dist/markdown-it.min.js" name="MarkdownIt" />
/// <amd-dependency path="backbone" name="backbone" />

declare var MarkdownIt;
mz.alias("views", module.getPath("./views"));

declare var hljs;


@mz.AttributeDirective.Register('syntax-from')
class SyntaxHighlighter extends mz.AttributeDirective {
    changed(value){
        $.get(value,data => {
            
            
            this.widget.rootNode.textContent = data.toString();
            requestAnimationFrame(() => hljs.highlightBlock(this.widget.rootNode));
        }, 'text');
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
    
    
    loaded(){
        $("#startup").remove();
        $('.hidden-on-load').css('opacity', '1');
    }
}



var app = new Index();
export = {};