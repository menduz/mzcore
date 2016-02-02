import appController = require('bower_components/mz-appController/mz-appController-base');

class ToDo extends appController.Page {
    /// TODO:
    @mz.MVCObject.proxy
    elementCount: number = 0;

    @mz.MVCObject.proxy
    todoText: string = '';

    todoList = new mz.collection<any>();

    constructor(appController) {
        super(appController);

        this.loadTemplate(module.getPath("./todo.xml"));

        this.todoList.on('changed', () => this.elementCount = this.todoList.length);

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

    newToDo(e: mz.IMZComponentEvent) {
        if (this.todoText && this.todoText.length) {
            this.todoList.push({
                Name: this.todoText,
                Date: new Date().toISOString()
            });
            this.todoText = null;
        }
        e.event.preventDefault();
    }

    taskFinished(e: mz.IMZComponentEvent) {
        if (e.$element.is(":checked"))
            this.todoList.remove(e.data);
    }
}

export = ToDo;