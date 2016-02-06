/// <reference path="Require.ts" />
/// <reference path="..\..\mz.ts" />

module mz {
    var testRequires = /require\(\w*(('|")([^\)\2]+)\2)\w*\)/g;


    export var modules: Dictionary<Module> = {};


    export class Module {
        exports: any = null;
        id: string;
        loaded = false;
        parent = null;
        children = [];
        filename: string = null;
        path: string = null;
        defined = false;
        async = false;

        callbacks = [];

        dependencias = {};
        ModuleExports: ModuleExports;

        constructor(name) {
            this.id = name || null;
            (<any>this.define).amd = mz.define.amd || {};
            this.ModuleExports = new ModuleExports(this);


        }

        getPath(x) {
            return mz.getPath(x, this.path);
        }

        require(Module: Array<string> | string, b?) {
            if (<any>Module instanceof Array) {
                var r = [];
                for (var i in <Array<string>>Module) {
                    var original = r[i];
                    r[i] = this.getPath(Module[i]);

                    if (original != r[i]) {
                        if (r[i].startsWith('http') && !r[i].endsWith('.js')) r[i] += '.js';
                    }
                }
                return mz.require(r, b);
            } else
                return mz.require(this.getPath(Module), b);
        }

        define(...args: any[]) {
            var ret = mz.define.apply(null, arguments);
            mz.define.lastModule.parent = this;
            this.children.push(mz.define.lastModule);
            return ret;
        }
    }

    export class ModuleExports {
        module: Module;
        seteado: boolean;

        constructor(theModule: Module) {
            this.module = theModule;
            this.module.exports = {};
            this.seteado = false;
        }

        set(factory, params) {
            if ((<any>mz)._debug && typeof factory == 'function') {
                if (testRequires.test(factory)) {
                    var that = this;

                    var deps = null;
                    var depsCargadas = null;

                    (<any>String(factory)).replace(testRequires, function(all, d1, d2, key) {
                        if (!(key in that.module.dependencias)) {
                            if (key in mz.modules) {
                                depsCargadas = depsCargadas || {};
                                depsCargadas[key] = (depsCargadas[key] || 0) + 1;
                            } else {
                                deps = deps || {};
                                deps[key] = (deps[key] || 0) + 1;
                            }
                        }
                    });

                    if (deps) {
                        console.group(this.module.id + " - Dependencias sincrónicas NO definidas NI cargadas");
                        for (var i in deps) {
                            if (!(i in mz.modules))
                                console.error(i, deps[i]);
                        }
                        console.groupEnd();
                    }
                }
            }

            var result;
            if (typeof factory === 'function') {
                let bkRequire = globalContext.require;
                let bkExports = globalContext.exports;
                let bkModulo = globalContext.module;
                let bkDefine = globalContext.define;
                

                try {
                    globalContext.define = this.module.define.bind(this.module);
                    globalContext.exports = this.module.exports;
                    globalContext.require = this.module.require.bind(this.module);
                    globalContext.module = this.module;

                    (<any>globalContext.define).amd = bkDefine.amd;

                    result = factory.apply(this.module.exports, params)
                } finally {
                    globalContext.define = bkDefine;
                    globalContext.exports = bkExports;
                    globalContext.require = bkRequire;
                    globalContext.module = bkModulo;
                }
            } else result = factory;

            this.seteado = true;

            if (result !== this.module.exports) {
                if (isDef(result) && typeof result != "string" && typeof result != "number" && typeof result != "boolean") {
                    this.module.exports = mz.copy(result, this.module.exports);
                }
            }

            this.module.defined = true;

            this.module.loaded = true;

            var cb = null;

            while (this.module.callbacks.length && (cb = this.module.callbacks.shift())) {
                if (cb.cb)
                    cb.cb(this.module.exports);
            }
        }
    }
}
declare var module: mz.Module;