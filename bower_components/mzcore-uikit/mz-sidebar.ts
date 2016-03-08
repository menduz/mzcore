mz.loadCss(module.getPath('./uikit.css'));

export function activatePlugin() { }

var sidebarList: MzSidebar[] = [];

@MzSidebar.RegisterComponent("mz-sidebar")
@MzSidebar.ConfigureUnwrapped
@MzSidebar.Template('<nav />', ':root')
export class MzSidebar extends mz.Widget {

    private backdrop: JQuery;

    @mz.MVCObject.proxy
    width: number;

    @mz.MVCObject.proxy
    panel: string;

    @MzSidebar.Attribute
    opened: boolean;

    constructor(rootNode: HTMLElement, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a, b, scope) {
        if (!('opened' in attr))
            attr['opened'] = false;

        this.backdrop = $('<div class="mz-fit" style="z-index:99990;">');

        super(rootNode, attr, children, a, b, scope);
 
        this.width = parseFloat(attr['width'] || 256);

        this.DOM.css({
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: this.width,
            transition: 'all .2s ease'
        });

        this.backdrop.on('mousedown touchstart', () => { this.opened = false });

        sidebarList.push(this);

        this.startComponent();
    }

    private opened_changed(visible: boolean) {
        if (visible) {
            this.backdrop.appendTo(this.DOM.parent());
            this.DOM.css({
                zIndex: 99999,
                transform: `translate3d(0, 0, 0)`,
                //opacity: 1,
                pointerEvents: 'auto'
            });
            if (this.panel) {
                $(this.panel).css({
                    transition: 'all .2s ease',
                    transform: `translate3d(${this.width}px, 0, 0)`
                });
            }
        } else {
            this.backdrop.detach();
            this.DOM.css({
                zIndex: 99999,
                transform: `translate3d(-${this.width}px, 0, 0)`,
                //opacity: 0,
                pointerEvents: 'none'
            });
            if (this.panel) {
                $(this.panel).css({
                    transition: 'all .2s ease',
                    transform: `translate3d(0, 0, 0)`
                });
            }
        }
    }

    width_changed(width: number) {
        this.DOM.css({
            width: width,
            transform: `translate3d(-${this.attr('visible') ? 0 : this.width}px, 0, 0)`
        });
    }
};

@mz.Widget.RegisterComponent('mz-sidebar-toggler')
@mz.Widget.ConfigureUnwrapped
@mz.Widget.Template('<button onclick="{this.toggle}" />', ':root')
export class MzSidebarToggler extends mz.Widget {
    toggle() {
        if (!sidebarList.length) return;
        
        // TODO: SEARCH BY ID
        let sidebar = sidebarList[sidebarList.length - 1];

        sidebar.opened = !sidebar.opened;
    }
}
