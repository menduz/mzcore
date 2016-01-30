/// <reference path="module.ts" />


module mz {
    export function undefine(mod: string) {
        if (mod in mz.modules) {
            mz.modules[mod] = null;
            delete mz.modules[mod];
        }
    }

    export function define(ObjetoDefinido: Object): Object;
    export function define(Callback: Function): void;
    export function define(RequiredModules: string[], Callback: IModuleCallback): void;
    export function define(Module: string, ObjetoDefinido: Object): Object;
    export function define(Module: string, Callback: Function): void;
    export function define(Module: string, RequiredModules: string[], Callback: IModuleCallback): void;
    export function define() {
        var name = mz.buscarArgumentoTipo('string', arguments) || (mz.define.currentModule ? mz.define.currentModule.id : null) || null;
        var fn = mz.buscarArgumentoTipo('function', arguments) || null;
        var reqs = mz.buscarArgumentoTipo(Array, arguments) || null;

        var obj = !fn && arguments.length && typeof arguments[arguments.length - 1] == "object" && arguments[arguments.length - 1] || null;

        if (!fn && obj) {
            fn = obj;
        }

        var module = null;

        if (mz.define.currentModule && mz.define.currentModule.id == name) {
            module = mz.define.currentModule;
            mz.define.currentModule = null;
        } else {
            module = new mz.Module(name);
            if (obj) module.exports = obj;
        }

        mz.define.lastModule = module;

        if (name !== null) {
            if (name in mz.modules && mz.modules[name] !== module) {
                if ((<any>mz)._debug) debugger;
                throw "Ya está definido " + name;
            }

            mz.modules[name] = module;

            if (reqs && reqs.length) {
                var args = [];

                if (module.async) {
                    module.require(reqs, function (args) {
                        for (var i in reqs) {
                            if (reqs[i] == "exports")
                                arguments[i] = module.exports;
                            else if (reqs[i] == "require")
                                arguments[i] = module.require;
                        }

                        module.ModuleExports.set(fn, arguments);
                    });
                } else {
                    for (var i in reqs) {
                        if (reqs[i] == "exports") {
                            module.dependencias[reqs[i]] = args[i] = module.exports;
                        } else if (reqs[i] == "require")
                            module.dependencias[reqs[i]] = args[i] = module.require;
                        else
                            module.dependencias[reqs[i]] = args[i] = module.require(reqs[i]);
                    }

                    module.ModuleExports.set(fn, args);
                }
            } else {
                module.ModuleExports.set(fn, []);
            }
        } else {
            module.ModuleExports.set(fn, []);
        }

        return module.exports;

    }
    define.amd = {};
}


module mz.define {
    export var amd: any;
    export var lastModule: Module;
    export var currentModule: Module;
}

mz.globalContext.define = mz.define;