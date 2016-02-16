/// <reference path="../DOM.ts" />
/// <reference path="DOM_BrowserImpl.ts" />

namespace mz.dom.microqueue {

    let hasSetImmediate = typeof setImmediate === 'function';

    function makeRequestFlushFromMutationObserver(flush) {
        let toggle = 1;
        let observer = new (mz.globalContext.MutationObserver || mz.globalContext.WebKitMutationObserver)(flush);
        let node = adapter.createTextNode('');
        observer.observe(node, { characterData: true });
        return function requestFlush() {
            toggle = -toggle;
            node.data = toggle.toString();
        };
    }

    function makeRequestFlushFromTimer(flush) {
        return function requestFlush() {
            // We dispatch a timeout with a specified delay of 0 for engines that
            // can reliably accommodate that request. This will usually be snapped
            // to a 4 milisecond delay, but once we're flushing, there's no delay
            // between events.
            let timeoutHandle = setTimeout(handleFlushTimer, 0);
            // However, since this timer gets frequently dropped in Firefox
            // workers, we enlist an interval handle that will try to fire
            // an event 20 times per second until it succeeds.
            let intervalHandle = setInterval(handleFlushTimer, 50);
            function handleFlushTimer() {
                // Whichever timer succeeds will cancel both timers and request the
                // flush.
                clearTimeout(timeoutHandle);
                clearInterval(intervalHandle);
                flush();
            }
        };
    }

    function onError(error) {
        if (hasSetImmediate) {
            setImmediate(() => { throw error; });
        } else {
            setTimeout(() => { throw error; }, 0);
        }
    }

    /**
    * Implements an asynchronous task queue.
    */
    class MicroTaskQueue {
        /**
         * Creates an instance of TaskQueue.
        */
        microTaskQueue = [];
        taskQueue = [];
        microTaskQueueCapacity = 1024;
        requestFlushMicroTaskQueue: any;
        requestFlushTaskQueue: any;

        constructor() {
            if (mz.globalContext.MutationObserver || mz.globalContext.WebKitMutationObserver) {
                this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(() => this.flushMicroTaskQueue());
            } else {
                this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(() => this.flushMicroTaskQueue());
            }
        }

        /**
         * Queues a task on the micro task queue for ASAP execution.
        * @param task The task to queue up for ASAP execution.
        */
        queueMicroTask(task: MicroDomTask): void {
            if (this.microTaskQueue.length < 1) {
                this.requestFlushMicroTaskQueue();
            }

            this.microTaskQueue.push(task);
        }

        /**
         * Immediately flushes the micro task queue.
        */
        flushMicroTaskQueue(): void {
            let queue = this.microTaskQueue;
            let capacity = this.microTaskQueueCapacity;
            let index = 0;
            let task: MicroDomTask;

            try {
                while (index < queue.length) {
                    task = queue[index];

                    switch (task.type) {
                        case MicroQueueOpKind.APPEND:
                            adapter.appendChild(task.destination, task.parameters);
                            break;
                        case MicroQueueOpKind.DETACH:
                            adapter.remove(task.destination);
                            break;
                        case MicroQueueOpKind.SET_TEXT:
                            if (task.destination.textContent != task.parameters)
                                adapter.setText(task.destination, task.parameters);
                            break;
                        case MicroQueueOpKind.SET_ATTR:
                            adapter.setAttribute(task.destination, task.parameters[0], task.parameters[1]);
                            break;
                        case MicroQueueOpKind.CALLBACK:
                            task.destination();
                            break;
                    }

                    index++;

                    // Prevent leaking memory for long chains of recursive calls to `queueMicroTask`.
                    // If we call `queueMicroTask` within a MicroTask scheduled by `queueMicroTask`, the queue will
                    // grow, but to avoid an O(n) walk for every MicroTask we execute, we don't
                    // shift MicroTasks off the queue after they have been executed.
                    // Instead, we periodically shift 1024 MicroTasks off the queue.
                    if (index > capacity) {
                        // Manually shift all values starting at the index back to the
                        // beginning of the queue.
                        for (let scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                            queue[scan] = queue[scan + index];
                        }

                        queue.length -= index;
                        index = 0;
                    }
                }
            } catch (error) {
                onError(error);
            }

            queue.length = 0;
        }
    }

    interface MicroDomTask {
        type: MicroQueueOpKind;
        destination: any;
        parameters?: any;
    }

    enum MicroQueueOpKind {
        APPEND,
        DETACH,
        SET_TEXT,
        SET_ATTR,
        CALLBACK
    }

    export var enabled = true;

    var theMicroDomTaskQueue = new MicroTaskQueue;

    export function flush() {
        theMicroDomTaskQueue.flushMicroTaskQueue();
    }

    export function appendChild(el, node) {
        if (!enabled) { adapter.appendChild(el, node); return; }
        theMicroDomTaskQueue.queueMicroTask({
            type: MicroQueueOpKind.APPEND,
            destination: el,
            parameters: node
        });
    }

    export function callback(cb) {
        if (!enabled) { cb(); }
        theMicroDomTaskQueue.queueMicroTask({
            type: MicroQueueOpKind.CALLBACK,
            destination: cb
        });
    }

    export function remove(el) {
        if (!enabled) { adapter.remove(el); return; }
        theMicroDomTaskQueue.queueMicroTask({
            type: MicroQueueOpKind.DETACH,
            destination: el
        });
    }

    export function setText(el, text: string) {
        if (!enabled) { adapter.setText(el, text); return; }
        theMicroDomTaskQueue.queueMicroTask({
            type: MicroQueueOpKind.SET_TEXT,
            destination: el,
            parameters: text
        });
    }

    export function setAttribute(el, attr: string, value: string) {
        if (!enabled) { adapter.setAttribute(el, attr, value); return; }
        theMicroDomTaskQueue.queueMicroTask({
            type: MicroQueueOpKind.SET_ATTR,
            destination: el,
            parameters: [attr, value]
        });
    }
}