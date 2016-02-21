@Flex.Template(module.getPath("./flex.xml"))
class Flex extends mz.app.Page {
    @Flex.proxy
    second: number = 0;
    
    componentInitialized(){
        setInterval(() => {
            this.second = new Date().getSeconds()
        }, 900);
    }
}

export = Flex;