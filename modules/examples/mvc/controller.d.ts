import * as model from './model';
declare class Controller extends mz.app.Page {
    userStore: Users;
    currentUser: model.User;
    createUser(): void;
    saveUser(): void;
    selectUser(e: mz.IMZComponentEvent): void;
}
export declare class Users extends mz.Collection<model.User> {
    save(user: model.User): void;
    create(): model.User;
    delete(user: model.User): void;
}
export declare var userStore: Users;
export = Controller;
