var cssClass = 'mz-autocompletar';
var cssClassOption = cssClass + '-opc';
var cssClassHidden = cssClass + '-opc-hidden';
var cssClassLoading = cssClass + '-loading';
var cssClassClear = cssClass + '-clear';
var cssClassOptionContainer = cssClass + '-opc-cont';
var cssClassLoadingHolder = cssClass + '-loading-holder';

@MzAutocomplete.Template(`
<div class="${cssClass} {${cssClassHidden}: !this.contentVisible, ${cssClassLoading}: this.contentLoading}" name="elem">
    <button visible="{this.value != null}" onclick="{this.clear}" class="${cssClassClear}">X</button>
    <input 
        type="search" 
        name="input" 
        disabled="{disabled}"
        required="{required}" 
        placeholder="{placeholder}"
        onblur="{this.onInputBlur}"
        onkeydown="{this.onInputKeyDown}"
        onkeyup="{this.onKeyUp}"
        autocomplete="off"
    />
    
    <div class="${cssClassOptionContainer}" style="max-height: {this.maxHeight ? this.maxHeight + 'px' : 'auto'}" name="DOMContenedorOpciones">
        <div class="${cssClassLoadingHolder}">
            <div class="progress-container active infinite">
                <div class="progress-bit" />
            </div>
        </div>
    </div>
</div>
`)
@MzAutocomplete.ConfigureEmptyTag
@MzAutocomplete.ConfigureUnwrapped
@MzAutocomplete.RegisterComponent('mz-autocomplete')
export class MzAutocomplete extends mz.widgets.MzInput {
    @MzAutocomplete.proxy
    contentVisible: boolean = false;

    @MzAutocomplete.proxy
    contentLoading: boolean = false;

    private static maxHeight = 130;

    currentInputValue = 0;


    //elem: mz.Widget;

    input: mz.Widget;

    DOMContenedorOpciones: mz.Widget;

    origen: (filtro: string) => Promise<Array<any>>;

    dataList = [];

    onNewLabel: string;
    emptyLabel: string;
    onNew: (fillData: (x: any) => void, searchedText: string) => void;

    @MzAutocomplete.proxy
    maxHeight: number;

    onInputBlur() {
        this.renderValue();
        this.contentVisible = false;
    }

    onInputKeyDown(evt: mz.IMZComponentEvent) {
        let e = evt.event as KeyboardEvent;
        switch (e.which) {
            case 38: // up
                if (this.contentVisible)
                    this.selectPrev();
                break;

            case 40: // down
                if (this.contentVisible)
                    this.selectNext();
                break;

            case 13: // enter
                if (this.contentVisible) {
                    this.chooseSelected();
                }

                e.stopPropagation();

                break;

            case 27: // escape
                this.contentVisible = false;
                this.renderValue();
                break;

            default:
                this.onChange(evt);
                return;
        }
        e.preventDefault();
    }

    onKeyUp(evt: mz.IMZComponentEvent) {
        let e = evt.event as KeyboardEvent;


        if (this.currentInputValue != this.input.DOM.val()) {
            $('>li', this.DOMContenedorOpciones.DOM).remove();
        }
        this.currentInputValue = this.input.DOM.val();
        switch (e.which) {
            case 13: // enter
                //this.focusNextField();
                e.stopPropagation();
                break;
            default: return;
        }
        e.preventDefault();

        this.onChange(evt);
    }

    @mz.core.decorators.delayer(500)
    onChange(e: mz.IMZComponentEvent) {
        if (e.element == document.activeElement) {
            this.buscarLista();
        }
    }

    constructor(a, b, c, d, e, f) {
        super(a, b, c, d, e, f);

        this.onNew = b.onNew || null;

        this.emptyLabel = b.emptyLabel || ñ('No se encontraron resultados');

        this.origen = b.origen || null;
    }

    private clear() {
        this.value = null;

        this.renderValue();
        this.focus();
    }


    focus() {
        (this.find('input')[0] as HTMLElement).focus();
    }
    buscarLista() {
        this.contentLoading = true;
        var val = (this.find('input')[0] as HTMLInputElement).value;

        if (val && val.length) {
            this.contentVisible = true;
            this.contentLoading = true;
        }

        this.origen && this.origen(val).then(
            (datos) => {
                this.contentLoading = false;

                this.handleData(datos);

                if ((this.find('input')[0] as HTMLElement) == document.activeElement) {
                    this.contentVisible = true;
                } else {
                    this.contentVisible = false;
                }
            },
            () => {
                this.contentLoading = false;
                this.contentVisible = false;
            }
        );

    }

    private selectedItemIndex = 0;

    private selectedItem = {
        id: null,
        label: null
    };

    private selectItem(itemIndex: number, animateScroll: boolean) {
        this.selectedItemIndex = itemIndex;

        $(">li.active", this.DOMContenedorOpciones.DOM).removeClass("active");
        var elem = $("." + cssClassOption + '-' + itemIndex, this.DOMContenedorOpciones.DOM).addClass("active");

        if (animateScroll) {
            var top = elem.position().top + elem.outerHeight();

            /*this.DOMContenedorOpciones.animate({
                scrollTop: top
            }, 200)*/

            var elTop, elBottom, nodeScrollTop, nodeHeight;

            elTop = elem.position().top;
            elBottom = elTop + elem.outerHeight(true);
            nodeScrollTop = this.DOMContenedorOpciones.DOM.scrollTop();
            nodeHeight = this.DOMContenedorOpciones.DOM.height() +
                parseInt(this.DOMContenedorOpciones.DOM.css('paddingTop'), 10) +
                parseInt(this.DOMContenedorOpciones.DOM.css('paddingBottom'), 10);

            if (elTop < 0) {
                this.DOMContenedorOpciones.DOM.scrollTop(nodeScrollTop + elTop);
            }

            else if (nodeHeight < elBottom) {
                this.DOMContenedorOpciones.DOM.scrollTop(nodeScrollTop + (elBottom - nodeHeight));
            }
        }
    }

    private selectNext() {
        if (this.selectedItemIndex < this.dataList.length - 1)
            this.selectItem(this.selectedItemIndex + 1, true);
        else
            this.selectItem(this.onNew ? -1 : 0, true);
    }

    private selectPrev() {
        if (this.selectedItemIndex > (this.onNew ? -1 : 0))
            this.selectItem(this.selectedItemIndex - 1, true);
        else
            this.selectItem(this.dataList.length - 1, true);
    }

    private chooseSelected() {
        this.contentVisible = false;


        if (this.selectedItemIndex == -1) {
            this.chooseNew();
            return;
        }

        try {
            this.selectedItem.id = this.dataList[this.selectedItemIndex] || null;
        } catch (e) {
            this.selectedItem.id = null;
        }

        this.value = this.selectedItem.id;
    }

    private generateItem(item, index: number) {
        var DOMItem = $(`<li class="mz-autocompletar-opc ${cssClassOption + '-' + index}"></li>`).data('internal-index', index);

        if (index != -1) {
            super.generateScopedContent(item).forEach(x => x && DOMItem.append(x.rootNode as HTMLElement));
        }

        DOMItem.hover(() => {
            this.selectItem(index, false);
        }, () => void 0);

        DOMItem.mousedown((e) => {
            this.selectItem(index, false);
            this.chooseSelected();

            e.preventDefault();
            return false;
        });

        return DOMItem;
    }

    //@mz.core.decorators.LogResult
    private renderValue() {
        this.input.DOM.val(this.selectedItem.label || '');
    }


    // internal iCampo's method. sets the value of the current field
    value_changed(data) {
        console.info(data);
        var distinto = this.selectedItem.id !== data;

        this.selectedItem.id = data;

        if (this.selectedItem.id == null) {
            this.selectedItem.label = '';
            this.renderValue();
        } else {
            this.selectedItem.label = this.getItemText(this.value);
            console.log(this.selectedItem.id, this.selectedItem.label);
            this.renderValue();
        }
    }

    private holderText = $("<div>");

    private getItemText(element) {
        let item: any[] = super.generateScopedContent(element);

        $(">*", this.holderText).remove();

        this.holderText.append(item.map(x => x.rootNode));
        mz.dom.microqueue.flush();

        let ret = this.holderText.text().trim();

        item.forEach(x => x.unmount && x.unmount())

        return ret;
    }


    // "Add new item" handler
    chooseNew() {
        this.onNew((data) => {
            if (data) {
                this.selectedItemIndex = 0;
                this.dataList[this.selectedItemIndex] = data;
                this.chooseSelected();
            } else {
                this.selectedItem.id = this.value = null;
            }
        }, this.input.DOM.val());
    }

    // handles the feed data
    handleData(data: any[]) {
        this.dataList = data || [];

        $('>li', this.DOMContenedorOpciones.DOM).remove();

        if (this.dataList.length) {
            var selectedItemIndex = null;

            this.dataList && this.dataList.forEach((elem, index) => {
                var item = this.generateItem(elem, index);

                if (elem == this.value)
                    selectedItemIndex = index;

                this.DOMContenedorOpciones.append(item);
            });

            this.selectItem(0, false);
        } else {
            this.DOMContenedorOpciones.append($(`<li class="mz-autocompletar-noitems">${this.emptyLabel}</div>`));
        }

        if (this.onNew) {
            var elemCrearNuevo = this.generateItem(null, -1);

            elemCrearNuevo.html(this.onNewLabel).addClass("mz-autocompletar-additem");

            this.DOMContenedorOpciones.append(elemCrearNuevo);

            if (!this.dataList.length) this.selectItem(-1, true);
        }
    }
}