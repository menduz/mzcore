declare class ToDo extends mz.app.Page {
    elementCount: number;
    todoText: string;
    todoList: mz.Collection<any>;
    todoListCompleted: mz.CollectionView<any>;
    todoListPending: mz.CollectionView<any>;
    constructor(appController: any);
    newToDo(e: mz.IMZComponentEvent): void;
    updateTask(e: mz.IMZComponentEvent): void;
}
export = ToDo;
