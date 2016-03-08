@MzTab.RegisterComponent("mz-tab")
@MzTab.Template('<div class="mz-tab" />', ':root')
@MzTab.ConfigureUnwrapped
export class MzTab extends mz.widgets.MzSwitcherPanel {
    static EVENTS = mz.copy({ TabShown: 'tab_shown' }, mz.widgets.MzSwitcherPanel.EVENTS);
    
    parent: MzTaber;

    @MzTab.proxy
    label: string;

    @MzTab.Attribute
    visible: boolean;

    private visible_changed(visible) {
        requestAnimationFrame(() => {
            if (this.parent && this.parent.tabs) {
                this.parent.tabs.update(this);
            }
        });

        if (!visible && this.isVisible() && this.parent) {
            this.parent.show(this.parent.tabs.single(x => x !== this));
        }
    }

    constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a, b, scope) {
        attr['tag'] = 'div';

        if (!('label' in attr))
            throw new Error("MzTab must have 'label' attribute");

        if (!('visible' in attr) || attr['visible'] == undefined)
            attr['visible'] = true;

        super(rootNode, attr, children, a, b, scope);
    }
};

@mz.Widget.RegisterComponent("mz-taber")
@MzTaber.ConfigureUnwrapped
@MzTaber.Template(`
<div class="mz-taber">
    <div class="mz-taber-nav">
        <mz-repeat list="{this.tabs}" tag="ul" class="mz-taber-tab-list">
            <li onclick="{this.tabClicked}" class="mz-taber-tab {active: scope.isVisible()}">
                {scope.label}
            </li>
        </mz-repeat>
    </div>
    <div class="mz-taber-content" />
</div>
`, '.mz-taber-content')
export class MzTaber extends mz.widgets.MzSwitcher {
    @MzTaber.proxy
    tabs: mz.Collection<MzTab> = new mz.Collection<MzTab>();

    static EVENTS = mz.copy({ TabClicked: 'tab_clicked' }, mz.widgets.MzSwitcher.EVENTS);

    constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a, b, scope) {
        super(rootNode, attr, [], a, b, scope);

        children.forEach(child => {
            if (child instanceof MzTab) {
                this.tabs.push(child);
                child.parent = this;
                this.listening.push(child.on('valueChanged', () => this.tabs.update(child)));
            }
        });

        var firstTab = this.tabs.first();

        if (firstTab) {
            this.show(firstTab);
        }

        this.children = children;
    }

    show(tab: MzTab) {
        super.show(<mz.widgets.MzSwitcherPanel>tab);
        this.tabs && this.tabs.trigger('changed', 'refresh');
        (<mz.widgets.MzSwitcherPanel>tab).emit(MzTab.EVENTS.TabShown);
    }

    private tabClicked(ev: mz.IMZComponentEvent) {
        if (ev.data instanceof MzTab) {
            this.show(ev.data);
            this.emit(MzTaber.EVENTS.TabClicked, ev.data);
        }
    }
};