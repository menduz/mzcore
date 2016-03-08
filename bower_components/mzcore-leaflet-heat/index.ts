import { MzLeafletLayer } from 'bower_components/mzcore-leaflet/index';
import * as L from 'bower_components/mzcore-leaflet/leaflet';

interface LocalizableItem {
    location: L.LatLngExpression;
}

let heatRequest: JQueryXHR;

mz.globalContext.L = L;

@MzLeafletHeat.ConfigureEmptyTag
@MzLeafletHeat.RegisterComponent('mz-leaflet-heat')
export class MzLeafletHeat extends MzLeafletLayer {
    layer: any;

    @MzLeafletHeat.proxy
    list: Array<LocalizableItem>;
    
    collectionListener: mz.EventDispatcherBinding;

    @MzLeafletHeat.proxy
    radius: number;

    constructor(a, b, c, d, e, f) {
        super(a, b, c, d, e, f);
        if (!this.radius) this.radius = 30;
        heatRequest = heatRequest || $.getScript(module.getPath('./leaflet.heat.js'));
        heatRequest.then(() => {
            if (this.ensureLayer())
                this.fill();
        })
    }

    ensureLayer() {
        if (!this.layer && ('heatLayer' in L) && this.isVisible) {
            try {
                this.layer = (L as any).heatLayer([], { radius: this.radius });
            } catch (E) { }
        }
        return !!this.layer;
    }

    radius_changed(val) {
        val = parseInt(val);
        if (val <= 0) throw mz.MVCObject.Exception_RollbackOperation;
        if (val > 200) throw mz.MVCObject.Exception_RollbackOperation;
        this.layer && this.layer.setOptions({
            radius: val
        })
        return val;
    }

    @mz.core.decorators.screenDelayer
    fill() {
        if (!this.isVisible) return;

        let result: any = this.list ? this.list.map(x => x.location) : [];

        if (result instanceof mz.Collection) result = result.toArray();

        this.ensureLayer() && this.layer.setLatLngs(result);
    }

    

    list_changed(list, prevList) {

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
    }

    visible_changed(visible, prev) {
        if (this.isVisible) {
            this.ensureLayer();
            this.fill();
        }
        return super.visible_changed(visible, prev);
    }
}


