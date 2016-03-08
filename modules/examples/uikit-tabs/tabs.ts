import { MzTab } from 'components/components';

@Tabs.Template(module.getPath("./tabs.xml"))
class Tabs extends mz.app.Page { 
    namedTab: MzTab;
    
    gotoNamedTab(){ this.namedTab.show(); }
}

export = Tabs;