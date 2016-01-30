/// <reference path="../../mz.ts" />
/// <reference path="../Widget.ts" />

var symbol2wb = Symbol("mz-model-binding");

mz.Widget.registerDirective("mz-model", (value, widget, parent) => {
    var bindeo = widget[symbol2wb];

    if (value && !bindeo) {
        if (widget.rootNode.nodeName.toUpperCase() == 'INPUT' || widget.rootNode.nodeName.toUpperCase() == 'SELECT') {
            // detecto los cambios
            widget[symbol2wb] = widget.DOM.on('changed keyup paste lostfocus search', mz.delayer(() => {
                let actualVal = widget.DOM.val();
                if (actualVal != parent[value])
                    parent[value] = actualVal;
            }, 1));

            parent.on(value + "_changed", newVal => {
                let actualVal = widget.DOM.val();

                if (actualVal != newVal && (!newVal || newVal.toString() != actualVal))
                    widget.DOM.val(newVal)
            });
        }
    }
});
