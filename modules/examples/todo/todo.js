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
    var ToDo = (function (_super) {
        __extends(ToDo, _super);
        function ToDo(appController) {
            var _this = this;
            _super.call(this, appController);
            /// TODO:
            this.elementCount = 0;
            this.todoText = '';
            this.todoList = new mz.Collection();
            this.loadTemplate(module.getPath("./todo.xml"));
            this.todoList.on('changed', function () { return _this.elementCount = _this.todoList.length; });
            this.todoList.addRange([
                {
                    Name: 'Example task..',
                    Date: new Date().toISOString()
                }, {
                    Name: 'Another task',
                    Date: new Date().toISOString()
                }, {
                    Name: 'Remember the milk',
                    Date: new Date().toISOString()
                }, {
                    Name: 'Learn Typescript',
                    Date: new Date().toISOString()
                }
            ]);
        }
        ToDo.prototype.newToDo = function (e) {
            if (this.todoText && this.todoText.length) {
                this.todoList.push({
                    Name: this.todoText,
                    Date: new Date().toISOString()
                });
                this.todoText = null;
            }
            e.event.preventDefault();
        };
        ToDo.prototype.taskFinished = function (e) {
            if (e.$element.is(":checked"))
                this.todoList.remove(e.data);
        };
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', Number)
        ], ToDo.prototype, "elementCount", void 0);
        __decorate([
            mz.MVCObject.proxy, 
            __metadata('design:type', String)
        ], ToDo.prototype, "todoText", void 0);
        return ToDo;
    })(mz.app.Page);
    return ToDo;
});
//# sourceMappingURL=todo.js.map