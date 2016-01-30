/// <reference path="../mz.ts" />

namespace Reflect {
	var originalMetadata = Reflect.metadata;
	
	export var MetadataInfo : string | symbol = Symbol("mz.metadata.typings");
	
	var valueSetter = {
      enumerable: false,
      writable: false,
      configurable: false,
      value: null
    }
	
	export function metadata(metadataKey: any, metadataValue: any) {
		if('design:type' == metadataKey){
			if(typeof MetadataInfo =="string"){
				return function decorator(target: Object, targetKey?: string | symbol): void {
					let typings = target[MetadataInfo];
					
					if(!typings){
						typings = setObjectSymbol(target, MetadataInfo, {});
					}
					
					typings[targetKey] = metadataValue;
					
					originalMetadata && originalMetadata(metadataKey, metadataValue).apply(this, arguments);
				}
			} else {
				return function decorator(target: Object, targetKey?: string | symbol): void {
					
					let typings = (target[MetadataInfo] = target[MetadataInfo] || {})
					
					typings[targetKey] = metadataValue;
					
					originalMetadata && originalMetadata(metadataKey, metadataValue).apply(this, arguments);
				}
			}
			
		} else return originalMetadata && originalMetadata(metadataKey, metadataValue) || undefined;
    }

	export function setObjectSymbol<T>(target: Object, symbol: string | symbol, value: T): T{
		if(typeof symbol == "symbol"){
			target[symbol] = value;
		} else {
			valueSetter.value = value;
			Object.defineProperty(target, symbol.toString(), valueSetter);
		}
		return value;
	}
}