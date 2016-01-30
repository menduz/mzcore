namespace mz.core.dom {
	export var adapter: mz.core.dom.AbstractDomAdapter;
	export var parser: mz.core.dom.AbstractDomParser;

	export function setRootDomAdapter(theAdapter: mz.core.dom.AbstractDomAdapter) {
		if (!adapter) {
			adapter = theAdapter;
		}
	}
	
	export function setRootDomParser(theParser: mz.core.dom.AbstractDomParser) {
		if (!parser) {
			parser = theParser;
		}
	}
}