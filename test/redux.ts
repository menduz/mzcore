/// <reference path="../dist/mz.d.ts" />

var kreate_store: typeof mz.redux.createStore = mz.globalContext.devToolsExtension ? mz.globalContext.devToolsExtension()(mz.redux.createStore) : mz.redux.createStore;

var manager = mz.redux.createManager();

manager.when('inc', function(state, action) {
    return mz.copy({}, state, {
        ja: {
            valor: mz.intval(state.ja.valor) + 1,
            list: [{ val: "a" }, { val: "aaaaaa" }, { val: "c" }]
        },
        valor: mz.intval(state.valor) + 1
    });
});

manager.when('dec', function(state, action) {
    return mz.copy({}, state, {
        ja: {
            valor: mz.intval(state.ja.valor) - 1,
            list: [{ val: "a" }, { val: "dddd" }]
        },
        valor: mz.intval(state.valor) + 1
    });
});


export var store = kreate_store(manager, /* initial state */
    {
        ja: {
            valor: 'hola redux',
            list: [{ val: "a" }, { val: "b" }, { val: "c" }]
        },
        valor: 0
    }
);

@mz.redux.connectWidget(state => state.ja, store)
@mz.Widget.Template(`
<div>Mensajes:
    <button onclick="{this.inc}">+</button>
    <button onclick="{this.dec}">-</button>
    {scope.valor}
    <mz-repeat list="{scope.list}" tag="ul">
        <li class="{this.testCaller().toString() + (this.val ? ' par' : ' inpar') + this.val}" onclick="{this.updateVal}">{scope.val}</li>
        {scope.val}
    </mz-repeat>
</div>`)
class ReduxComponent extends mz.widgets.BasePagelet {
    inc() {
        store.dispatch({ type: 'inc' });
    }
    dec() {
        store.dispatch({ type: 'dec' });
    }

    updateVal() {
        this.val = !this.val;
    }

    @ReduxComponent.proxy
    val: boolean;

    count = 0;

    testCaller() {
        this.count++;
        return ' called-' + this.count;
    }

    componentInitialized() {
        console.error('ReduxComponent.componentInitialized')
        setInterval(() => {
            this.count = 0;
            this.val = !this.val;
            //console.log(this.count, ' Updates');
        }, 3000);
    }
}

(new ReduxComponent()).appendTo("body");








// store.subscribe(listener)











@mz.redux.connectWidget(state => state.valor, store)
@mz.Widget.Template(`
<div style="color: {red: scope % 2 == 1, green: scope % 2 == 0}">
    Cantidad mensajes: {scope}
</div>`)
class ReduxComponent2 extends mz.widgets.BasePagelet {
    @ReduxComponent2.proxy
    scope: number;
}

(new ReduxComponent2()).appendTo("body");

