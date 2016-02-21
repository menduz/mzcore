
// redux devToolsExtension allowed!
declare var createStore;

// INITIAL STATE
const initialState = {
    counter: 0,
    actionList: []
}

// ACTIONS
const INCREMENT = 'inc';
const DECREMENT = 'dec';

function createIncrementAction() {
    return { type: INCREMENT };
}
function createDecrementAction() {
    return { type: DECREMENT };
}









// STORE AND REDUCER
let store = createStore(function(state: typeof initialState, action) {
    console.log(arguments);
    switch (action.type) {
        case INCREMENT:
            return {
                counter: mz.intval(state.counter) + 1,
                actionList: cloneArrayAndPush(state.actionList, action)
            };
        case DECREMENT:
            return {
                counter: mz.intval(state.counter) - 1,
                actionList: cloneArrayAndPush(state.actionList, action)
            };
    }

    return state;
}, initialState);







// COMPONENT <action-list />, RENDERS THE ACTIONS PERFORMED, STORED ON state.actionList
@ActionListComponent.RegisterComponent('action-list')
@mz.redux.connectWidget(state => state.actionList, store)
@ActionListComponent.Template(`
<div>
    <h1>Action history</h1>
    <mz-repeat list="{scope}" tag="ul">
        <li>{scope.type}</li>
    </mz-repeat>
</div>
`)
@ActionListComponent.ConfigureUnwrapped
class ActionListComponent extends mz.Widget { }




// COMPONENT <actual-state />, RENDERS THE ACTUAL STATE
@ActionListComponent.RegisterComponent('actual-state')
@mz.redux.connectWidget(state => state, store)
@ActionListComponent.Template(`
<div>
    <h1>Actual state</h1>
    <pre>{JSON.stringify(scope, null, 2)}</pre>
</div>
`)
@ActionListComponent.ConfigureUnwrapped
class ActualStateComponent extends mz.Widget { }





// MAIN PAGE
// First we connect the widget to our state's branch
@mz.redux.connectWidget(
    (state: typeof initialState) => state.counter
    , store)
// set the template
@ReduxPage.Template(module.getPath('./inc-dec.xml'))
class ReduxPage extends mz.app.Page {
    inc() {
        store.dispatch(createIncrementAction());
    }
    dec() {
        store.dispatch(createDecrementAction());
    }
}





// HELPERS

function cloneArray(array: Array<any>) {
    let newArray = new Array(array && array.length || 0);
    array && array.forEach((item, index) => newArray[index] = item);
    return newArray;
}

function cloneArrayAndPush(array: Array<any>, element) {
    let newArray = cloneArray(array);
    newArray.push(element);
    return newArray;
}









export = ReduxPage;