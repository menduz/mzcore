/// <reference path="../strings.ts" />
/// <reference path="../Xr.ts" />
/// <reference path="define.ts" />

module mz {
    export function require(Module: string): any;
    export function require(Module: string, Callback: Function): void;
    export function require(Module: string[], Callback: IModuleCallback): void;
    export function require(a: string | Array<string>, callback?: Function | IModuleCallback) {
        var esFn = typeof callback == 'function';

        if (typeof a == 'object' && (<any>a) instanceof Array && callback) {
            var count = a.length;
            var args = [];
            var elems: Array<string> = <any>a;
            for (var i in elems) {
                (function(i, elem) {
                    mz.require(elem, function(ret) {
                        args[i] = ret;
                        if ((--count) == 0)
                            callback.apply(this, args);
                    });
                })(i, elems[i]);
            }
        } else {
            var elem = a.toString();
            if (elem == "exports") {
                if (esFn) {
                    callback({});
                } else {
                    console.error("require('exports') en lugar ilegal. sólo se puede utilizar en una llamada a define(['exports'], function(exports)..");
                    return {};
                }
            } else if (elem == "require") {
                if (esFn) {
                    callback(mz.require);
                } else {
                    return mz.require;
                }
            } else if (elem in mz.modules) {
                if (esFn) {
                    if (mz.modules[elem].loaded) {
                        callback(mz.modules[elem].exports);
                    } else {
                        mz.modules[elem].callbacks.push({
                            cb: callback,
                            reqs: elems
                        });
                    }
                } else {
                    if (mz.modules[elem].loaded) {
                        return mz.modules[elem].exports;
                    }
                }
            } else {
                var promise = mz.require.route(elem).then(archivo => {
                    if (!archivo) {
                        if (!/\.js$/.test(elem))
                            archivo = elem + '.js';
                        else
                            archivo = elem;
                    }
                    
                    if (archivo.endsWith('.ts')) {
                        archivo = archivo.replace(/\.ts$/, '.js');
                    }

                    if (archivo) {
                        mz.include(archivo, elem, esFn);
                    }

                    if (!esFn) {
                        if (mz.modules[elem]) {
                            if (mz.modules[elem].loaded)
                                return mz.modules[elem].exports;
                        } else {
                            throw 'Módulo desconocido [[' + elem + ']]';
                        }
                    } else {
                        if (mz.modules[elem]) {
                            if (mz.modules[elem].loaded)
                                callback(mz.modules[elem].exports);
                            else
                                mz.modules[elem].callbacks.push({
                                    cb: callback,
                                    reqs: elem
                                });
                            return mz.modules[elem];
                        } else {
                            return null;
                        }
                    }
                });
            }
        }
    }

    var modulosCargados = {};

    export function include(url: string, nombreModulo: string, async?: boolean) {
        var urlBuscada = mz.getPath(url);
        var path = urlBuscada.split('/');
        path.pop();

        var module = mz.modules[nombreModulo] = new mz.Module(nombreModulo);

        module.async = !!async;
        module.filename = urlBuscada.toString();
        module.path = path.join('/') + '/';

        //if (module.path == '/') module.path = mz.getAbsoluteUrl();

        modulosCargados[url] = loadModule(urlBuscada, module);

        if (async == false && modulosCargados[url] == false) {
            throw 'Include: No se pudo cargar el módulo [[' + nombreModulo + ']] en ' + url;
        }

        return true;
    }

    function loadModule(url: string, module: Module, async?: boolean) {
        var successflag = false;

        if ('scriptBase' in mz) {
            var baseURL = mz.xr.getAbsoluteUrl(mz.scriptBase.toLowerCase()).toLowerCase();

            url = mz.xr.getAbsoluteUrl(url);

            if (url.toLowerCase().startsWith(baseURL)) {
                url = url.toLowerCase().replace(baseURL, '');
            }
        }

        var processResponse = function(result) {
            //try {
            var bkCM = mz.define.currentModule || null;
            mz.define.currentModule = module;


            var bkRequire = globalContext.require;
            var bkExports = globalContext.exports;
            var bkModulo = globalContext.module;
            var bkDefine = globalContext.define;
            var bkñ = globalContext.ñ;

            try {
                globalContext.define = module.define.bind(module);
                globalContext.exports = module.exports;
                globalContext.require = module.require.bind(module);
                globalContext.module = module;
                globalContext.ñ = module.ñ.bind(module);

                (<any>globalContext.define).amd = bkDefine.amd;

                (function(str) {
                    return eval(str);
                }).call(
                    module.exports,
                    result + '\n//@ sourceURL=' + url
                    );

            } finally {
                globalContext.define = bkDefine;
                globalContext.exports = bkExports;
                globalContext.require = bkRequire;
                globalContext.module = bkModulo;
                globalContext.ñ = bkñ;
            }

            /*
            jQuery.globalEval(
                'var a = mz.proxy(mzcore.define.currentModule, "define");a.amd = mzcore.define.amd;(function(require, exports, module, define, ñ){ ' +
                result +
                '\n})(mz.proxy(mzcore.define.currentModule, "require"), mzcore.define.currentModule.exports, mzcore.define.currentModule, a, mz.proxy(mzcore.define.currentModule, "ñ"));\n' +
                '//@ sourceURL=' + (module.id || url)
            );
            */

            if (mz.define.currentModule) {
                mz.define.currentModule.loaded = true;

                if (mz.define.currentModule.defined == false) {
                    mz.define.currentModule.ModuleExports.set(mz.define.currentModule.exports, []);
                }
            }



            mz.define.currentModule = bkCM;
            successflag = true;
            /*} catch (e) {
            console.error('Include: Parser: No se pudo cargar el módulo [[' + (module.id || url) + ']] en ' + url, e, e.stack);

            if ('error' in e && 'message' in e) {
            console.error(e.error, e.message, e.stack);
            }
            }*/

        }



        if (mz.hardCodedFiles && url in mz.hardCodedFiles) {
            processResponse(mz.hardCodedFiles[url]);
        } else {
            jQuery.ajax({
                async: module.async,
                type: "GET",
                url: url,
                data: null,
                success: function(result) {
                    processResponse(result);
                },
                fail: function() {
                    console.error('Include: No se pudo cargar el módulo [[' + (module.id || url) + ']] en ' + url);
                },
                dataType: 'text'
            });
        }
        return successflag;
    }
}

module mz.require {

    var escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    export var routes: { key: string; source: string | RegExp; destination: string | RegExp | ((sourceName: string) => Promise<string>); }[] = [];


    export function route(matchPath: string | RegExp, destination: RegExp | string | ((sourceName: string) => Promise<string>));
    export function route(path: string): Promise<string>;
    export function route(source: string | RegExp, dest?: string | RegExp) {
        if (arguments.length == 1 && typeof source === 'string') {
            for (var i in routes) {
                var rt = routes[i];

                if (typeof rt.source === "string" && rt.source == source) {
                    return Promise.resolve(<string>rt.destination);
                } else if (typeof routes[i].destination === "function") {
                    return (routes[i].destination as any)(source);
                } else if ((<RegExp>rt.source).test(source)) {
                    return Promise.resolve(source.replace(<any>routes[i].source, <any>routes[i].destination));
                }
            }
        } else if (arguments.length == 2) {

            var routeIndex = -1, key = source.toString();

            for (var i in routes)
                if (routes[i].key == key) {
                    routeIndex = i;
                    break;
                }

            var newRoute = {
                key: key,
                source: (<any>source) instanceof RegExp ? source : new RegExp('^' + escapeRegExp(source).replace(/\\\*/g, '([\\w-]+)') + '$'),
                destination: dest
            };

            if (routeIndex == -1)
                routes.push(newRoute);
            else
                routes[routeIndex] = newRoute;
        }
        return Promise.resolve(null);
    }

    route('http://*', 'http://$1');
    route('https://*', 'https://$1');
    route('/*.js', '/$1.js');

    export function defineFiles(files: mz.Dictionary<string>) {
        for (var i in files) {
            mz.hardCodedFiles[i.toLowerCase()] = files[i];
        }
    }

}

mz.require.route("jquery", "@mz/jquery.js");

(<any>window).require = mz.require;