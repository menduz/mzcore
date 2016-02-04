
@mz.Widget.Template(`<div>sarasa</div>`)
class Main extends mz.app.Page {
    constructor(a){
        super(a);
        this.loadTemplate(module.getPath('./index.xml'));
        
        
        setInterval(() => this.now = mz.now(), 1000);
    }
    
    @mz.MVCObject.proxy
    now;
}

export = Main;