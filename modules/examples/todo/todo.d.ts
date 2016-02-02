import appController = require('bower_components/mz-appController/mz-appController-base');
declare class ToDo extends appController.Page {
    elementCount: number;
    todoText: string;
    todoList: mz.collection<any>;
    constructor(appController: any);
    newToDo(e: mz.IMZComponentEvent): void;
    taskFinished(e: mz.IMZComponentEvent): void;
}
export = ToDo;
