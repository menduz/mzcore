/// <reference path="../VIEW/Widget.ts" />

namespace uikit {
    var flexStyles = new mz.css.Stylesheet();
    
    flexStyles.disable();

    flexStyles.set('.mz-fit', {
        'position': 'absolute',
        'top': '0',
        'bottom': '0',
        'left': '0',
        'right': '0'
    });

    flexStyles.set('.mz-flex-row', {
        'display': 'flex',
        '-webkit-flex-wrap': 'wrap',
        '-ms-flex-wrap': 'wrap',
        'flex-wrap': 'wrap',
        'width': '100%',
        '-webkit-box-sizing': 'border-box',
        '-moz-box-sizing': 'border-box',
        'box-sizing': 'border-box'
    });

    flexStyles.set('.mz-flex-col', {
        '-webkit-box-flex': '1',
        '-webkit-flex': '1',
        '-moz-box-flex': '1',
        '-moz-flex': '1',
        '-ms-flex': '1',
        'flex': '1',
        'display': 'flex',
        'width': '100%',
        '-webkit-box-sizing': 'border-box',
        '-moz-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        '-webkit-flex-direction': 'column',
        'flex-direction': 'column',
        'position': 'relative'
    })

    flexStyles.set('.mz-flex-cell', {
        '-webkit-flex': 'auto',
        '-moz-box-flex': 'auto',
        '-moz-flex': 'auto',
        '-ms-flex': '1 1 auto',
        'flex': 'auto'
    });
    
    flexStyles.enable();



    @mz.Widget.RegisterComponent("fit")
    @mz.Widget.Template(`<div class="mz-fit" />`, ':root')
    @mz.Widget.ConfigureUnwrapped
    export class Fit extends mz.Widget {
        class_changed() {
            this.rootNode.classList.add('mz-fit');
        }
    }

    @mz.Widget.RegisterComponent("clear")
    export class Clear extends mz.Widget {
        constructor(n, attr: mz.Dictionary<any>, a, b, c) {
            attr["tag"] = "div";
            super(n, attr, a, b, c);
            this.DOM.addClass("clear");
        }
    }

    @mz.Widget.RegisterComponent("flex-col")
    @mz.Widget.Template(`<div class="mz-flex-col" />`, ':root')
    @mz.Widget.ConfigureUnwrapped
    export class FlexCol extends mz.Widget {
        @mz.core.decorators.screenDelayer
        style_changed() {
            this.set('col-width', this.get('col-width'));
        }

        @mz.core.decorators.screenDelayer
        class_changed() {
            this.DOM.addClass('mz-flex-col');
        }

        ['col-width_changed'](width) {
            width = ('' + width).trim();
            width = width.match(/^\d+$/) ? width + '%' : width;
            let elem = (<any>this.rootNode);
            elem.style.webkitBoxFlex = '0';
            elem.style.webkitFlex = '0 0 ' + width;
            elem.style.mozBoxFlex = '0';
            elem.style.mozFlex = '0 0 ' + width;
            elem.style.msFlex = '0 0 ' + width;
            elem.style.flex = '0 0 ' + width;
            elem.style.maxWidth = width;
        }
    }

    @mz.Widget.RegisterComponent("flex-container")
    @mz.Widget.Template(`<div class="mz-flex-row" />`, ':root')
    @mz.Widget.ConfigureUnwrapped
    export class FlexContainer extends mz.Widget {
        @mz.core.decorators.screenDelayer
        class_changed() {
            this.DOM.addClass('mz-flex-row');
        }
    }

    @mz.Widget.RegisterComponent("flex-row")
    @mz.Widget.Template(`<div class="mz-flex-row" />`, ':root')
    @mz.Widget.ConfigureUnwrapped
    export class FlexRow extends mz.Widget {
        @mz.core.decorators.screenDelayer
        class_changed() {
            this.DOM.addClass('mz-flex-row');
        }
    }

    @mz.Widget.RegisterComponent("flex-cell")
    @mz.Widget.Template(`<div class="mz-flex-cell" />`, ':root')
    @mz.Widget.ConfigureUnwrapped
    export class FlexCell extends mz.Widget {
        @mz.core.decorators.screenDelayer
        class_changed() {
            this.DOM.addClass('mz-flex-cell');
        }
    }
}