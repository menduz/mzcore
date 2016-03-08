export declare class MzTab extends mz.widgets.MzSwitcherPanel {
    static EVENTS: {
        TabShown: string;
    } & {
        ComponentUnmounted: string;
        ComponentResized: string;
        ComponentMounted: string;
    } & {
        setValues: string;
        valueChanged: string;
    } & {};
    parent: MzTaber;
    label: string;
    visible: boolean;
    private visible_changed(visible);
    constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a: any, b: any, scope: any);
}
export declare class MzTaber extends mz.widgets.MzSwitcher {
    tabs: mz.Collection<MzTab>;
    static EVENTS: {
        TabClicked: string;
    } & {
        ComponentUnmounted: string;
        ComponentResized: string;
        ComponentMounted: string;
    } & {
        setValues: string;
        valueChanged: string;
    } & {};
    constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a: any, b: any, scope: any);
    show(tab: MzTab): void;
    private tabClicked(ev);
}
