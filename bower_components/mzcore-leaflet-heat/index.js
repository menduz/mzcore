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
define(["require", "exports", 'bower_components/mzcore-leaflet/index', 'bower_components/mzcore-leaflet/leaflet'], function (require, exports, index_1, L) {
    var heatRequest;
    mz.globalContext.L = L;
    var MzLeafletHeat = (function (_super) {
        __extends(MzLeafletHeat, _super);
        function MzLeafletHeat(a, b, c, d, e, f) {
            var _this = this;
            _super.call(this, a, b, c, d, e, f);
            if (!this.radius)
                this.radius = 30;
            heatRequest = heatRequest || $.getScript(module.getPath('./leaflet.heat.js'));
            heatRequest.then(function () {
                if (_this.ensureLayer())
                    _this.fill();
            });
        }
        MzLeafletHeat.prototype.ensureLayer = function () {
            if (!this.layer && ('heatLayer' in L) && this.isVisible) {
                try {
                    this.layer = L.heatLayer([], { radius: this.radius });
                }
                catch (E) { }
            }
            return !!this.layer;
        };
        MzLeafletHeat.prototype.radius_changed = function (val) {
            val = parseInt(val);
            if (val <= 0)
                throw mz.MVCObject.Exception_RollbackOperation;
            if (val > 200)
                throw mz.MVCObject.Exception_RollbackOperation;
            this.layer && this.layer.setOptions({
                radius: val
            });
            return val;
        };
        MzLeafletHeat.prototype.fill = function () {
            if (!this.isVisible)
                return;
            var result = this.list ? this.list.map(function (x) { return x.location; }) : [];
            if (result instanceof mz.Collection)
                result = result.toArray();
            this.ensureLayer() && this.layer.setLatLngs(result);
        };
        MzLeafletHeat.prototype.list_changed = function (list, prevList) {
            this.collectionListener && this.collectionListener.off();
            this.collectionListener = null;
            if (!list && this.layer) {
                this.fill();
                return;
            }
            if (list instanceof mz.Collection) {
                this.collectionListener = list.on('changed', this.fill.bind(this));
            }
            this.layer && this.fill();
        };
        MzLeafletHeat.prototype.visible_changed = function (visible, prev) {
            if (this.isVisible) {
                this.ensureLayer();
                this.fill();
            }
            return _super.prototype.visible_changed.call(this, visible, prev);
        };
        __decorate([
            MzLeafletHeat.proxy, 
            __metadata('design:type', Array)
        ], MzLeafletHeat.prototype, "list", void 0);
        __decorate([
            MzLeafletHeat.proxy, 
            __metadata('design:type', Number)
        ], MzLeafletHeat.prototype, "radius", void 0);
        __decorate([
            mz.core.decorators.screenDelayer, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], MzLeafletHeat.prototype, "fill", null);
        MzLeafletHeat = __decorate([
            MzLeafletHeat.ConfigureEmptyTag,
            MzLeafletHeat.RegisterComponent('mz-leaflet-heat'), 
            __metadata('design:paramtypes', [Object, Object, Object, Object, Object, Object])
        ], MzLeafletHeat);
        return MzLeafletHeat;
    })(index_1.MzLeafletLayer);
    exports.MzLeafletHeat = MzLeafletHeat;
});
//# sourceMappingURL=index.js.map