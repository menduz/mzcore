/// <reference path="../dist/mz.d.ts" />


var tests = 0;

mz.globalContext.globalVar = Math.random();

mz.view.tmpl.debug = true;

declare var QUnit;


// TEST 1

QUnit.test("EventDispatcher, emit simple", function(assert) {
    let ev = new mz.EventDispatcher;
    let call_count = 0;
    
    let eventBinding = ev.on('event', () => call_count++);
    
    ev.emit('event');    
    assert.equal(1, call_count, 'Call event');
    
    eventBinding.off();
    
    ev.emit('event');    
    assert.equal(1, call_count, 'Call event turned off');
    
    eventBinding = ev.on('event', () => call_count++);
    
    ev.emit('event');    
    assert.equal(2, call_count, 'Call new event');
    
    ev.emit('ignored_event');    
    assert.equal(2, call_count, 'Call ignored event');
    
    eventBinding.disable();
    
    ev.emit('event');    
    assert.equal(2, call_count, 'Call disabled event');
    
    eventBinding.enable();
    
    ev.emit('event');    
    assert.equal(3, call_count, 'Call re-enabled event');
    
    eventBinding.off();
    
    ev.emit('event');    
    assert.equal(3, call_count, 'Call re-enabled, then destroyed event');
    
    call_count = 0;
    
    eventBinding = ev.on('f     a', () => call_count++);
    assert.equal(2, eventBinding.sharedList.length, 'Multiple event binding, tabs and spaces between name');
    
    eventBinding.off();
    
    assert.equal(eventBinding.sharedList && eventBinding.sharedList.length || 0, 0, 'Multiple event turned down');
    
    ev.emit('f');
    
    ev.emit('a');
    
    assert.equal(call_count, 0, 'Multiple event turned down should not raise event');
    
    eventBinding = ev.on('a  d', () => call_count++);
    assert.equal(2, eventBinding.sharedList.length, 'Multiple event binding, multiple space between event names');
    
    eventBinding = ev.on('event anotherEvent', () => call_count++);
    assert.equal(2, eventBinding.sharedList.length, 'Multiple event binding');
    
    ev.emit('anotherEvent'); 
    assert.equal(1, call_count, 'Multiple event called once, event 2');
    
    ev.emit('event');
    assert.equal(2, call_count, 'Multiple event called once, event 1');
    
    call_count = 0;
    eventBinding = ev.once('test_once', () => call_count++);
    assert.equal(eventBinding.sharedList.length, 1, 'Once event registered');
    
    ev.emit('test_once')
    assert.equal(1, call_count, 'once() called');
    
    ev.emit('test_once')
    assert.equal(1, call_count, 'once() disposed');
})

QUnit.test("MVCObject", function(assert) {
    let ev = new mz.MVCObject;
    
    ev.set('a', 1);
    assert.equal(1, ev.get('a'), 'Set & get');
    
    let called = false;
    
    
    ev.on('a_changed', () => called = true);
    ev.set('a', 2);
    assert.equal(called, true, 'anything_changed event');
    
    called = false;
    ev.on('b_changed another_event', () => called = true);
    ev.set('b', 2);
    assert.equal(called, true, 'anything_changed event, multiple listeners');
});

QUnit.test("MVCObject, proxy", function(assert) {
    class extended_mvcObject extends mz.MVCObject {
        @mz.MVCObject.proxy
        test: number;
        
        @mz.MVCObject.proxy
        test2: number = 2;
    }
    
    let ev = new extended_mvcObject;
    
    assert.ok(typeof ev.test === "undefined", 'Undefined values should start as undefined');
    
    assert.equal(ev.test2, 2, 'Defined values should start with a value');

    ev.set('test', 1);
    assert.equal(ev.test, 1, '.set() must update property value');
    
    ev.test = 100;
    assert.equal(ev.test, 100, 'Property must update property value');

    ev.test = 200;
    assert.equal(ev.get('test'), 200, '.set() then .get()');
});