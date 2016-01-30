/// <reference path="../Widget.ts" />

mz.Widget.registerDirective('mz-raw', (val, widget) => {
	widget.DOM.html(val);
});