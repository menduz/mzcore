export declare function activatePlugin(): void;
export declare class MzSidebar extends mz.Widget {
    private backdrop;
    width: number;
    panel: string;
    opened: boolean;
    constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a: any, b: any, scope: any);
    private opened_changed(visible);
    width_changed(width: number): void;
}
export declare class MzSidebarToggler extends mz.Widget {
    toggle(): void;
}
