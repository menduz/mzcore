var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports"], function (require, exports) {
    // INITIAL STATE
    var initialState = {
        counter: 0,
        actionList: []
    };
    // ACTIONS
    var INCREMENT = 'inc';
    var DECREMENT = 'dec';
    function createIncrementAction() {
        return { type: INCREMENT };
    }
    function createDecrementAction() {
        return { type: DECREMENT };
    }
    // STORE AND REDUCER
    var store = createStore(function (state, action) {
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
    var ActionListComponent = (function (_super) {
        __extends(ActionListComponent, _super);
        function ActionListComponent() {
            _super.apply(this, arguments);
        }
        ActionListComponent = __decorate([
            ActionListComponent.RegisterComponent('action-list'),
            mz.redux.connectWidget(function (state) { return state.actionList; }, store),
            ActionListComponent.Template("\n<div>\n    <h1>Action history</h1>\n    <mz-repeat list=\"{scope}\" tag=\"ul\">\n        <li>{scope.type}</li>\n    </mz-repeat>\n</div>\n"),
            ActionListComponent.ConfigureUnwrapped, 
            __metadata('design:paramtypes', [])
        ], ActionListComponent);
        return ActionListComponent;
    })(mz.Widget);
    // COMPONENT <actual-state />, RENDERS THE ACTUAL STATE
    var ActualStateComponent = (function (_super) {
        __extends(ActualStateComponent, _super);
        function ActualStateComponent() {
            _super.apply(this, arguments);
        }
        ActualStateComponent = __decorate([
            ActionListComponent.RegisterComponent('actual-state'),
            mz.redux.connectWidget(function (state) { return state; }, store),
            ActionListComponent.Template("\n<div>\n    <h1>Actual state</h1>\n    <pre>{JSON.stringify(scope, null, 2)}</pre>\n</div>\n"),
            ActionListComponent.ConfigureUnwrapped, 
            __metadata('design:paramtypes', [])
        ], ActualStateComponent);
        return ActualStateComponent;
    })(mz.Widget);
    // MAIN PAGE
    // First we connect the widget to our state's branch
    var ReduxPage = (function (_super) {
        __extends(ReduxPage, _super);
        function ReduxPage() {
            _super.apply(this, arguments);
        }
        ReduxPage.prototype.inc = function () {
            store.dispatch(createIncrementAction());
        };
        ReduxPage.prototype.dec = function () {
            store.dispatch(createDecrementAction());
        };
        ReduxPage = __decorate([
            mz.redux.connectWidget(function (state) { return state.counter; }, store),
            ReduxPage.Template(module.getPath('./inc-dec.xml')), 
            __metadata('design:paramtypes', [])
        ], ReduxPage);
        return ReduxPage;
    })(mz.app.Page);
    // HELPERS
    function cloneArray(array) {
        var newArray = new Array(array && array.length || 0);
        array && array.forEach(function (item, index) { return newArray[index] = item; });
        return newArray;
    }
    function cloneArrayAndPush(array, element) {
        var newArray = cloneArray(array);
        newArray.push(element);
        return newArray;
    }
    return ReduxPage;
});
//# sourceMappingURL=inc-dec.js.map