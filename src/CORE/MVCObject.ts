/// <reference path="../mz.ts" />
/// <reference path="EventDispatcher.ts" />



namespace mz {
    export const MVCOBJECT_VALIDATOR_SYMBOL = Symbol("mvcobject-validators");


    export class MVCObject extends mz.EventDispatcher {

        static EVENTS = mz.copy({
            /** Triggered when the method setValues is called */
            setValues: "setValues",

            /** Triggered when a value is setted */
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

            let preventPropagation = false;

            this.data[field] = value;

            var ch = field + '_changed';
            var result;

            if (MVCOBJECT_VALIDATOR_SYMBOL in this && field in this[MVCOBJECT_VALIDATOR_SYMBOL]) {
                let array = this[MVCOBJECT_VALIDATOR_SYMBOL][field];
                for (let i = 0; i < array.length; i++) {
                    let validator = array[i];
                    
                    try {
                        if (validator instanceof ModelValidator) {
                            result = (validator as ModelValidator).validate(value, viejo)
                        } else {
                            result = validator(value, viejo);
                        }

                        if (typeof result !== "undefined") {
                            value = this.data[field] = result;
                        }
                    } catch (e) {
                        if (e === MVCObject.Exception_RollbackOperation) {
                            this.data[field] = viejo;
                            return;
                        } else if (e === MVCObject.Exception_PreventPropagation)
                            preventPropagation = true;
                        else
                            throw e;
                    }
                }
            }

            if (ch in this && typeof this[ch] === 'function') {
                try {
                    result = this[ch](value, viejo);
                } catch (e) {
                    if (e === MVCObject.Exception_RollbackOperation) {
                        this.data[field] = viejo;
                        return;
                    } else if (e === MVCObject.Exception_PreventPropagation)
                        preventPropagation = true;
                    else
                        throw e;
                }
            }

            if (preventPropagation)
                return;

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

        toJSON() {
            return this.getAll();
        }
    }

    export class ModelValidator {
        constructor(private target: MVCObject, private propertyKey: string | symbol, public props: any) {

        }

        validate(newVal, prevVal) {
            return newVal;
        }
    }
}



namespace mz.MVCObject {
    export interface IModelValidator {
        <T>(newVal: T, prevVal: T): T;
    }

    export type TModelValidator = IModelValidator | ModelValidator;

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

    export function ModelProp(props: {
        validators: TModelValidator[],
        /** If the assigned value is a MVCObject, then we listen the changes in the inner props */
        deep?: boolean;
    }) {
        return function(target: mz.MVCObject, propertyKey: string | symbol) {
            if (delete target[propertyKey]) {
                if (!target[MVCOBJECT_VALIDATOR_SYMBOL]) {
                    target[MVCOBJECT_VALIDATOR_SYMBOL] = {};
                }

                // ensure list
                let list: TModelValidator[] = target[MVCOBJECT_VALIDATOR_SYMBOL][propertyKey] = target[MVCOBJECT_VALIDATOR_SYMBOL][propertyKey] || [];
                target[MVCOBJECT_VALIDATOR_SYMBOL][propertyKey] = list.concat(props.validators);

                if(props.deep){
                    proxyDeep(target, propertyKey);
                } else {
                    proxy(target, propertyKey);
                }
            }
        }
    }

    export function proxyDeep(target: MVCObject, propertyKey: string | symbol) {
        if (delete target[propertyKey]) {
            var listener: mz.EventDispatcherBinding = null;
            Object.defineProperty(target, propertyKey.toString(), {
                get: function() {
                    return this.data[propertyKey];
                },
                set: function(value) {
                    if (listener && listener.object == value) {
                        this.set(propertyKey, value);
                    } else {
                        listener && listener.off();

                        if (value instanceof MVCObject) {
                            listener = value.on(MVCObject.EVENTS.valueChanged, () => this.touch(propertyKey))
                        } else {
                            listener = null;
                        }
                    }
                },
                enumerable: true
            });
        }
    }
}