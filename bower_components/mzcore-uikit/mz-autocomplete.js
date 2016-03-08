var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports"], function (require, exports) {
    var cssClass = 'mz-autocompletar';
    var cssClassOption = cssClass + '-opc';
    var cssClassHidden = cssClass + '-opc-hidden';
    var cssClassLoading = cssClass + '-loading';
    var cssClassClear = cssClass + '-clear';
    var cssClassOptionContainer = cssClass + '-opc-cont';
    var cssClassLoadingHolder = cssClass + '-loading-holder';
    var cssClassInput = cssClass + '-input';
    var MzAutocomplete = (function (_super) {
        __extends(MzAutocomplete, _super);
        function MzAutocomplete(a, b, c, d, e, f) {
            _super.call(this, a, {}, c, d, e, f);
            this.contentVisible = false;
            this.contentLoading = false;
            this.currentInputValue = '';
            this.dataList = [];
            this.selectedItemIndex = 0;
            this.selectedItem = {
                id: null,
                label: null
            };
            this.holderText = $("<div>");
            this.onNew = b.onNew || null;
            this.emptyLabel = b.emptyLabel || mz.translate('No se encontraron resultados');
            this.searchMethod = b.searchMethod || null;
            this.initAttr(b);
        }
        MzAutocomplete.prototype.onInputBlur = function () {
            this.renderValue();
            this.contentVisible = false;
        };
        MzAutocomplete.prototype.onInputKeyDown = function (evt) {
            var e = evt.event;
            switch (e.which) {
                case 38:
                    if (this.contentVisible)
                        this.selectPrev();
                    break;
                case 40:
                    if (this.contentVisible)
                        this.selectNext();
                    break;
                case 13:
                    if (this.contentVisible) {
                        this.chooseSelected();
                    }
                    e.stopPropagation();
                    break;
                case 27:
                    this.contentVisible = false;
                    this.renderValue();
                    break;
                default:
                    this.onChange(evt);
                    return;
            }
            e.preventDefault();
        };
        MzAutocomplete.prototype.onKeyUp = function (evt) {
            var e = evt.event;
            if (this.currentInputValue != this.input.DOM.val()) {
                $('>li', this.DOMContenedorOpciones.DOM).remove();
            }
            this.currentInputValue = this.input.DOM.val();
            switch (e.which) {
                case 13:
                    //this.focusNextField();
                    e.stopPropagation();
                    break;
                default: return;
            }
            e.preventDefault();
            this.onChange(evt);
        };
        MzAutocomplete.prototype.onChange = function (e) {
            if (e.element == document.activeElement) {
                this.buscarLista();
            }
        };
        MzAutocomplete.prototype.clear = function () {
            this.value = null;
            this.renderValue();
            this.focus();
        };
        MzAutocomplete.prototype.focus = function () {
            this.find('input')[0].focus();
        };
        MzAutocomplete.prototype.buscarLista = function () {
            var _this = this;
            this.contentLoading = true;
            var val = this.find('input')[0].value;
            if (val && val.length) {
                this.contentVisible = true;
                this.contentLoading = true;
            }
            this.searchMethod && this.searchMethod(val).then(function (datos) {
                _this.contentLoading = false;
                _this.handleData(datos);
                if (_this.find('input')[0] == document.activeElement) {
                    _this.contentVisible = true;
                }
                else {
                    _this.contentVisible = false;
                }
            }, function () {
                _this.contentLoading = false;
                _this.contentVisible = false;
            });
        };
        MzAutocomplete.prototype.selectItem = function (itemIndex, animateScroll) {
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
        };
        MzAutocomplete.prototype.selectNext = function () {
            if (this.selectedItemIndex < this.dataList.length - 1)
                this.selectItem(this.selectedItemIndex + 1, true);
            else
                this.selectItem(this.onNew ? -1 : 0, true);
        };
        MzAutocomplete.prototype.selectPrev = function () {
            if (this.selectedItemIndex > (this.onNew ? -1 : 0))
                this.selectItem(this.selectedItemIndex - 1, true);
            else
                this.selectItem(this.dataList.length - 1, true);
        };
        MzAutocomplete.prototype.chooseSelected = function () {
            this.contentVisible = false;
            if (this.selectedItemIndex == -1) {
                this.chooseNew();
                return;
            }
            try {
                this.selectedItem.id = this.dataList[this.selectedItemIndex] || null;
            }
            catch (e) {
                this.selectedItem.id = null;
            }
            this.value = this.selectedItem.id;
        };
        MzAutocomplete.prototype.generateItem = function (item, index) {
            var _this = this;
            var DOMItem = $("<li class=\"mz-autocompletar-opc " + (cssClassOption + '-' + index) + "\"></li>").data('internal-index', index);
            if (index != -1) {
                _super.prototype.generateScopedContent.call(this, item).forEach(function (x) { return x && DOMItem.append(x.rootNode); });
            }
            DOMItem.hover(function () {
                _this.selectItem(index, false);
            }, function () { return void 0; });
            DOMItem.mousedown(function (e) {
                _this.selectItem(index, false);
                _this.chooseSelected();
                e.preventDefault();
                return false;
            });
            return DOMItem;
        };
        //@mz.core.decorators.LogResult
        MzAutocomplete.prototype.renderValue = function () {
            this.input.DOM.val(this.selectedItem.label || '');
        };
        // internal iCampo's method. sets the value of the current field
        MzAutocomplete.prototype.value_changed = function (data) {
            console.info(data);
            var distinto = this.selectedItem.id !== data;
            this.selectedItem.id = data;
            if (this.selectedItem.id == null) {
                this.selectedItem.label = '';
                this.renderValue();
            }
            else {
                this.selectedItem.label = this.getItemText(this.value);
                console.log(this.selectedItem.id, this.selectedItem.label);
                this.renderValue();
            }
        };
        MzAutocomplete.prototype.getItemText = function (element) {
            var item = _super.prototype.generateScopedContent.call(this, element);
            $(">*", this.holderText).remove();
            this.holderText.append(item.map(function (x) { return x.rootNode; }));
            mz.dom.microqueue.flush();
            var ret = this.holderText.text().trim();
            item.forEach(function (x) { return x.unmount && x.unmount(); });
            return ret;
        };
        // "Add new item" handler
        MzAutocomplete.prototype.chooseNew = function () {
            var _this = this;
            this.onNew(function (data) {
                if (data) {
                    _this.selectedItemIndex = 0;
                    _this.dataList[_this.selectedItemIndex] = data;
                    _this.chooseSelected();
                }
                else {
                    _this.selectedItem.id = _this.value = null;
                }
            }, this.input.DOM.val());
        };
        // handles the feed data
        MzAutocomplete.prototype.handleData = function (data) {
            var _this = this;
            this.dataList = data || [];
            $('>li', this.DOMContenedorOpciones.DOM).remove();
            if (this.dataList.length) {
                var selectedItemIndex = null;
                this.dataList && this.dataList.forEach(function (elem, index) {
                    var item = _this.generateItem(elem, index);
                    if (elem == _this.value)
                        selectedItemIndex = index;
                    _this.DOMContenedorOpciones.append(item);
                });
                this.selectItem(0, false);
            }
            else {
                this.DOMContenedorOpciones.append($("<li class=\"mz-autocompletar-noitems\">" + this.emptyLabel + "</div>"));
            }
            if (this.onNew) {
                var elemCrearNuevo = this.generateItem(null, -1);
                elemCrearNuevo.html(this.onNewLabel).addClass("mz-autocompletar-additem");
                this.DOMContenedorOpciones.append(elemCrearNuevo);
                if (!this.dataList.length)
                    this.selectItem(-1, true);
            }
        };
        MzAutocomplete.maxHeight = 130;
        __decorate([
            MzAutocomplete.proxy, 
            __metadata('design:type', Boolean)
        ], MzAutocomplete.prototype, "contentVisible", void 0);
        __decorate([
            MzAutocomplete.proxy, 
            __metadata('design:type', Boolean)
        ], MzAutocomplete.prototype, "contentLoading", void 0);
        __decorate([
            MzAutocomplete.proxy, 
            __metadata('design:type', Number)
        ], MzAutocomplete.prototype, "maxHeight", void 0);
        __decorate([
            mz.core.decorators.delayer(500), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [Object]), 
            __metadata('design:returntype', void 0)
        ], MzAutocomplete.prototype, "onChange", null);
        MzAutocomplete = __decorate([
            MzAutocomplete.Template("\n<div class=\"" + cssClass + " {" + cssClassHidden + ": !this.contentVisible, " + cssClassLoading + ": this.contentLoading}\" name=\"elem\">\n    <button visible=\"{this.value != null}\" onclick=\"{this.clear}\" class=\"" + cssClassClear + "\" disabled=\"{disabled}\"></button>\n    <input \n        class=\"" + cssClassInput + "\"\n        type=\"search\" \n        name=\"input\" \n        disabled=\"{disabled}\"\n        required=\"{required}\" \n        placeholder=\"{placeholder}\"\n        onblur=\"{this.onInputBlur}\"\n        onkeydown=\"{this.onInputKeyDown}\"\n        onkeyup=\"{this.onKeyUp}\"\n        autocomplete=\"off\"\n    />\n    \n    <div class=\"" + cssClassOptionContainer + "\" style=\"max-height: {this.maxHeight ? this.maxHeight + 'px' : 'auto'}\" name=\"DOMContenedorOpciones\">\n        <div class=\"" + cssClassLoadingHolder + "\">\n            <div class=\"progress-container active infinite\">\n                <div class=\"progress-bit\" />\n            </div>\n        </div>\n    </div>\n</div>\n"),
            MzAutocomplete.ConfigureEmptyTag,
            MzAutocomplete.ConfigureUnwrapped,
            MzAutocomplete.RegisterComponent('mz-autocomplete'), 
            __metadata('design:paramtypes', [Object, Object, Object, Object, Object, Object])
        ], MzAutocomplete);
        return MzAutocomplete;
    })(mz.widgets.MzInput);
    exports.MzAutocomplete = MzAutocomplete;
});
//# sourceMappingURL=mz-autocomplete.js.map