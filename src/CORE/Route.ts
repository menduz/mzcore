/// <reference path="AMD/Require.ts" />

interface RouterOptions {
        routes: any;
    }
    
     interface NavigateOptions {
        trigger?: boolean;
    }
    

     interface TheRouter  {
        on(eventName: string, callback?: Function, context?: any): any;
        off(eventName?: string, callback?: Function, context?: any): any;
        trigger(eventName: string, ...args: any[]): any;
        bind(eventName: string, callback: Function, context?: any): any;
        unbind(eventName?: string, callback?: Function, context?: any): any;

        once(events: string, callback: Function, context?: any): any;
        listenTo(object: any, events: string, callback: Function): any;
        listenToOnce(object: any, events: string, callback: Function): any;
        stopListening(object?: any, events?: string, callback?: Function): any;
      
        /**
        * Routes hash or a method returning the routes hash that maps URLs with parameters to methods on your Router.
        * For assigning routes as object hash, do it like this: this.routes = <any>{ "route": callback, ... };
        * That works only if you set it in the constructor or the initialize method.
        **/
        routes: any;

        constructor(options?: RouterOptions);
        initialize(options?: RouterOptions): void;
        route(route: string, name: string, callback?: Function): TheRouter;
        route(route: RegExp, name: string, callback?: Function): TheRouter;
        navigate(fragment: string, options?: NavigateOptions): TheRouter;
        navigate(fragment: string, trigger?: boolean): TheRouter;

    }
    
     
    interface mzBackboneRouter extends TheRouter {
        start(options: RouterOptions, cb?: (route: TheRouter) => void);
    }

module mz {
    
    

    export var route: mzBackboneRouter = <any>{
        start: (options: RouterOptions, cb?: (route: TheRouter) => void) => {
            var b = mz.require("backbone");

            route = mz.route = new (b.Router.extend(options))();
            b.history.start();
            route.start = function (a, b) {
                b && b(route)
            };
            console.log("Backbone loaded! Route started!", mz.route);

            cb && cb(route);
        }
    };
}