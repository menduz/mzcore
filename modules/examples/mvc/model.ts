export class User extends mz.MVCObject {
    @User.proxy
    UserID: number;

    @User.proxy
    Name: string;

    @User.proxy
    Email: string;

    get isModelValid() {
        return this.UserID && this.Name && this.Name.length && this.Email && this.Email.isValidMail();
    }

    private Name_changed(newValue: string) {
        if (!newValue) return null;

        if (typeof newValue != "string")
            throw User.Exception_RollbackOperation;

        if (newValue.length > 10)
            throw User.Exception_RollbackOperation;

        return newValue.capitalize();
    }
}