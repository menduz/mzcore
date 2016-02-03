
/// <reference path="../view/Widget.ts" />
namespace mz.widgets {
    @mz.Widget.RegisterComponent("mz-switcher")
    export class MzSwitcher extends mz.Widget {

        @mz.MVCObject.proxy
        panelVisible: MzSwitcherPanel;

        panels = new mz.Collection<MzSwitcherPanel>();

        constructor(rootNode: Node, attr: mz.Dictionary<any>, children: mz.IChildWidget[], a, b, scope) {
            super(rootNode, attr, [], a, b, scope);

            var first: MzSwitcherPanel = null;
            // Set the parent panel to the children
            children.forEach(child => {
                if (child instanceof MzSwitcherPanel) {
                    first = first || child;
                    (<MzSwitcherPanel>child).parent = this;
                }
            });

            if (first)
                this.show(first);
        }

        show(panel: MzSwitcherPanel) {
            if (!panel) return;

            if (this.panelVisible === panel) return;

            if (!this.panels.contains(panel)) {
                this.panels.push(panel);
                panel.appendTo(this.contentNode);
                if (panel instanceof MzSwitcherPanel) {
                    panel.parent = this;
                }
            }

            if (this.panelVisible) {
                mz.core.dom.adapter.remove(this.panelVisible.rootNode);
            }

            this.panelVisible = panel;

            mz.core.dom.adapter.appendChild(this.contentNode, this.panelVisible.rootNode)

            this.panelVisible.show();

            panel.resize();
        }

        resize() {
            if (this.panelVisible) {
                this.panelVisible.resize();
            }
            super.resize();
        }
    }

    @mz.Widget.RegisterComponent("mz-switcher-panel")
    export class MzSwitcherPanel extends mz.Widget {
        parent: MzSwitcher;

        show() {
            if (this.parent)
                this.parent.show(this);
        }

        isVisible() {
            return this.DOM.is(':visible');
        }
    }
}