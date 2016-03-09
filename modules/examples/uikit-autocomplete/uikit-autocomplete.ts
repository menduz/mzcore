var users = [
    { Name: 'Agustin', Github: '@menduz' },
    { Name: 'Juan', Github: '@cazala' },
    { Name: 'BetaTester', Github: '@test' }
];


@AutocompleteDemo.Template(module.getPath("./uikit-autocomplete.xml"))
class AutocompleteDemo extends mz.app.Page {

    @AutocompleteDemo.proxy
    pre_setted_value = {
        Name: 'Agustin',
        Github: '@menduz'
    }

    @AutocompleteDemo.proxy
    empty_value;

    searchUsers(text: string) {

        return Promise.resolve(
            users.filter(
                x => x.Name.contains(text && text.toLowerCase())
            )
        );
    }
}

export = AutocompleteDemo;