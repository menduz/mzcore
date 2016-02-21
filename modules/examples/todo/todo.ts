
let defaultState = [
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

@ToDo.Template(module.getPath("./todo.xml"))
class ToDo extends mz.app.Page {
    @ToDo.proxy
    elementCount: number = 0;

    @ToDo.proxy
    todoText: string = '';

    todoList = new mz.Collection<any>();

    // completed tasks list
    todoListCompleted = this.todoList.createView()
        .filter(x => x.Completed);
        
    // pending tasks list
    todoListPending = this.todoList.createView()
        .filter(x => !x.Completed);

    constructor(appController) {
        super(appController);

        this.todoList.on('changed', () => this.elementCount = this.todoList.length);

        this.todoList.addRange(defaultState);
    }

    newToDo(e: mz.IMZComponentEvent) {
        if (this.todoText && this.todoText.length) {
            this.todoList.push({
                Name: this.todoText,
                Date: new Date().toISOString(),
                Completed: false
            });
            this.todoText = null;
        }
        e.event.preventDefault();
    }

    updateTask(e: mz.IMZComponentEvent) {
        e.data.Completed = (e.element as HTMLInputElement).checked;
        this.todoList.update(e.data);
    }
}

export = ToDo;