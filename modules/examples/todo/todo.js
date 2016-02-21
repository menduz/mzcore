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
    var defaultState = [
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
            Date: new Date().toISOString(),
            Completed: true
        }
    ];
    var ToDo = (function (_super) {
        __extends(ToDo, _super);
        function ToDo(appController) {
            var _this = this;
            _super.call(this, appController);
            this.elementCount = 0;
            this.todoText = '';
            this.todoList = new mz.Collection();
            // completed tasks list
            this.todoListCompleted = this.todoList.createView()
                .filter(function (x) { return x.Completed; });
            // pending tasks list
            this.todoListPending = this.todoList.createView()
                .filter(function (x) { return !x.Completed; });
            this.todoList.on('changed', function () { return _this.elementCount = _this.todoList.length; });
            this.todoList.addRange(defaultState);
        }
        ToDo.prototype.newToDo = function (e) {
            if (this.todoText && this.todoText.length) {
                this.todoList.push({
                    Name: this.todoText,
                    Date: new Date().toISOString(),
                    Completed: false
                });
                this.todoText = null;
            }
            e.event.preventDefault();
        };
        ToDo.prototype.updateTask = function (e) {
            e.data.Completed = e.element.checked;
            this.todoList.update(e.data);
        };
        __decorate([
            ToDo.proxy, 
            __metadata('design:type', Number)
        ], ToDo.prototype, "elementCount", void 0);
        __decorate([
            ToDo.proxy, 
            __metadata('design:type', String)
        ], ToDo.prototype, "todoText", void 0);
        ToDo = __decorate([
            ToDo.Template(module.getPath("./todo.xml")), 
            __metadata('design:paramtypes', [Object])
        ], ToDo);
        return ToDo;
    })(mz.app.Page);
    return ToDo;
});
//# sourceMappingURL=todo.js.map