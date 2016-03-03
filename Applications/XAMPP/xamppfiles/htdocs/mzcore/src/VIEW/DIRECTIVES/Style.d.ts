export declare class StyleComponent extends mz.Widget {
    parent_selector: string;
    link: mz.Widget;
    observer: MutationObserver;
    constructor(root: any, attr: any, children: any, params: any, parent: any, scope: any);
    textValue: string;
    textValue_changed(val: any, prevVal: any): void;
    update(): void;
}
