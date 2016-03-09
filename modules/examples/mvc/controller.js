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
define(["require", "exports", './model'], function (require, exports, model) {
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            _super.apply(this, arguments);
            this.userStore = userStore;
            this.currentUser = null;
        }
        Controller.prototype.createUser = function () {
            this.currentUser = this.userStore.create();
        };
        Controller.prototype.saveUser = function () {
            if (!this.currentUser || !this.currentUser.isModelValid) {
                this.touch('currentUser');
                return;
            }
            this.userStore.save(this.currentUser);
            this.currentUser = null;
        };
        Controller.prototype.selectUser = function (e) {
            if (this.userStore.contains(this.currentUser))
                this.userStore.save(this.currentUser);
            var user = e.data;
            this.currentUser = user;
        };
        __decorate([
            Controller.proxy, 
            __metadata('design:type', model.User)
        ], Controller.prototype, "currentUser", void 0);
        Controller = __decorate([
            Controller.Template(module.getPath("./view.xml")), 
            __metadata('design:paramtypes', [])
        ], Controller);
        return Controller;
    })(mz.app.Page);
    // user store, should be a database ^^
    var Users = (function (_super) {
        __extends(Users, _super);
        function Users() {
            _super.apply(this, arguments);
        }
        Users.prototype.save = function (user) {
            if (!user || !(user instanceof model.User) || !user.isModelValid)
                throw new Error("Invalid user");
            this.mergeElem(user);
        };
        Users.prototype.create = function () {
            return new model.User({ UserID: this.length + 1, Email: null, Name: null });
        };
        Users.prototype.delete = function (user) {
            this.remove(user);
        };
        return Users;
    })(mz.Collection);
    var userStore = new Users([
        new model.User({
            UserID: 1,
            Name: 'Agustin',
            Email: 'agustin.mz.92@gmail.com'
        }),
        new model.User({
            UserID: 2,
            Name: 'Juan',
            Email: 'juancazala@gmail.com'
        })
    ], { key: "UserID" });
    return Controller;
});
//# sourceMappingURL=controller.js.map