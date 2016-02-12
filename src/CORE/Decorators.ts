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
            /*let theDelayer = mz.delayer(descriptor.value, timeout);
            
            descriptor.value = function(){
                theDelayer.apply(this, arguments);
            };
            */
            console.error(propertyKey + ": !!ALERTA, LOS DECORADORES mz.core.decorators.delayer & screenDelayer NO FUNCIONAN AUN");
            return descriptor;
        }
    }

    export function screenDelayer<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        /*let theDelayer = mz.screenDelayer(descriptor.value);
            
            descriptor.value = <any>function(){
                return (<any>theDelayer).apply(this, arguments);
            };
          */
        let originalValue = descriptor.value;
        var delayerID = `[[delayer-${delayerCount++}]]`;
        console.error(propertyKey + ": !!ALERTA, LOS DECORADORES mz.core.decorators.delayer & screenDelayer NO FUNCIONAN AUN");

        descriptor.value = <any>function() {
            let theDelayer = this[delayerID] = this[delayerID] || mz.screenDelayer(originalValue, this);
            return theDelayer.apply(this, arguments);
        };

        return descriptor;

    }

}