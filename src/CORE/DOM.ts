namespace mz.core.dom {
    export var adapter: mz.core.dom.AbstractDomAdapter;

    export function setRootDomAdapter(theAdapter: mz.core.dom.AbstractDomAdapter) {
        if (!adapter) {
            mz.scriptBase = theAdapter.getBaseHref() || '';
            adapter = theAdapter;
        }
    }
}