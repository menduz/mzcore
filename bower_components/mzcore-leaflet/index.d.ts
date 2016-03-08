import * as leaflet from './leaflet';
export declare var L: typeof leaflet;
export declare class MzLeaflet extends mz.Widget {
    map: leaflet.Map;
    zoom: number;
    zoom_changed(val: any, prev: any): number;
    center: leaflet.LatLng;
    baseControl: leaflet.IControl;
    center_changed(val: any, prevVal: any): any;
    layerCollection: mz.Collection<MzLeafletLayer>;
    constructor(originalNode: any, attr: any, children: any, _params: any, _parentComponent_: any, scope: any);
    refresh(): void;
    resize(): void;
}
export declare class MzLeafletLayer extends mz.Widget {
    layer: leaflet.ILayer;
    parentMap: leaflet.Map;
    protected visible: boolean;
    insertAtTheBottom: boolean;
    visible_changed(visible: any, prev: any): void;
    isVisible: boolean;
    layer_changed(newLayer: leaflet.ILayer, prevLayer: leaflet.ILayer): void;
    parentMap_changed(map: any, prevMap: any): void;
}
export declare class MzLeafletTileLayer extends MzLeafletLayer {
    layer: leaflet.TileLayer;
    src: string;
    constructor(a: any, b: any, c: any, d: any, e: any, f: any);
    src_changed(val: any): void;
}
