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
define(["require", "exports", './leaflet'], function (require, exports, leaflet) {
    exports.L = leaflet;
    exports.L.Icon.Default.imagePath = module.getPath('./images');
    mz.loadCss(module.getPath('./leaflet.css'));
    var MzLeaflet = (function (_super) {
        __extends(MzLeaflet, _super);
        function MzLeaflet(originalNode, attr, children, _params, _parentComponent_, scope) {
            var _this = this;
            attr['center'] = attr['center'] || leaflet.latLng(parseFloat(attr['lat']) || -34.5818542, parseFloat(attr['lng']) || -58.50875);
            attr['zoom'] = parseInt(attr['zoom']) || 12;
            _super.call(this, originalNode, attr, children, _params, _parentComponent_, scope);
            this.layerCollection = new mz.Collection();
            this.map = exports.L.map(this.rootNode, mz.copy({}, attr));
            this.layerCollection.on(mz.Collection.EVENTS.ElementInserted, function (index, element) { return element.parentMap = _this.map; });
            this.layerCollection.on(mz.Collection.EVENTS.ElementRemoved, function (index, element) { return element.parentMap = null; });
            this.listening.push(this.on('zoom_changed', function (val) {
                _this.map.setZoom(val);
            }));
            setTimeout(function () { return _this.resize(); }, 100);
            for (var layerIndex = 0; layerIndex < children.length; layerIndex++) {
                var layer = children[layerIndex];
                if (layer instanceof MzLeafletLayer) {
                    this.layerCollection.push(layer);
                }
            }
        }
        MzLeaflet.prototype.zoom_changed = function (val, prev) {
            val = parseInt(val);
            if (val < 1)
                return 1;
            if (val > 18)
                return 18;
            if (val === prev)
                throw mz.MVCObject.Exception_PreventPropagation;
        };
        MzLeaflet.prototype.center_changed = function (val, prevVal) {
            if (!val)
                throw mz.MVCObject.Exception_RollbackOperation;
            if (!(val instanceof leaflet.LatLng)) {
                if (val instanceof Array && val.length == 2) {
                    val = leaflet.latLng(val[0], val[1]);
                }
                else if (typeof val === "object" && 'lat' in val && 'lng' in val) {
                    val = leaflet.latLng(val.lat, val.lng);
                }
            }
            if (val) {
                this.map && this.map.panTo(val);
            }
            return val;
        };
        MzLeaflet.prototype.refresh = function () {
            this.map.invalidateSize(true);
        };
        MzLeaflet.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.refresh();
        };
        __decorate([
            MzLeaflet.proxy, 
            __metadata('design:type', Number)
        ], MzLeaflet.prototype, "zoom", void 0);
        __decorate([
            MzLeaflet.proxy, 
            __metadata('design:type', leaflet.LatLng)
        ], MzLeaflet.prototype, "center", void 0);
        __decorate([
            mz.core.decorators.screenDelayer, 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', []), 
            __metadata('design:returntype', void 0)
        ], MzLeaflet.prototype, "refresh", null);
        MzLeaflet = __decorate([
            MzLeaflet.ConfigureUnwrapped,
            MzLeaflet.RegisterComponent('mz-leaflet'), 
            __metadata('design:paramtypes', [Object, Object, Object, Object, Object, Object])
        ], MzLeaflet);
        return MzLeaflet;
    })(mz.Widget);
    exports.MzLeaflet = MzLeaflet;
    var MzLeafletLayer = (function (_super) {
        __extends(MzLeafletLayer, _super);
        function MzLeafletLayer() {
            _super.apply(this, arguments);
        }
        MzLeafletLayer.prototype.visible_changed = function (visible, prev) {
            if (!visible && this.parentMap) {
                try {
                    this.parentMap.removeLayer(this.layer);
                }
                catch (E) { }
            }
            if (visible && this.parentMap) {
                this.parentMap.addLayer(this.layer, this.insertAtTheBottom);
            }
        };
        Object.defineProperty(MzLeafletLayer.prototype, "isVisible", {
            get: function () {
                return this.visible || this.visible == undefined;
            },
            enumerable: true,
            configurable: true
        });
        MzLeafletLayer.prototype.layer_changed = function (newLayer, prevLayer) {
            // only allow valid layerable objects
            if (newLayer && !('onAdd' in newLayer && 'onRemove' in newLayer)) {
                console.error('Invalid layer setted. Operation rolled-back', newLayer);
                throw mz.MVCObject.Exception_RollbackOperation;
            }
            if (newLayer === prevLayer)
                throw mz.MVCObject.Exception_PreventPropagation;
            if (prevLayer && this.parentMap && this.isVisible) {
                try {
                    this.parentMap.removeLayer(prevLayer);
                }
                catch (E) { }
            }
            if (this.layer && this.parentMap && this.isVisible) {
                this.parentMap.addLayer(this.layer, this.insertAtTheBottom);
            }
        };
        MzLeafletLayer.prototype.parentMap_changed = function (map, prevMap) {
            if (!this.layer)
                return;
            if (map === prevMap)
                throw mz.MVCObject.Exception_PreventPropagation;
            if (prevMap) {
                prevMap.removeLayer(this.layer);
            }
            if (!prevMap && map && this.isVisible) {
                map.addLayer(this.layer, this.insertAtTheBottom);
            }
        };
        __decorate([
            MzLeafletLayer.proxy, 
            __metadata('design:type', Object)
        ], MzLeafletLayer.prototype, "layer", void 0);
        __decorate([
            MzLeafletLayer.proxy, 
            __metadata('design:type', leaflet.Map)
        ], MzLeafletLayer.prototype, "parentMap", void 0);
        __decorate([
            MzLeafletLayer.Attribute, 
            __metadata('design:type', Boolean)
        ], MzLeafletLayer.prototype, "visible", void 0);
        MzLeafletLayer = __decorate([
            MzLeaflet.ConfigureUnwrapped, 
            __metadata('design:paramtypes', [])
        ], MzLeafletLayer);
        return MzLeafletLayer;
    })(mz.Widget);
    exports.MzLeafletLayer = MzLeafletLayer;
    var MzLeafletTileLayer = (function (_super) {
        __extends(MzLeafletTileLayer, _super);
        function MzLeafletTileLayer(a, b, c, d, e, f) {
            _super.call(this, a, b, c, d, e, f);
            this.layer = leaflet.tileLayer(b.src || 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', b.options || {});
        }
        MzLeafletTileLayer.prototype.src_changed = function (val) {
            if (val && this.layer) {
                this.layer.setUrl(val);
            }
        };
        __decorate([
            MzLeafletTileLayer.proxy, 
            __metadata('design:type', String)
        ], MzLeafletTileLayer.prototype, "src", void 0);
        MzLeafletTileLayer = __decorate([
            MzLeafletTileLayer.ConfigureEmptyTag,
            MzLeafletTileLayer.RegisterComponent('mz-leaflet-tile-layer'), 
            __metadata('design:paramtypes', [Object, Object, Object, Object, Object, Object])
        ], MzLeafletTileLayer);
        return MzLeafletTileLayer;
    })(MzLeafletLayer);
    exports.MzLeafletTileLayer = MzLeafletTileLayer;
});
//# sourceMappingURL=index.js.map