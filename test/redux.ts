/// <reference path="../dist/mz.d.ts" />

var kreate_store : typeof mz.redux.createStore = mz.globalContext.devToolsExtension ? mz.globalContext.devToolsExtension()(mz.redux.createStore) : mz.redux.createStore;


export var store = kreate_store(function(state, action) {
    switch (action.type) {

        case 'inc':
            return mz.copy({}, state, {
                ja: {
                    valor: mz.intval(state.ja.valor) + 1,
                    list: [{ val: "a" }, { val: "aaaaaa" }, { val: "c" }]
                }
            });
        case 'dec':
            return mz.copy({}, state, {
                ja: {
                    valor: mz.intval(state.ja.valor) - 1,
                    list: [{ val: "a" }, { val: "dddd" }, { val: "c" }]
                }
            });
        default:
            return state;
    }
}, /* initial state */
    {
        ja: {
            valor: 'hola redux',
            list: [{ val: "a" }, { val: "b" }, { val: "c" }]
        }
    }
);

@mz.redux.connectWidget(state => state.ja, store)
@mz.Widget.Template(`
<div>
    <button onclick="{this.inc}">+</button>
    <button onclick="{this.dec}">-</button>
    {scope.valor}
    <mz-repeat list="{scope.list}" tag="ul">
        <li>{scope.val}</li>
    </mz-repeat>
</div>`)
class ReduxComponent extends mz.widgets.BasePagelet {
    inc() {
        store.dispatch({ type: 'inc' });
    }
    dec() {
        store.dispatch({ type: 'dec' });
    }
}

(new ReduxComponent()).appendTo("body");

