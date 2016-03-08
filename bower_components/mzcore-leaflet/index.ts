import * as leaflet from './leaflet';

export var L = leaflet;

L.Icon.Default.imagePath = module.getPath('./images');

mz.loadCss(module.getPath('./leaflet.css'))

@MzLeaflet.ConfigureUnwrapped
@MzLeaflet.RegisterComponent('mz-leaflet')
export class MzLeaflet extends mz.Widget {
    map: leaflet.Map;

    @MzLeaflet.proxy
    zoom: number;

    zoom_changed(val, prev) {
        val = parseInt(val);
        if (val < 1) return 1;
        if (val > 18) return 18;
        if (val === prev) throw mz.MVCObject.Exception_PreventPropagation;
    }

    @MzLeaflet.proxy
    center: leaflet.LatLng;

    baseControl: leaflet.IControl;

    center_changed(val, prevVal) {
        if (!val) throw mz.MVCObject.Exception_RollbackOperation;

        if (!(val instanceof leaflet.LatLng)) {
            if (val instanceof Array && val.length == 2) {
                val = leaflet.latLng(val[0], val[1]);
            } else if (typeof val === "object" && 'lat' in val && 'lng' in val) {
                val = leaflet.latLng(val.lat, val.lng);
            }
        }

        if (val) {
            this.map && this.map.panTo(val);
        }

        return val;
    }


    layerCollection: mz.Collection<MzLeafletLayer>;

    constructor(originalNode, attr, children, _params, _parentComponent_, scope) {
        attr['center'] = attr['center'] || leaflet.latLng(parseFloat(attr['lat']) || -34.5818542, parseFloat(attr['lng']) || -58.50875);
        attr['zoom'] = parseInt(attr['zoom']) || 12;

        super(originalNode, attr, children, _params, _parentComponent_, scope);

        this.layerCollection = new mz.Collection<MzLeafletLayer>();

        this.map = L.map(this.rootNode as any, mz.copy({}, attr));

        this.layerCollection.on(mz.Collection.EVENTS.ElementInserted, (index, element) => element.parentMap = this.map);
        this.layerCollection.on(mz.Collection.EVENTS.ElementRemoved, (index, element) => element.parentMap = null);

        this.listening.push(this.on('zoom_changed', (val) => {
            this.map.setZoom(val);
        }));

        setTimeout(() => this.resize(), 100);

        for (var layerIndex = 0; layerIndex < children.length; layerIndex++) {
            var layer = children[layerIndex];
            if (layer instanceof MzLeafletLayer) {
                this.layerCollection.push(layer);
            }
        }
    }


    @mz.core.decorators.screenDelayer
    refresh() {
        this.map.invalidateSize(true);
    }

    resize() {
        super.resize();
        this.refresh();
    }
}

@MzLeaflet.ConfigureUnwrapped
export class MzLeafletLayer extends mz.Widget {
    @MzLeafletLayer.proxy
    layer: leaflet.ILayer;

    @MzLeafletLayer.proxy
    parentMap: leaflet.Map;

    @MzLeafletLayer.Attribute
    protected visible: boolean;

    insertAtTheBottom: boolean;

    visible_changed(visible, prev) {
        if (!visible && this.parentMap) {
            try {
                this.parentMap.removeLayer(this.layer);
            } catch (E) { }
        }
        if (visible && this.parentMap) {
            this.parentMap.addLayer(this.layer, this.insertAtTheBottom)
        }
    }

    get isVisible() {
        return this.visible || this.visible == undefined;
    }

    layer_changed(newLayer: leaflet.ILayer, prevLayer: leaflet.ILayer) {
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
            } catch (E) { }
        }

        if (this.layer && this.parentMap && this.isVisible) {
            this.parentMap.addLayer(this.layer, this.insertAtTheBottom)
        }
    }

    parentMap_changed(map, prevMap) {
        if (!this.layer) return;
        if (map === prevMap) throw mz.MVCObject.Exception_PreventPropagation;
        if (prevMap) {
            prevMap.removeLayer(this.layer);
        }
        if (!prevMap && map && this.isVisible) {
            map.addLayer(this.layer, this.insertAtTheBottom);
        }
    }
}


@MzLeafletTileLayer.ConfigureEmptyTag
@MzLeafletTileLayer.RegisterComponent('mz-leaflet-tile-layer')
export class MzLeafletTileLayer extends MzLeafletLayer {
    layer: leaflet.TileLayer;

    @MzLeafletTileLayer.proxy
    src: string;

    constructor(a, b, c, d, e, f) {
        super(a, b, c, d, e, f);
        this.layer = leaflet.tileLayer(b.src || 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', b.options || {});
    }
    
    src_changed(val){
        if(val && this.layer){
            this.layer.setUrl(val);
        }
    }
}