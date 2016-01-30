module mz {
    var eventSplitter = /\s+/g;

    export class EventDispatcherBinding {
        id: string;
        cb = null;
        evento: string = null;
        sharedList = null;
        object: EventDispatcher = null;

        off() {
            if (this.object) {
                this.cb && this.object.off(this);
                this.cb = null;
                this.object = null;
            }
        }
    }
    
    export class EventDispatcher {
        private ed_bindeos: any = {};
        private ed_bindeosTotales: any = [];
        private ed_bindCount = 0;

        on(event: string, callback: Function, once?: boolean) {
            this.ed_bindCount++;

            var events = event.split(eventSplitter);

            var tmp;
            var listaBindeos = [];

            events.forEach(evt => {
                tmp = new EventDispatcherBinding();
                tmp.id = this.ed_bindCount;
                tmp.cb = null;
                tmp.evento = evt;
                tmp.sharedList = listaBindeos;
                tmp.object = this;

                listaBindeos.push(tmp);

                if (once) {
                    tmp.cb = function() {
                        callback.apply(this, arguments);
                        tmp.cb = null;
                    }
                } else {
                    tmp.cb = callback;
                }

                this.ed_bindeosTotales[tmp.id] = tmp;

                this.ed_bindeos[evt] = this.ed_bindeos[evt] || [];
                this.ed_bindeos[evt].push(tmp);
            });

            return tmp;
        }

        once(event: string, callback: Function) {
            return this.on(event, callback, true);
        }

        off(bindeo?: string | Function | EventDispatcherBinding, callback?: Function) {
            if (bindeo instanceof EventDispatcherBinding) {
                bindeo.cb = null;
                bindeo.sharedList && bindeo.sharedList.length && bindeo.sharedList.forEach(function(f) { f.cb = null; });
            } else if (typeof bindeo == 'string') {
                if (typeof callback == 'function') {
                    for (var i in this.ed_bindeos) {
                        if (this.ed_bindeos[i].cb === callback) {
                            this.ed_bindeos[i].cb = null;
                        }
                    }
                } else if (typeof bindeo == 'string') {
                    this.ed_bindeos[bindeo as string] = [];
                }
            } else if (typeof bindeo === 'function') {
                for (var i in this.ed_bindeos) {
                    if (this.ed_bindeos[i].cb === bindeo) {
                        this.ed_bindeos[i].cb = null;
                    }
                }
            } else if (bindeo === undefined && callback === undefined) {
                for (var i in this.ed_bindeos) {
                    delete this.ed_bindeos[i].cb;
                }
            }
        }

        emit(event: string, ...params: any[]) {
            if (event in this.ed_bindeos) {

                if (arguments.length == 1) {
                    var ValorReturn = [];

                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.call(this);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }

                    return ValorReturn;
                } else if (arguments.length == 2) {
                    var ValorReturn = [];

                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.call(this, arguments[1]);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }

                    return ValorReturn;
                } else if (arguments.length > 2) {
                    var args = Array.prototype.slice.call(arguments, 1);

                    var ValorReturn = [];

                    for (var i in this.ed_bindeos[event]) {
                        if (this.ed_bindeos[event][i].cb) {
                            var res = this.ed_bindeos[event][i].cb.apply(this, args);
                            res !== undefined && ValorReturn.push(res);
                        }
                    }

                    return ValorReturn;
                }
            }
        }
        
        trigger = this.emit;
    }
}