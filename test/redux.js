/// <reference path="../dist/mz.d.ts" />
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
    var kreate_store = mz.globalContext.devToolsExtension ? mz.globalContext.devToolsExtension()(mz.redux.createStore) : mz.redux.createStore;
    exports.store = kreate_store(function (state, action) {
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
    }, /* initial state */ {
        ja: {
            valor: 'hola redux',
            list: [{ val: "a" }, { val: "b" }, { val: "c" }]
        }
    });
    var ReduxComponent = (function (_super) {
        __extends(ReduxComponent, _super);
        function ReduxComponent() {
            _super.apply(this, arguments);
        }
        ReduxComponent.prototype.inc = function () {
            exports.store.dispatch({ type: 'inc' });
        };
        ReduxComponent.prototype.dec = function () {
            exports.store.dispatch({ type: 'dec' });
        };
        ReduxComponent = __decorate([
            mz.redux.connectWidget(function (state) { return state.ja; }, exports.store),
            mz.Widget.Template("\n<div>\n    <button onclick=\"{this.inc}\">+</button>\n    <button onclick=\"{this.dec}\">-</button>\n    {scope.valor}\n    <mz-repeat list=\"{scope.list}\" tag=\"ul\">\n        <li>{scope.val}</li>\n    </mz-repeat>\n</div>"), 
            __metadata('design:paramtypes', [])
        ], ReduxComponent);
        return ReduxComponent;
    })(mz.widgets.BasePagelet);
    (new ReduxComponent()).appendTo("body");
});
//# sourceMappingURL=redux.js.map