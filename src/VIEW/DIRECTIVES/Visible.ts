/// <reference path="../Widget.ts" />

mz.Widget.registerDirective('mz-visible', (val, widget) => {
	if (val && CBool(val) && val !== "0" && val.toString().toLowerCase() != "false") {
		widget.DOM.removeClass('mz-hidden').removeAttr('aria-hidden').removeAttr(mz.HIDDEN_PROP);
	} else {
		widget.DOM.addClass('mz-hidden').attr('aria-hidden', "true").attr(mz.HIDDEN_PROP, mz.HIDDEN_PROP);
	}
});