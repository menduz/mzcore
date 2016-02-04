declare class ToDo extends mz.app.Page {
    elementCount: number;
    todoText: string;
    todoList: mz.Collection<any>;
    constructor(appController: any);
    newToDo(e: mz.IMZComponentEvent): void;
    taskFinished(e: mz.IMZComponentEvent): void;
}
export = ToDo;
