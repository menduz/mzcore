declare class Autocomplete extends mz.app.Page {
    pre_setted_value: {
        Name: string;
        Github: string;
    };
    empty_value: any;
    searchUsers(text: string): Promise<{
        Name: string;
        Github: string;
    }[]>;
}
export = Autocomplete;
