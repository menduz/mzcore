/// <reference path="../mz.ts" />
/// <reference path="EventDispatcher.ts" />

namespace mz {
    export class MVCObject extends mz.EventDispatcher {

        static EVENTS = mz.copy({
            /// Triggered when the method setValues is called
            setValues: "setValues",
            /// Triggered when a value is setted
            valueChanged: "valueChanged"
        }, EventDispatcher.EVENTS);
        
        static Exception_RollbackOperation = new Error("The change operation has been rolled back");
        static Exception_PreventPropagation = new Error("The propagation events has been aborted");

        protected data: Dictionary<any> = {};

        constructor(args?) {
            super();
            args && this.setValues(args);
        }

        getAll() { return mz.copy(this.data); }

        setValues(values: any | MVCObject, emit?: boolean) {
            if (values instanceof MVCObject) {
                values = values.getAll();
            }

            for (var i in values) {
                this.set(i, values[i], !emit);
            }

            this.emit(MVCObject.EVENTS.setValues, this.data, values);
        }

        set(field: string, value: any, PreventPropagation?: boolean) {
            if (typeof field === "undefined") return;

            var viejo = this.data[field];

            this.data[field] = value;

            var ch = field + '_changed';
            var result;

            if (ch in this && typeof this[ch] === 'function'){
                try {
                    result = this[ch](value, viejo);
                } catch (e) {
                    if(e === MVCObject.Exception_RollbackOperation){
                        this.data[field] = viejo;
                        return;
                    }
                    
                    if(e === MVCObject.Exception_PreventPropagation) 
                        return;
                        
                    throw e;
                }
            }

            if (typeof result !== "undefined") {
                value = this.data[field] = result;
            }

            this.emit(ch, this.data[field], viejo);

            !PreventPropagation && this.emit(MVCObject.EVENTS.valueChanged, this.data, field, this.data[field], viejo);
        }

        get(field: string) {
            return this.data[field];
        }

        touch(fieldName: string) {
            this.set(fieldName, this.get(fieldName));
        }
    }
}

namespace mz.MVCObject {
    export function proxy(target: mz.MVCObject, propertyKey: string | symbol) {
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey.toString(), {
                get: function() {
                    return this.data[propertyKey];
                },
                set: function(value) {
                    this.set(propertyKey, value);
                },
                enumerable: true
            });
        }
    }
}