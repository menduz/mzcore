var tests = 0;

window.globalVar = Math.random();

mz.view.tmpl.debug = true;

function doTest(cb) {
    tests++;

    $('body').append("<hr/>Test: " + tests + " - ");
    var result = $('<span> . . . </span>');
    $('body').append(result);

    var passed = 0;
    var failed = 0;
    var total = 0;

    (function (i) {
        cb(function (a, b) {
            if (a == b) {
                total++;
                passed++;
                result.html(`PASSED ${passed}/${total}`).css('color', 'green');
                return Promise.resolve(true);
            } else {
                total++;
                failed++;
                console.error('Test ' + i + ': ERROR!', a, b);

                result.html(`<b>ERROR! ${failed}/${total}</b> PASSED ${passed}/${total}`).css('color', 'red');

                return Promise.reject(false);
            }
        }).then(function () {

            result.html(`PASSED`).css('color', 'green');
        }).catch(function () {

            result.html(`<b>ERROR!</b>`).css('color', 'red');
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
    return assert(result.rootNode.outerHTML, `<div>${result.get('value') }<span>[${result.value.toLowerCase() }]</span></div>`);
});


// TEST 9

doTest(function (assert) {
    var resolve = null;

    var prom = new Promise(function (r) { resolve = r; });

    class HelloWorld extends mz.widgets.BasePagelet {
        click() {
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

doTest(function (assert) {

    var scope = new mz.MVCObject();

    scope.setValues({
        a: 1
    });

    scope.set('b', 2)

    var tmpl = mz.view.tmpl,
        data = {
            yes: true,
            no: false,
            str: 'x',
            obj: { val: 2 },
            arr: [2],
            x: 2,
            $a: 0,
            $b: 1,
            esc: '\'\n\\',
            fn: function (s) { return ['hi', s].join(' ') }
        },
        render = function (str) {
            return tmpl(str, data, scope)
        }

    // expressions always return a raw value
    assert(render('{ 1 }'), 1)
    assert(render('{ x }'), 2)
    assert(render('{ str }'), data.str)
    assert(render('{ obj }'), data.obj)
    assert(render('{ arr }'), data.arr)
    assert(render('{ fn }'), data.fn)
    assert(render('{ null }'), null)
    assert(render('{ no }'), false)
    assert(render('{ yes }'), true)

    // templates always return a string value
    assert(render('{ 1 } '), '1 ')
    assert(render('{ obj } '), '[object Object] ')


    //// empty arguments

    // empty expressions equal to undefined
    assert(render('{}'), undefined)
    assert(render('{ }'), undefined)

    // empty templates equal to empty string
    assert(render(''), '')
    assert(render('{ } '), ' ')


    //// undefined values

    // ignore undefined value errors in expressions (catch the error, and set value to undefined)
    assert(render('{ nonExistingVar }'), undefined)
    assert(render('{ !nonExistingVar }'), true)
    assert(render('{ nonExistingVar ? "yes" : "no" }'), 'no')
    assert(render('{ !nonExistingVar ? "yes" : "no" }'), 'yes')

    // in templates, false and undefined values result in empty string
    assert(render(' { nonExistingVar }'), ' ')
    assert(render(' { no }'), ' ')


    //// expressions

    // expressions are just JavaScript
    assert(render('{ obj.val }'), 2)
    assert(render('{ obj["val"] }'), 2)
    assert(render('{ arr[0] }'), 2)
    assert(render('{ arr[0]; }'), 2)
    assert(render('{ arr.pop() }'), 2)
    assert(render('{ fn(str) }'), 'hi x')
    assert(render('{ yes && "ok" }'), 'ok')
    assert(render('{ no && "ok" }'), false)
    assert(render('{ false || null || !no && yes }'), true)
    assert(render('{ !no ? "yes" : "no" }'), 'yes')
    assert(render('{ !yes ? "yes" : "no" }'), 'no')
    assert(render('{ /^14/.test(+new Date()) }'), true)
    assert(render('{ typeof Math.random() }'), 'number')
    assert(render('{ fn("there") }'), 'hi there')
    assert(render('{ str == "x" }'), true)
    assert(render('{ /x/.test(str) }'), true)
    assert(render('{ true ? "a b c" : "foo" }'), 'a b c')
    assert(render('{ true ? "a \\"b\\" c" : "foo" }'), 'a "b" c')
    assert(render('{ str + " y" + \' z\'}'), 'x y z')
    assert(render('{ esc }'), data.esc)
    assert(render('{ $a }'), 0)
    assert(render('{ $a + $b }'), 1)
    assert(render('{ this.str }'), 'x')

    // global vars are supported in expressions
    assert(render('{ globalVar }'), globalVar)

    // all comments in expressions are stripped from the output
    assert(render('{ /* comment */ /* as*/ }'), undefined)
    assert(render(' { /* comment */ }'), ' ')
    assert(render('{ 1 /* comment */ + 1 }'), 2)
    assert(render('{ 1 /* comment */ + 1 } '), '2 ')


    //// templates

    // all expressions are evaluted in template
    assert(render('{ 1 }{ 1 }'), '11')
    assert(render('{ 1 }{ 1 } '), '11 ')
    assert(render(' { 1 }{ 1 }'), ' 11')
    assert(render('{ 1 } { 1 }'), '1 1')

    // both templates and expressions are new-line-friendly
    assert(render('\n  { yes \n ? 2 \n : 4} \n'), '\n  2 \n')
    // normalized eols
    assert(render('\r\n\n{ yes \r ? 2 : 4}\n\r'), '\n\n2\n\n')
    assert(render('\r\n  \r'), '\n  \n')

    //// class shorthand

    // names can be single-quoted, double-quoted, unquoted
    assert(render('{ ok : yes }'), 'ok')
    assert(render('{ "a" : yes, \'b\': yes, c: yes }'), 'a b c')
    assert(render('{ a_b-c3: yes }'), 'a_b-c3')

    // even dashed names can be unquoted
    assert(render('{ my-class: yes }'), 'my-class')

    // set two classes with one expression
    assert(render('{ "a b": yes }'), 'a b')

    // errors in expressions are silently catched allowing shorter expressions
    assert(render('{ loading: !nonExistingVar.length }'), 'loading')

    // expressions are just regular JavaScript
    assert(render('{ a: !no, b: yes }'), 'a b')
    assert(render('{ y: false || null || !no && yes }'), 'y')
    assert(render('{ y: 4 > 2 }'), 'y')
    assert(render('{ y: fn() }'), 'y')
    assert(render('{ y: str == "x" }'), 'y')
    assert(render('{ y: new Date() }'), 'y')

    // even function calls, objects and arrays are no problem
    assert(render('{ ok: fn(1, 2) }'), 'ok')
    assert(render('{ ok: fn([1, 2]) }'), 'ok')
    assert(render('{ ok: fn({a: 1, b: 1}) }'), 'ok')
    assert(render('{ "ok": fn({a: 1, b: 1}) }'), 'ok')
    assert(render('{ \'ok\': fn({a: 1, b: 1}) }'), 'ok')
    //// using brackets inside expressions

    // brackets in expressions can always be escaped
    assert(render('{ "\\{ 1 \\}" }'), '{ 1 }')
    assert(render('\\{ 1 }'), '{ 1 }')
    assert(render('{ "\\}" }'), '}')
    assert(render('{ "\\{" }'), '{')

    assert(render('{ y: yes }y{ y: yes, n: no }'), 'yyy')
    assert(render('{ "fff": yes != no, "000": no }'), 'fff');


    assert(render('{ "#fff": yes != no, "#000": no }'), '#fff');

    assert(render('color: { "#fff": yes != no, "#000": no }'), 'color: #fff');
    // though escaping is optional...
    assert(render('{ JSON.stringify({ x: 5 }) }'), '{"x":5}')
    assert(render('a{ "b{c}d" }e { "{f{f}}" } g'), 'ab{c}de {f{f}} g');


    return Promise.resolve(1);
});