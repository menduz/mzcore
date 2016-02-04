namespace mz.dom {
    export var adapter: mz.dom.AbstractDomAdapter;

    export function setRootDomAdapter(theAdapter: mz.dom.AbstractDomAdapter) {
        if (!adapter) {
            mz.scriptBase = theAdapter.getBaseHref() || '';
            adapter = theAdapter;
        }
    }
}