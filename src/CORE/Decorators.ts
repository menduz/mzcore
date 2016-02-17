/// <reference path="../mz.ts" />

module mz.core.decorators {
    export function LogResult(target: Function, key: string, value: any) {
        return {
            value: function(...args: any[]) {

                var a = args.map(a => JSON.stringify(a)).join();
                var result = value.value.apply(this, args);
                var r = JSON.stringify(result);

                console.log(`LogResult: ${key}(${a}) => ${r}`);

                return result;
            }
        };
    }

    export function noEnumerable(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        descriptor.enumerable = false;
        return descriptor;
    }

    var delayerCount = 0;

    export function delayer(timeout: number) {
        return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
            let originalValue = descriptor.value;
            var delayerID = Symbol(`[[delayer-${delayerCount++}]]`);

            descriptor.value = <any>function() {
                let theDelayer = this[delayerID] = this[delayerID] || mz.delayer(originalValue, timeout, this);
                return theDelayer.apply(this, arguments);
            };

            return descriptor;
        }
    }

    export function screenDelayer<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        let originalValue = descriptor.value;
        var delayerID = Symbol(`[[delayer-${delayerCount++}]]`);

        descriptor.value = <any>function() {
            let theDelayer = this[delayerID] = this[delayerID] || mz.screenDelayer(originalValue, this);
            return theDelayer.apply(this, arguments);
        };

        return descriptor;
    }

}