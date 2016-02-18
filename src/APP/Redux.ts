/// <reference path="../VIEW/Widget.ts" />

namespace mz.redux {
    export interface IAppState {

    }

    export namespace ActionTypes {
        export var INIT = '@@redux/INIT';
    }

    export interface ActionCreator extends Function {
        (...args: any[]): any;
    }

    export interface Reducer extends Function {
        (state: any, action: any): any;
    }

    export interface Dispatch extends Function {
        (action: any): any;
    }

    export interface StoreMethods {
        dispatch: Dispatch;
        getState(): any;
    }


    export interface MiddlewareArg {
        dispatch: Dispatch;
        getState: Function;
    }

    export interface Middleware extends Function {
        (obj: MiddlewareArg): Function;
    }

    export interface IStore {
        replaceReducer(nextReducer: Reducer): void;
        dispatch(action: any): any;
        getState(): IAppState;
        subscribe(listener: Function): Function;
    }

    export function connectWidget(selector: (state) => any, store: IStore) {
        return function(target: Function) : void {

            if (!store)
                return console.error("redux store not fund");

            target.prototype.redux_selector = selector;
            target.prototype.redux_store = store;
            target.prototype.unsubscribe_redux = function() { }

            

            var componentInitialized = target.prototype.componentInitialized;
            
            target.prototype.componentInitialized = function() {
                var that = this;
            
                this.unsubscribe_redux = store.subscribe(function() {
                    try {
                        let newScope = selector(store.getState());
                        let oldScope = that.scope;

                        if ((!oldScope || !newScope) && oldScope != newScope || !shallowEqual(oldScope, newScope))
                            that.scope = newScope;
                    } catch (e) {
                        console.error(e);
                    }
                });
            
                try {
                    this.scope = selector(store.getState());
                } catch (e) {
                    console.error(e);
                }
            
                componentInitialized && componentInitialized.apply(this, arguments);
            }

            var unm = target.prototype.unmount;

            target.prototype.unmount = function() {
                this.unsubscribe_redux();
                unm && unm.apply(this, arguments);
            }
        }
    }

    export function wrapActionCreators(actionCreators) {
        return dispatch => bindActionCreators(actionCreators, dispatch)
    }

    export function shallowEqual(objA, objB) {
        if (objA === objB) {
            return true
        }

        const keysA = Object.keys(objA)
        const keysB = Object.keys(objB)

        if (keysA.length !== keysB.length) {
            return false
        }

        // Test for A's keys different from B.
        const hasOwn = Object.prototype.hasOwnProperty
        for (let i = 0; i < keysA.length; i++) {
            if (!hasOwn.call(objB, keysA[i]) ||
                objA[keysA[i]] !== objB[keysA[i]]) {
                return false
            }
        }

        return true
    }


    function bindActionCreator<T>(actionCreator: T, dispatch): T {
        return ((...args) => dispatch((actionCreator as any)(...args))) as any;
    }

    /**
     * Turns an object whose values are action creators, into an object with the
     * same keys, but with every function wrapped into a `dispatch` call so they
     * may be invoked directly. This is just a convenience method, as you can call
     * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
     *
     * For convenience, you can also pass a single function as the first argument,
     * and get a function in return.
     *
     * @param {Function|Object} actionCreators An object whose values are action
     * creator functions. One handy way to obtain it is to use ES6 `import * as`
     * syntax. You may also pass a single function.
     *
     * @param {Function} dispatch The `dispatch` function available on your Redux
     * store.
     *
     * @returns {Function|Object} The object mimicking the original object, but with
     * every action creator wrapped into the `dispatch` call. If you passed a
     * function as `actionCreators`, the return value will also be a single
     * function.
     */
    export function bindActionCreators<T>(actionCreators: T, dispatch: Dispatch): T {
        if (typeof actionCreators === 'function') {
            return bindActionCreator(actionCreators, dispatch)
        }

        if (typeof actionCreators !== 'object' || actionCreators === null) {
            throw new Error(
                `bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` +
                `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
            )
        }

        var keys = Object.keys(actionCreators)
        var boundActionCreators = {}
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            var actionCreator = actionCreators[key]
            if (typeof actionCreator === 'function') {
                boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
            }
        }
        return boundActionCreators as any;
    }
    
    
    /**
     * Creates a store enhancer that applies middleware to the dispatch method
     * of the Redux store. This is handy for a variety of tasks, such as expressing
     * asynchronous actions in a concise manner, or logging every action payload.
     *
     * See `redux-thunk` package as an example of the Redux middleware.
     *
     * Because middleware is potentially asynchronous, this should be the first
     * store enhancer in the composition chain.
     *
     * Note that each middleware will be given the `dispatch` and `getState` functions
     * as named arguments.
     *
     * @param {...Function} middlewares The middleware chain to be applied.
     * @returns {Function} A store enhancer applying the middleware.
     */
    export function applyMiddleware(...middlewares: Middleware[]): Function {
        return (CreateStore: typeof createStore) => (reducer, initialState, enhancer) => {
            var store = CreateStore(reducer, initialState, enhancer)
            var dispatch = store.dispatch
            var chain = []

            var middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => dispatch(action)
            }
            chain = middlewares.map(middleware => middleware(middlewareAPI))
            dispatch = compose(...chain)(store.dispatch)

            return mz.copy(store, {
                dispatch
            });
        }
    }
    
    /**
     * Composes single-argument functions from right to left. The rightmost
     * function can take multiple arguments as it provides the signature for
     * the resulting composite function.
     *
     * @param {...Function} funcs The functions to compose.
     * @returns {Function} A function obtained by composing the argument functions
     * from right to left. For example, compose(f, g, h) is identical to doing
     * (...args) => f(g(h(...args))).
     */

    export function compose<T extends Function>(...funcs: Function[]): T {
        return ((...args) => {
            if (funcs.length === 0) {
                return args[0]
            }

            const last = funcs[funcs.length - 1]
            const rest = funcs.slice(0, -1)

            return rest.reduceRight((composed, f) => f(composed), last(...args))
        }) as any;
    }

    export function createStore(reducer: Reducer, initialState?: any, enhancer?: (store: typeof createStore) => any): IStore {
        if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
            enhancer = initialState
            initialState = undefined
        }

        if (typeof enhancer !== 'undefined') {
            if (typeof enhancer !== 'function') {
                throw new Error('Expected the enhancer to be a function.')
            }

            return enhancer(createStore)(reducer, initialState)
        }

        if (typeof reducer !== 'function') {
            throw new Error('Expected the reducer to be a function.')
        }

        var currentReducer = reducer
        var currentState = initialState
        var currentListeners = []
        var nextListeners = currentListeners
        var isDispatching = false

        function ensureCanMutateNextListeners() {
            if (nextListeners === currentListeners) {
                nextListeners = currentListeners.slice()
            }
        }

        /**
         * Reads the state tree managed by the store.
         *
         * @returns {any} The current state tree of your application.
         */
        function getState() {
            return currentState
        }

        /**
         * Adds a change listener. It will be called any time an action is dispatched,
         * and some part of the state tree may potentially have changed. You may then
         * call `getState()` to read the current state tree inside the callback.
         *
         * You may call `dispatch()` from a change listener, with the following
         * caveats:
         *
         * 1. The subscriptions are snapshotted just before every `dispatch()` call.
         * If you subscribe or unsubscribe while the listeners are being invoked, this
         * will not have any effect on the `dispatch()` that is currently in progress.
         * However, the next `dispatch()` call, whether nested or not, will use a more
         * recent snapshot of the subscription list.
         *
         * 2. The listener should not expect to see all states changes, as the state
         * might have been updated multiple times during a nested `dispatch()` before
         * the listener is called. It is, however, guaranteed that all subscribers
         * registered before the `dispatch()` started will be called with the latest
         * state by the time it exits.
         *
         * @param {Function} listener A callback to be invoked on every dispatch.
         * @returns {Function} A function to remove this change listener.
         */
        function subscribe(listener) {
            if (typeof listener !== 'function') {
                throw new Error('Expected listener to be a function.')
            }

            var isSubscribed = true

            ensureCanMutateNextListeners()
            nextListeners.push(listener)

            return function unsubscribe() {
                if (!isSubscribed) {
                    return
                }

                isSubscribed = false

                ensureCanMutateNextListeners()
                var index = nextListeners.indexOf(listener)
                nextListeners.splice(index, 1)
            }
        }

        /**
         * Dispatches an action. It is the only way to trigger a state change.
         *
         * The `reducer` function, used to create the store, will be called with the
         * current state tree and the given `action`. Its return value will
         * be considered the **next** state of the tree, and the change listeners
         * will be notified.
         *
         * The base implementation only supports plain object actions. If you want to
         * dispatch a Promise, an Observable, a thunk, or something else, you need to
         * wrap your store creating function into the corresponding middleware. For
         * example, see the documentation for the `redux-thunk` package. Even the
         * middleware will eventually dispatch plain object actions using this method.
         *
         * @param {Object} action A plain object representing “what changed”. It is
         * a good idea to keep actions serializable so you can record and replay user
         * sessions, or use the time travelling `redux-devtools`. An action must have
         * a `type` property which may not be `undefined`. It is a good idea to use
         * string constants for action types.
         *
         * @returns {Object} For convenience, the same action object you dispatched.
         *
         * Note that, if you use a custom middleware, it may wrap `dispatch()` to
         * return something else (for example, a Promise you can await).
         */
        function dispatch(action) {
            if (typeof action.type === 'undefined') {
                throw new Error(
                    'Actions may not have an undefined "type" property. ' +
                    'Have you misspelled a constant?'
                )
            }

            if (isDispatching) {
                throw new Error('Reducers may not dispatch actions.')
            }

            try {
                isDispatching = true
                currentState = currentReducer(currentState, action)
            } finally {
                isDispatching = false
            }

            var listeners = currentListeners = nextListeners
            for (var i = 0; i < listeners.length; i++) {
                listeners[i]()
            }

            return action
        }

        /**
         * Replaces the reducer currently used by the store to calculate the state.
         *
         * You might need this if your app implements code splitting and you want to
         * load some of the reducers dynamically. You might also need this if you
         * implement a hot reloading mechanism for Redux.
         *
         * @param {Function} nextReducer The reducer for the store to use instead.
         * @returns {void}
         */
        function replaceReducer(nextReducer) {
            if (typeof nextReducer !== 'function') {
                throw new Error('Expected the nextReducer to be a function.')
            }

            currentReducer = nextReducer
            dispatch({ type: ActionTypes.INIT })
        }

        // When a store is created, an "INIT" action is dispatched so that every
        // reducer returns their initial state. This effectively populates
        // the initial state tree.
        dispatch({ type: ActionTypes.INIT })

        return {
            dispatch,
            subscribe,
            getState,
            replaceReducer
        }
    }

    function getUndefinedStateErrorMessage(key, action) {
        var actionType = action && action.type
        var actionName = actionType && `"${actionType.toString()}"` || 'an action'

        return (
            `Given action ${actionName}, reducer "${key}" returned undefined. ` +
            `To ignore an action, you must explicitly return the previous state.`
        )
    }

    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
        var reducerKeys = Object.keys(reducers)
        var argumentName = action && action.type === ActionTypes.INIT ?
            'initialState argument passed to createStore' :
            'previous state received by the reducer'

        if (reducerKeys.length === 0) {
            return (
                'Store does not have a valid reducer. Make sure the argument passed ' +
                'to combineReducers is an object whose values are reducers.'
            )
        }


        var unexpectedKeys = Object.keys(inputState).filter(key => !reducers.hasOwnProperty(key))

        if (unexpectedKeys.length > 0) {
            return (
                `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
                `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
                `Expected to find one of the known reducer keys instead: ` +
                `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
            )
        }
    }

    function assertReducerSanity(reducers) {
        Object.keys(reducers).forEach(key => {
            var reducer = reducers[key]
            var initialState = reducer(undefined, { type: ActionTypes.INIT })

            if (typeof initialState === 'undefined') {
                throw new Error(
                    `Reducer "${key}" returned undefined during initialization. ` +
                    `If the state passed to the reducer is undefined, you must ` +
                    `explicitly return the initial state. The initial state may ` +
                    `not be undefined.`
                )
            }

            var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
            if (typeof reducer(undefined, { type }) === 'undefined') {
                throw new Error(
                    `Reducer "${key}" returned undefined when probed with a random type. ` +
                    `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
                    `namespace. They are considered private. Instead, you must return the ` +
                    `current state for any unknown actions, unless it is undefined, ` +
                    `in which case you must return the initial state, regardless of the ` +
                    `action type. The initial state may not be undefined.`
                )
            }
        })
    }

    /**
     * Turns an object whose values are different reducer functions, into a single
     * reducer function. It will call every child reducer, and gather their results
     * into a single state object, whose keys correspond to the keys of the passed
     * reducer functions.
     *
     * @param {Object} reducers An object whose values correspond to different
     * reducer functions that need to be combined into one. One handy way to obtain
     * it is to use ES6 `import * as reducers` syntax. The reducers may never return
     * undefined for any action. Instead, they should return their initial state
     * if the state passed to them was undefined, and the current state for any
     * unrecognized action.
     *
     * @returns {Function} A reducer function that invokes every reducer inside the
     * passed object, and builds a state object with the same shape.
     */
    export function combineReducers(reducers: any): Reducer {
        var reducerKeys = Object.keys(reducers)
        var finalReducers = {}
        for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i]
            if (typeof reducers[key] === 'function') {
                finalReducers[key] = reducers[key]
            }
        }
        var finalReducerKeys = Object.keys(finalReducers)

        var sanityError
        try {
            assertReducerSanity(finalReducers)
        } catch (e) {
            sanityError = e
        }

        return function combination(state = {}, action) {
            if (sanityError) {
                throw sanityError
            }

            var hasChanged = false
            var nextState = {}
            for (var i = 0; i < finalReducerKeys.length; i++) {
                var key = finalReducerKeys[i]
                var reducer = finalReducers[key]
                var previousStateForKey = state[key]
                var nextStateForKey = reducer(previousStateForKey, action)
                if (typeof nextStateForKey === 'undefined') {
                    var errorMessage = getUndefinedStateErrorMessage(key, action)
                    throw new Error(errorMessage)
                }
                nextState[key] = nextStateForKey
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey
            }
            return hasChanged ? nextState : state
        }
    }

    function makeFilter(filter) {
        // function filter
        if (typeof filter === 'function')
            return filter;
            
        // object filter, match properties
        if (typeof filter === 'object')
            return function (data) {
                if (typeof data !== 'object')
                    return false;
                    
                for (var n in filter)
                    if (filter[n] !== data[n])
                        return false;
                        
                return true;
            }
        
        // value filter, equal data or equal type property
        return function (data) { 
            if (data && typeof data === 'object')
                return data.type === filter;
                
            return data === filter; 
        };
    }
    
    export interface Manager {
        when: (filter: Object | Function | String, fn: Reducer) => Manager,
        otherwise: (fn: Reducer) => Manager,
        use: (fn: Reducer) => Manager,
    }
    
    // https://github.com/ajlopez/ReduMan
    export function createManager(): Reducer & Manager {
        var steps = [];
        var owfn = null;

        let when = function (filter: Object | Function | String, fn: Reducer) {
            steps.push({ filter: makeFilter(filter), fn: fn });
            return reducer;
        }
        
        let otherwise = function (fn: Reducer) {
            owfn = fn;
            return reducer;
        }
        
        let use = function (fn: Reducer) {
            steps.push({ fn: fn });
            return reducer;
        }

        var reducer : Reducer & Manager = function (state: any, data: any) {
            var l = steps.length;
            var currentState = state;
            var processed = false;
            
            for (var k = 0; k < l; k++) {
                var step = steps[k];
                
                if (!step.filter || step.filter(data)) {
                    var newState = step.fn(currentState, data);
                    
                    if (newState !== currentState)
                        processed = true;
                        
                    currentState = newState;
                }
            }
            
            if (owfn && !processed)
                return owfn(currentState, data);
            
            return currentState;
        } as any;

        reducer.when = when;
        
        reducer.otherwise = otherwise;
        
        reducer.use = use;
        
        return reducer;
    }
}