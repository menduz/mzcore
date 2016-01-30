namespace mz {

    export var HIDDEN_PROP = (function getHiddenProp() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];

        if (typeof document == "undefined") return null;

        // if 'hidden' is natively supported just return it
        if ('hidden' in document) return 'hidden';

        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Hidden') in document)
                return prefixes[i] + 'Hidden';
        }

        // otherwise it's not supported
        return null;
    })();

    export var hiddenProp = HIDDEN_PROP;

    var tmp: HTMLElement;
    if (typeof document != "undefined")
        tmp = document.createElement("div");

    export var TRANSFORM_STYLE = (function getTransformTag() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];

        if (!tmp) return null;

        if ('transform' in tmp.style) return 'transform';

        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Transform') in tmp.style)
                return prefixes[i] + 'Transform';
        }

        return null;
    })();

    export var TRANSFORM_CSS = (function getTransformTag() {
        var prefixes = ['webkit', 'moz', 'ms', 'o', 'Webkit'];

        if (!tmp) return null;

        if ('transform' in tmp.style) return 'transform';

        for (var i = 0; i < prefixes.length; i++) {
            if ((prefixes[i] + 'Transform') in tmp.style)
                return '-' + prefixes[i] + '-transform';
        }

        return null;
    })();

}