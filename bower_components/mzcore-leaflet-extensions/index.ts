import { MzLeafletLayer } from 'bower_components/mzcore-leaflet/index';
import * as L from 'bower_components/mzcore-leaflet/leaflet';

interface LocalizableItem {
    location: L.LatLngExpression;
    markerOptions: L.MarkerOptions;
}

@MzLeafletMarkerGroup.ConfigureEmptyTag
@MzLeafletMarkerGroup.RegisterComponent('mz-leaflet-marker-group')
export class MzLeafletMarkerGroup extends MzLeafletLayer {
    layer: L.LayerGroup<L.Marker>;

    @MzLeafletMarkerGroup.proxy
    list: mz.IForEachable<LocalizableItem>;

    collectionKey: symbol | string;

    @MzLeafletMarkerGroup.proxy
    markerOptions: L.MarkerOptions;

    @MzLeafletMarkerGroup.proxy
    markerConstructor: typeof L.marker;

    constructor(a, b, c, d, e, f) {
        super(a, {}, c, d, e, f);
        this.collectionKey = Symbol("mz-leaflet-marker-group-" + mz.genUID());
        this.layer = L.layerGroup<L.Marker>();
        this.markerConstructor = L.marker;
        this.initAttr(b);
    }

    handleCollectionChanged(change, a, b) {
        if (change == mz.Collection.EVENTS.BeforeClearCollection || change == mz.Collection.EVENTS.AfterClearCollection) {
            this.cleanMarkers(this.list);
            return;
        } else if (change == "refresh" || change == mz.Collection.EVENTS.CollectionSorted) {
            this.refresh();
            return;
        } else if (change == mz.Collection.EVENTS.ElementInserted || change == mz.Collection.EVENTS.ElementChanged) {
            this.ponerMarker(b);
            return;
        } else if (change == mz.Collection.EVENTS.ElementRemoved && b && b[this.collectionKey]) {
            this.unmountMarker(b);
            return;
        } else if (change == mz.Collection.EVENTS.ElementRangeInserted) {
            this.fill();
            return;
        }


        this.refresh();
    }

    collectionListener: mz.EventDispatcherBinding;

    list_changed(list, prevList) {
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
            this.collectionListener.sharedList.push(list.on(mz.Collection.EVENTS.BeforeClearCollection, () => this.cleanMarkers(list)));
            this.fill();
        } else if (list instanceof Array) {
            this.fill();
        }
    }

    refresh() {
        if (!this.list) return;
    }

    private ponerMarker(item: LocalizableItem) {
        let marker: L.Marker;

        if (this.collectionKey in item && item[this.collectionKey] instanceof L.Marker) {
            marker = item[this.collectionKey];

            if (marker && !item.location) {
                this.unmountMarker(item);
                return;
            } else if (marker) {
                marker.setLatLng(item.location);
            }
        } else {
            if (item.location) {
                marker = item[this.collectionKey] = this.getMarkerFromPool(item.location, mz.copy({}, this.markerOptions, item.markerOptions));
            }
        }

        if (marker && !this.layer.hasLayer(marker))
            this.layer.addLayer(marker);
    }

    private markerPool: L.Marker[] = [];

    private getMarkerFromPool(latLng, options?: L.MarkerOptions) {
        if (this.markerPool.length) {
            let marker = this.markerPool.pop();

            marker.setLatLng(latLng);

            if (options) {
                options.icon && marker.setIcon(options.icon);
                ('opacity' in options) && marker.setOpacity(options.opacity);
                options.zIndexOffset && marker.setZIndexOffset(options.zIndexOffset);
            }

            return marker;

        }
        return this.markerConstructor(latLng, options)
    }

    private unmountMarker(item) {
        let marker = item[this.collectionKey];
        if (marker) {
            delete item[this.collectionKey];
            
            this.markerPool.push(marker);

            try {
                this.layer.removeLayer(marker);
            } catch (E) { }
        }
    }

    private cleanMarkers(list: mz.IForEachable<LocalizableItem>) {
        this.layer.clearLayers();
        list.forEach(this.unmountMarker.bind(this));
    }

    private fill() {
        if (this.list) {
            this.list.forEach(this.ponerMarker.bind(this))
        }
    }
}


