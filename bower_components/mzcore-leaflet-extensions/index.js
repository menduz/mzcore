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
    var MzLeafletMarkerGroup = (function (_super) {
        __extends(MzLeafletMarkerGroup, _super);
        function MzLeafletMarkerGroup(a, b, c, d, e, f) {
            _super.call(this, a, {}, c, d, e, f);
            this.markerPool = [];
            this.collectionKey = Symbol("mz-leaflet-marker-group-" + mz.genUID());
            this.layer = L.layerGroup();
            this.markerConstructor = L.marker;
            this.initAttr(b);
        }
        MzLeafletMarkerGroup.prototype.handleCollectionChanged = function (change, a, b) {
            if (change == mz.Collection.EVENTS.BeforeClearCollection || change == mz.Collection.EVENTS.AfterClearCollection) {
                this.cleanMarkers(this.list);
                return;
            }
            else if (change == "refresh" || change == mz.Collection.EVENTS.CollectionSorted) {
                this.refresh();
                return;
            }
            else if (change == mz.Collection.EVENTS.ElementInserted || change == mz.Collection.EVENTS.ElementChanged) {
                this.ponerMarker(b);
                return;
            }
            else if (change == mz.Collection.EVENTS.ElementRemoved && b && b[this.collectionKey]) {
                this.unmountMarker(b);
                return;
            }
            else if (change == mz.Collection.EVENTS.ElementRangeInserted) {
                this.fill();
                return;
            }
            this.refresh();
        };
        MzLeafletMarkerGroup.prototype.list_changed = function (list, prevList) {
            var _this = this;
            if (list === prevList) {
                this.refresh();
                return;
            }
            if (prevList) {
                this.cleanMarkers(prevList);
            }
            this.collectionListener && this.collectionListener.off();
            if (list instanceof mz.Collection) {
                this.collectionListener = null;
                this.collectionListener = list.on('changed', this.handleCollectionChanged.bind(this));
                this.collectionListener.sharedList.push(list.on(mz.Collection.EVENTS.BeforeClearCollection, function () { return _this.cleanMarkers(list); }));
                this.fill();
            }
            else if (list instanceof Array) {
                this.fill();
            }
        };
        MzLeafletMarkerGroup.prototype.refresh = function () {
            if (!this.list)
                return;
        };
        MzLeafletMarkerGroup.prototype.ponerMarker = function (item) {
            var marker;
            if (this.collectionKey in item && item[this.collectionKey] instanceof L.Marker) {
                marker = item[this.collectionKey];
                if (marker && !item.location) {
                    this.unmountMarker(item);
                    return;
                }
                else if (marker) {
                    marker.setLatLng(item.location);
                }
            }
            else {
                if (item.location) {
                    marker = item[this.collectionKey] = this.getMarkerFromPool(item.location, mz.copy({}, this.markerOptions, item.markerOptions));
                }
            }
            if (marker && !this.layer.hasLayer(marker))
                this.layer.addLayer(marker);
        };
        MzLeafletMarkerGroup.prototype.getMarkerFromPool = function (latLng, options) {
            if (this.markerPool.length) {
                var marker = this.markerPool.pop();
                marker.setLatLng(latLng);
                if (options) {
                    options.icon && marker.setIcon(options.icon);
                    ('opacity' in options) && marker.setOpacity(options.opacity);
                    options.zIndexOffset && marker.setZIndexOffset(options.zIndexOffset);
                }
                return marker;
            }
            return this.markerConstructor(latLng, options);
        };
        MzLeafletMarkerGroup.prototype.unmountMarker = function (item) {
            var marker = item[this.collectionKey];
            if (marker) {
                delete item[this.collectionKey];
                this.markerPool.push(marker);
                try {
                    this.layer.removeLayer(marker);
                }
                catch (E) { }
            }
        };
        MzLeafletMarkerGroup.prototype.cleanMarkers = function (list) {
            this.layer.clearLayers();
            list.forEach(this.unmountMarker.bind(this));
        };
        MzLeafletMarkerGroup.prototype.fill = function () {
            if (this.list) {
                this.list.forEach(this.ponerMarker.bind(this));
            }
        };
        __decorate([
            MzLeafletMarkerGroup.proxy, 
            __metadata('design:type', Object)
        ], MzLeafletMarkerGroup.prototype, "list", void 0);
        __decorate([
            MzLeafletMarkerGroup.proxy, 
            __metadata('design:type', Object)
        ], MzLeafletMarkerGroup.prototype, "markerOptions", void 0);
        __decorate([
            MzLeafletMarkerGroup.proxy, 
            __metadata('design:type', Object)
        ], MzLeafletMarkerGroup.prototype, "markerConstructor", void 0);
        MzLeafletMarkerGroup = __decorate([
            MzLeafletMarkerGroup.ConfigureEmptyTag,
            MzLeafletMarkerGroup.RegisterComponent('mz-leaflet-marker-group'), 
            __metadata('design:paramtypes', [Object, Object, Object, Object, Object, Object])
        ], MzLeafletMarkerGroup);
        return MzLeafletMarkerGroup;
    })(index_1.MzLeafletLayer);
    exports.MzLeafletMarkerGroup = MzLeafletMarkerGroup;
});
//# sourceMappingURL=index.js.map