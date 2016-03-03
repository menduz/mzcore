/// <reference path="../view/Widget.ts" />

module mz.widgets {
    const localCssRe = /(:local)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))?([^,{]*)/gim; // http://regexper.com/

    function transformCssLocal(cssText: string, parentSelector: string) {
        return cssText.replace(localCssRe, function() {
            return parentSelector + ' ' + (arguments[2] || '') + (arguments[3] || '');
        } as any);
    }

    @StyleComponent.RegisterComponent('style')
    @StyleComponent.Template(`
<mz-style hidden="hidden" aria-hidden="true" style="display:none;">
    <link rel="stylesheet" name="link" />
    <mz-style-content />
</mz-style>
`, 'mz-style-content')
    @StyleComponent.ConfigureUnwrapped
    class StyleComponent extends mz.Widget {


        parent_selector: string;

        link: mz.Widget;

        observer: MutationObserver;

        constructor(root, attr, children, params, parent, scope) {
            super(root, attr, children, params, parent, scope);
            this.listening.push(parent.on('id_changed', (val) => {
                this.parent_selector = val;
                this.update();
            }))

            if ('MutationObserver' in mz.globalContext) {
                this.observer = new MutationObserver(() => {
                    this.update();
                });
                // have the observer observe foo for changes in children
                this.observer.observe(this.contentNode, { childList: true, subtree: true, characterData: true });
            } else {
                this.listening.push(parent.on('valueChanged', () => this.update()));
            }

            if (this.parent_selector = parent.attr('id')) {
                this.update();
            } else {
                parent.attr('id', this.parent_selector = mz.getDOMID());
                this.update();
            }

            this.update = mz.screenDelayer(this.update, this);
        }

        @StyleComponent.proxy
        textValue: string;

        textValue_changed(val, prevVal) {
            if (val !== prevVal) {
                console.log('style updated', val);
                let urlCss = 'data:text/css;base64,' + btoa(val);
                this.link.attr('href', urlCss);
            }
        }

        update() {
            this.textValue = transformCssLocal((this.contentNode as HTMLElement).innerText, "#" + this.parent_selector);
        }
    }
}