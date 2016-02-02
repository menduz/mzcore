export interface IAppControllerRoute {
    name: string;
    route: string;
}
export interface IAppControllerRouteModule extends IAppControllerRoute {
    page: IAppPageModule;
}
export interface IAppPage {
    name: string;
    module: string;
    routes: Array<IAppControllerRoute>;
}
export interface IAppPageModule extends IAppPage {
}
export declare class Page extends mz.widgets.MzSwitcherPanel {
    routeHandler: mz.Dictionary<Function> | any;
    parent: PageCoordinator;
    constructor(appController: PageCoordinator);
    handleRoute(routeName: string, ...args: any[]): void;
    show(): void;
    static instance: Page;
}
export declare class PageCoordinator extends mz.widgets.MzSwitcher {
    pages: mz.collection<IAppPageModule>;
    actualPage: Page;
    constructor(opc: {
        templateUrl?: string;
        templateHtml?: string;
        templateSelector?: string;
        pages: string | Array<IAppPage>;
        pagesCollection?: mz.collection<IAppPageModule>;
    });
    setPages(pages: Array<IAppPage>): void;
    routeHistory: string[];
    loaded(): void;
    show(page: Page): void;
    navigate(route: string, trigger?: boolean): void;
    getPage(pageName: string): Promise<Page>;
}
