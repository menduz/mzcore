import * as model from './model';

@Controller.Template(module.getPath("./view.xml"))
class Controller extends mz.app.Page {
    userStore = userStore;

    @Controller.proxy
    currentUser: model.User = null;

    createUser() {
        this.currentUser = this.userStore.create();
    }

    saveUser() {
        if (!this.currentUser || !this.currentUser.isModelValid) {
            this.touch('currentUser');
            return;
        }
        this.userStore.save(this.currentUser);
        this.currentUser = null;
    }

    selectUser(e: mz.IMZComponentEvent) {
        if (this.userStore.contains(this.currentUser))
            this.userStore.save(this.currentUser);

        let user: model.User = e.data;
        this.currentUser = user;
    }
}









// user store, should be a database ^^
class Users extends mz.Collection<model.User> {
    save(user: model.User) {
        if (!user || !(user instanceof model.User) || !user.isModelValid)
            throw new Error("Invalid user");

        this.mergeElem(user);
    }

    create(): model.User {
        return new model.User({ UserID: this.length + 1, Email: null, Name: null });
    }

    delete(user: model.User) {
        this.remove(user);
    }
}

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

export = Controller;