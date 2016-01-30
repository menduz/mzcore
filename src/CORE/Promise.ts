/// <reference path="../mz.ts" />
/// <reference path="Date.ts" />
module mz.promise {
	export function wait(time: number) {
		return function <T>(data: T): Promise<T> {
			return new Promise(ok => setTimeout(() => ok(data), time));
		};
	};

    export function yield<T>(data: T): Promise<T> {
		return new Promise(ok => setImmediate(() => ok(data)));
	};

	export function nextFrame<T>(data: T): Promise<T> {
		return new Promise(ok => requestAnimationFrame(() => ok(data)));
	};

	export function parseStringDates<T>(data: T): Promise<T> {
		var tipo = typeof data;

		if (!(tipo == "boolean" || tipo == "number" || tipo == "string"))
			return Promise.resolve(mz.date.parseObject(data));
		return Promise.resolve(data);
	};

	export var parseJSON: (str: string) => Promise<any>;

	if ('Response' in globalContext && 'fetch' in globalContext) {
		parseJSON = function(data): Promise<any> {
			return (new globalContext.Response(data)).json()
		}
	} else {
		parseJSON = function(data): Promise<any> {
            let result : any;
            try {
                result = JSON.parse(data);
            } catch (error) {
                return Promise.reject(error);
            }
            return Promise.resolve(result);
		}
	}
}