/// <reference path="../Widget.ts" />

@mz.AttributeDirective.Register("mz-raw")
class MzRawDirective extends mz.AttributeDirective {
    changed(val: string){
        (this.widget.contentNode as HTMLElement).innerHTML = val;
    }
}