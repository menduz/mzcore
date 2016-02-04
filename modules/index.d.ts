/// <reference path="../dist/mz.d.ts" />
declare var MarkdownIt: any;
declare var hljs: any;
declare class SyntaxHighlighter extends mz.AttributeDirective {
    mount(): void;
}
declare class MarkdownAttr extends mz.AttributeDirective {
    mount(): void;
}
declare class Index extends mz.app.PageCoordinator {
    loading: boolean;
    now: number;
    constructor();
}
