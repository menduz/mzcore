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
define(["require", "exports", 'components/components'], function (require, exports, components) {
    var users = [{ Name: 'Agustin', Github: '@menduz' }, { Name: 'Juan', Github: '@cazala' }, { Name: 'BetaTester', Github: '@test' }];
    var Autocomplete = (function (_super) {
        __extends(Autocomplete, _super);
        function Autocomplete() {
            _super.apply(this, arguments);
            this.pre_setted_value = {
                Name: 'Agustin',
                Github: '@menduz'
            };
        }
        Autocomplete.prototype.searchUsers = function (text) {
            return Promise.resolve(users.filter(function (x) { return x.Name.contains(text && text.toLowerCase()); }));
        };
        __decorate([
            Autocomplete.proxy, 
            __metadata('design:type', Object)
        ], Autocomplete.prototype, "pre_setted_value", void 0);
        __decorate([
            Autocomplete.proxy, 
            __metadata('design:type', Object)
        ], Autocomplete.prototype, "empty_value", void 0);
        Autocomplete = __decorate([
            Autocomplete.Template(module.getPath("./uikit-autocomplete.xml")), 
            __metadata('design:paramtypes', [])
        ], Autocomplete);
        return Autocomplete;
    })(mz.app.Page);
    components.ensureComponents();
    return Autocomplete;
});
//# sourceMappingURL=uikit-autocomplete.js.map