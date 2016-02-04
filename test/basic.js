var tests = 0;

mz.view.tmpl.debug = true;

function doTest(cb) {
    tests++;

    $('body').append("<hr/>Test: " + tests + " - ");
    var result = $('<span> . . . </span>');
    $('body').append(result);

    (function (i) {
        cb(function (a, b) {
            if (a == b) {
                return Promise.resolve(false);
            } else {
                console.error('Test ' + i + ': ERROR!', a, b);
                return Promise.reject(false);
            }
        }).then(function () {
            result.html('PASSED').css('color', 'green');
        }).catch(function () {
            result.html('<b>ERROR!</b>').css('color', 'red');
        })
    })(tests);
}





// TEST 1

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>Hello world!</div>`;

    var result = new HelloWorld();

    result.appendTo('body')

    return assert(result.rootNode.innerHTML, HelloWorld.prototype.defaultTemplate);
})

// TEST 2

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>Hello world! OuterHTML</div>`;

    var result = new HelloWorld();

    result.appendTo('body')
    return assert(result.rootNode.outerHTML, '<helloworld>' + HelloWorld.prototype.defaultTemplate + '</helloworld>');
})

// TEST 3

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>Hello world! OuterHTML</div>`;

    HelloWorld.prototype._unwrapedComponent = true;

    var result = new HelloWorld();

    result.appendTo('body')
    return assert(result.rootNode.outerHTML, HelloWorld.prototype.defaultTemplate);
})


// TEST 4

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>{this.value}</div>`;
    HelloWorld.prototype.value = '1234';
    HelloWorld.prototype._unwrapedComponent = true;

    var result = new HelloWorld();
    result.appendTo('body')
    return assert(result.rootNode.outerHTML, `<div>${result.value}</div>`);
})


// TEST 5

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>{this.value}</div>`;
    HelloWorld.prototype.value = '1234';
    HelloWorld.prototype._unwrapedComponent = true;

    var result = new HelloWorld();
    result.appendTo('body')
    result.set('value', 'ABC')
    return assert(result.rootNode.outerHTML, `<div>${result.get('value') }</div>`);
})

// TEST 6

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>[{value}]</div>`;
    HelloWorld.prototype._unwrapedComponent = true;

    var result = new HelloWorld();
    result.appendTo('body')
    result.set('value', 'ABC');
    return assert(result.rootNode.outerHTML, `<div>[${result.get('value') }]</div>`);
})

// TEST 7

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>[{value.toLowerCase()}]</div>`;
    HelloWorld.prototype._unwrapedComponent = true;



    var result = new HelloWorld();


    result.appendTo('body')
    result.set('value', 'ABC')
    return assert(result.rootNode.outerHTML, `<div>[${result.get('value').toLowerCase() }]</div>`);
})

// TEST 8

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>{value}<span>[{this.value.toLowerCase()}]</span></div>`;
    HelloWorld.prototype._unwrapedComponent = true;



    var result = new HelloWorld();

    result.on('value_changed', function (a) { this.value = a });

    result.appendTo('body')
    result.set('value', 'ABC')
    return assert(result.rootNode.outerHTML, `<div>${result.get('value')}<span>[${result.value.toLowerCase()}]</span></div>`);
});


// TEST 9

doTest(function (assert) {
    var resolve = null;
    
    var prom = new Promise(function(r){resolve = r;});
    
    class HelloWorld extends mz.widgets.BasePagelet { 
        click(){
            resolve();
        }
    }

    HelloWorld.prototype.defaultTemplate = `<div><button onclick="{this.click}">ClickMe</button></div>`;

    var result = new HelloWorld();

    result.appendTo('body')

    return prom;
});

// TEST 10

doTest(function (assert) {
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div style='color: {"red": this.value, black: !this.value}'>this sould be red</div>`;
    HelloWorld.prototype._unwrapedComponent = true;



    var result = new HelloWorld();

    result.on('value_changed', function (a) { this.value = a });

    result.appendTo('body')
    result.set('value', true);
    
    return assert($(result.rootNode).attr('style'), "color: red");
});