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
    var User = (function (_super) {
        __extends(User, _super);
        function User() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(User.prototype, "isModelValid", {
            get: function () {
                return this.UserID && this.Name && this.Name.length && this.Email && this.Email.isValidMail();
            },
            enumerable: true,
            configurable: true
        });
        User.prototype.Name_changed = function (newValue) {
            if (!newValue)
                return null;
            if (typeof newValue != "string")
                throw User.Exception_RollbackOperation;
            if (newValue.length > 10)
                throw User.Exception_RollbackOperation;
            return newValue.capitalize();
        };
        __decorate([
            User.proxy, 
            __metadata('design:type', Number)
        ], User.prototype, "UserID", void 0);
        __decorate([
            User.proxy, 
            __metadata('design:type', String)
        ], User.prototype, "Name", void 0);
        __decorate([
            User.proxy, 
            __metadata('design:type', String)
        ], User.prototype, "Email", void 0);
        return User;
    })(mz.MVCObject);
    exports.User = User;
});
//# sourceMappingURL=model.js.map