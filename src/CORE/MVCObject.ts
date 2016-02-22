/// <reference path="../mz.ts" />
/// <reference path="EventDispatcher.ts" />

namespace mz {
    export class MVCObject extends mz.EventDispatcher {

        static EVENTS = mz.copy({
            /// Triggered when the method setValues is called
            setValues: "setValues",
            /// Triggered when a value is setted
            valueChanged: "valueChanged"
        },
            EventDispatcher.EVENTS);

        protected data: Dictionary<any> = {};

        constructor(args?) {
            super();
            args && this.setValues(args);
        }

        getAll() { return this.data; }

        setValues(values: any | MVCObject, emit?: boolean) {
            if (values instanceof MVCObject) {
                values = values.getAll();
            }

            for (var i in values) {
                this.set(i, values[i], !emit);
            }

            this.emit(MVCObject.EVENTS.setValues, this.data, values);
        }

        set(field: string, value: any, NoTrigerearChanged?: boolean) {
            if (!isDef(field)) return;

            var viejo = this.data[field];

            this.data[field] = value;

            var ch = field + '_changed';

            if (ch in this && typeof this[ch] === 'function')
                var result = this[ch](value, viejo);

            if (typeof result !== "undefined") {
                value = this.data[field] = result;
            }

            this.emit(ch, this.data[field], viejo);

            !NoTrigerearChanged && this.emit(MVCObject.EVENTS.valueChanged, this.data, field, this.data[field], viejo);
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