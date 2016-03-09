
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
                actionList: mz.redux.stateHelpers.cloneArrayAndPush(state.actionList, action)
            };
        case DECREMENT:
            return {
                counter: mz.intval(state.counter) - 1,
                actionList: mz.redux.stateHelpers.cloneArrayAndPush(state.actionList, action)
            };
    }

    return state;
}, initialState);







// COMPONENT <action-list />, RENDERS THE ACTIONS PERFORMED, STORED ON state.actionList
@mz.redux.connectWidget(state => state.actionList, store)   // redux
@ActionListComponent.RegisterComponent('action-list')       // register the component
@ActionListComponent.Template(module.getPath('./action-history.xml'))
@ActionListComponent.ConfigureUnwrapped
class ActionListComponent extends mz.Widget { }



// COMPONENT <actual-state />, RENDERS THE ACTUAL STATE
@mz.redux.connectWidget(state => state, store)
@ActionListComponent.RegisterComponent('actual-state')
@ActionListComponent.Template(module.getPath('./actual-state.xml'))
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



export = ReduxPage;