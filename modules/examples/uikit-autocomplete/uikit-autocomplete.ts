import * as components from 'components/components';


var users = [{ Name: 'Agustin', Github: '@menduz' }, { Name: 'Juan', Github: '@cazala' }, { Name: 'BetaTester', Github: '@test' }]


@Autocomplete.Template(module.getPath("./uikit-autocomplete.xml"))
class Autocomplete extends mz.app.Page {

    @Autocomplete.proxy
    pre_setted_value = {
        Name: 'Agustin',
        Github: '@menduz'
    }

    @Autocomplete.proxy
    empty_value;

    searchUsers(text: string) {

        return Promise.resolve(
            users.filter(
                x => x.Name.contains(text && text.toLowerCase())
            )
        );
    }
}

components.ensureComponents();

export = Autocomplete;