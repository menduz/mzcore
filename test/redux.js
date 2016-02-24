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
    var manager = mz.redux.createManager();
    manager.when('inc', function (state, action) {
        return mz.copy({}, state, {
            ja: {
                valor: mz.intval(state.ja.valor) + 1,
                list: [{ val: "a" }, { val: "aaaaaa" }, { val: "c" }]
            },
            valor: mz.intval(state.valor) + 1
        });
    });
    manager.when('dec', function (state, action) {
        return mz.copy({}, state, {
            ja: {
                valor: mz.intval(state.ja.valor) - 1,
                list: [{ val: "a" }, { val: "dddd" }]
            },
            valor: mz.intval(state.valor) + 1
        });
    });
    exports.store = kreate_store(manager, /* initial state */ {
        ja: {
            valor: 'hola redux',
            list: [{ val: "a" }, { val: "b" }, { val: "c" }]
        },
        valor: 0
    });
    var ReduxComponent = (function (_super) {
        __extends(ReduxComponent, _super);
        function ReduxComponent() {
            _super.apply(this, arguments);
            this.count = 0;
        }
        ReduxComponent.prototype.inc = function () {
            exports.store.dispatch({ type: 'inc' });
        };
        ReduxComponent.prototype.dec = function () {
            exports.store.dispatch({ type: 'dec' });
        };
        ReduxComponent.prototype.updateVal = function () {
            this.val = !this.val;
        };
        ReduxComponent.prototype.testCaller = function () {
            this.count++;
            return ' called-' + this.count;
        };
        ReduxComponent.prototype.componentInitialized = function () {
            var _this = this;
            console.error('ReduxComponent.componentInitialized');
            setInterval(function () {
                _this.count = 0;
                _this.val = !_this.val;
                console.log(_this.count, ' Updates');
            }, 3000);
        };
        __decorate([
            ReduxComponent.proxy, 
            __metadata('design:type', Boolean)
        ], ReduxComponent.prototype, "val", void 0);
        ReduxComponent = __decorate([
            mz.redux.connectWidget(function (state) { return state.ja; }, exports.store),
            mz.Widget.Template("\n<div>Mensajes:\n    <button onclick=\"{this.inc}\">+</button>\n    <button onclick=\"{this.dec}\">-</button>\n    {scope.valor}\n    <mz-repeat list=\"{scope.list}\" tag=\"ul\">\n        <li class=\"{this.testCaller().toString() + (this.val ? ' par' : ' inpar') + this.val}\" onclick=\"{this.updateVal}\">{scope.val}</li>\n        {scope.val}\n    </mz-repeat>\n</div>"), 
            __metadata('design:paramtypes', [])
        ], ReduxComponent);
        return ReduxComponent;
    })(mz.widgets.BasePagelet);
    (new ReduxComponent()).appendTo("body");
    // store.subscribe(listener)
    var ReduxComponent2 = (function (_super) {
        __extends(ReduxComponent2, _super);
        function ReduxComponent2() {
            _super.apply(this, arguments);
        }
        __decorate([
            ReduxComponent2.proxy, 
            __metadata('design:type', Number)
        ], ReduxComponent2.prototype, "scope", void 0);
        ReduxComponent2 = __decorate([
            mz.redux.connectWidget(function (state) { return state.valor; }, exports.store),
            mz.Widget.Template("\n<div style=\"color: {red: scope % 2 == 1, green: scope % 2 == 0}\">\n    Cantidad mensajes: {scope}\n</div>"), 
            __metadata('design:paramtypes', [])
        ], ReduxComponent2);
        return ReduxComponent2;
    })(mz.widgets.BasePagelet);
    (new ReduxComponent2()).appendTo("body");
});
//# sourceMappingURL=redux.js.map