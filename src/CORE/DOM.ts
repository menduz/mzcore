namespace mz.dom {
    export var adapter: mz.dom.AbstractDomAdapter;

    export function setRootDomAdapter(theAdapter: mz.dom.AbstractDomAdapter) {
        if (!adapter) {
            mz.scriptBase = theAdapter.getBaseHref() || '';
            adapter = theAdapter;
        }
    }



    export namespace microqueue {
        interface MicroQueueOpcode {
            type: MicroQueueOpKind;
            destination: any;
            parameters?: any;
        }

        enum MicroQueueOpKind {
            APPEND,
            DETACH,
            SET_TEXT,
            SET_ATTR
        }

        export var enabled = true;

        var theMicroQueue: MicroQueueOpcode[] = [];

        var lastSchedule = null;

        function executeQueue() {
            for (let i = 0; i < theMicroQueue.length; i++) {
                let q = theMicroQueue[i];
                switch (q.type) {
                    case MicroQueueOpKind.APPEND:
                        adapter.appendChild(q.destination, q.parameters);
                        break;
                    case MicroQueueOpKind.DETACH:
                        adapter.remove(q.destination);
                        break;
                    case MicroQueueOpKind.SET_TEXT:
                        if (q.destination.textContent != q.parameters)
                            adapter.setText(q.destination, q.parameters);
                        break;
                    case MicroQueueOpKind.SET_ATTR:
                        adapter.setAttribute(q.destination, q.parameters[0], q.parameters[1]);
                        break;
                }
            }
            theMicroQueue.length = 0;
            lastSchedule = null;
        }

        function scheduleMicroqueue() {
            lastSchedule = lastSchedule || globalContext.setImmediate && globalContext.setImmediate(executeQueue) || requestAnimationFrame(executeQueue);
        }

        export function appendChild(el, node) {
            if (!enabled) { adapter.appendChild(el, node); return; }
            theMicroQueue.push({
                type: MicroQueueOpKind.APPEND,
                destination: el,
                parameters: node
            });
            scheduleMicroqueue();
        }

        export function remove(el) {
            if (!enabled) { adapter.remove(el); return; }
            theMicroQueue.push({
                type: MicroQueueOpKind.DETACH,
                destination: el
            });
            scheduleMicroqueue();
        }

        export function setText(el, text: string) {
            if (!enabled) { adapter.setText(el, text); return; }
            theMicroQueue.push({
                type: MicroQueueOpKind.SET_TEXT,
                destination: el,
                parameters: text
            });
            scheduleMicroqueue();
        }

        export function setAttribute(el, attr: string, value: string) {
            if (!enabled) { adapter.setAttribute(el, attr, value); return; }
            theMicroQueue.push({
                type: MicroQueueOpKind.SET_ATTR,
                destination: el,
                parameters: [attr, value]
            });
            scheduleMicroqueue();
        }
    }
}