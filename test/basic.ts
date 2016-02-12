/// <reference path="../dist/mz.d.ts" />


var tests = 0;

mz.globalContext.globalVar = Math.random();

mz.view.tmpl.debug = true;

declare var QUnit;


// TEST 1

QUnit.test("Basic html template, content", function(assert) {
    @mz.Widget.Template(`<div>Hello world!</div>`)
    class HelloWorld extends mz.widgets.BasePagelet { }

    var result = new HelloWorld();

    assert.equal((result.rootNode as HTMLElement).innerHTML, HelloWorld.prototype.defaultTemplate, 'Basic rendering');
})

// TEST 2

QUnit.test("Basic html template, outer html", function(assert) {
    
    @mz.Widget.Template(`<div>Hello world! OuterHTML</div>`)
    class HelloWorld extends mz.widgets.BasePagelet { }

    var result = new HelloWorld();

    assert.equal((result.rootNode as HTMLElement).outerHTML, '<helloworld>' + HelloWorld.prototype.defaultTemplate + '</helloworld>');
})

// TEST 3

QUnit.test("Basic html template, unwrapped", function(assert) {

    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>Hello world! OuterHTML</div>`;

    var result = new HelloWorld();

    assert.equal((result.rootNode as HTMLElement).outerHTML, HelloWorld.prototype.defaultTemplate);
})


// TEST 4

QUnit.test("Basic html template, expression value", function(assert) {

    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet {
        @HelloWorld.proxy
        value = '1234';
    }

    HelloWorld.prototype.defaultTemplate = `<div>{this.value}</div>`;

    var result = new HelloWorld();

    assert.equal((result.rootNode as HTMLElement).outerHTML, `<div>${result.value}</div>`);
})


// TEST 5

QUnit.test("Basic html template, expression, change value on the fly", function(assert) {
    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet {
        @HelloWorld.proxy
        value = '1234';
    }

    HelloWorld.prototype.defaultTemplate = `<div>{this.value}</div>`;

    var result = new HelloWorld();

    result.set('value', 'ABC')
    assert.equal((result.rootNode as HTMLElement).outerHTML, `<div>${result.get('value')}</div>`);
})

// TEST 6

QUnit.test("Basic html template, expression, value from attr", function(assert) {
    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>[{value}]</div>`;

    var result = new HelloWorld();

    result.attr('value', 'ABC');
    assert.equal((result.rootNode as HTMLElement).outerHTML, `<div value="${result.attr('value')}">[${result.attr('value')}]</div>`);
})

// TEST 7

QUnit.test("Basic html template, expression with js", function(assert) {
    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div>[{value.toLowerCase()}]</div>`;


    var result = new HelloWorld();

    result.set('value', 'ABC')
    assert.equal((result.rootNode as HTMLElement).outerHTML, `<div>[${result.get('value').toLowerCase()}]</div>`);
})

// TEST 8

QUnit.test("Basic html template, expression composed with js", function(assert) {
    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet { 
        @HelloWorld.proxy
        value;
    }

    HelloWorld.prototype.defaultTemplate = `<div>{value} a<span>[{this.value.toLowerCase()}]</span></div>`;


    var result = new HelloWorld();

    result.value = 'ABC';
    assert.equal((result.rootNode as HTMLElement).outerHTML, `<div>${result.get('value')} a<span>[${result.value.toLowerCase()}]</span></div>`);
});

// TEST 10

QUnit.test("Basic html template, expression with class selectors", function(assert) {
    @mz.Widget.ConfigureUnwrapped
    class HelloWorld extends mz.widgets.BasePagelet { }

    HelloWorld.prototype.defaultTemplate = `<div style='color: {"red": this.value, black: !this.value}'>this sould be red</div>`;



    var result = new HelloWorld();

    result.on('value_changed', function(a) { this.value = a });

    result.set('value', true);

    assert.equal($(result.rootNode).attr('style'), "color: red");
});


function exprTests(assrt) {

    var assert = assrt.ok.bind(assrt);
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
            fn: function(s) { return ['hi', s].join(' ') }
        },
        render = function(str) {
            return tmpl(str, data, scope)
        }

    // expressions always return a raw value
    assert(render('{ 1 }'), 1, '')
    assert(render('{ x }'), 2)
    assert(render('{ str }'), data.str)
    assert(render('{ obj }'), data.obj)
    assert(render('{ arr }'), data.arr)
    assert(render('{ fn }'), data.fn)
    assrt.ok(render('{ null }') === null)
    assrt.ok(render('{ no }') === false)
    assert(render('{ yes }'), true)

    // templates always return a string value
    assert(render('{ 1 } '), '1 ')
    assert(render('{ obj } '), '[object Object] ')


    //// empty arguments

    // empty expressions equal to undefined
    assrt.ok(render('{}') === undefined)
    assrt.ok(render('{ }') === undefined)

    // empty templates equal to empty string
    assrt.ok(render('') === '')
    assrt.ok(render('{ } ') === ' ')


    //// undefined values

    // ignore undefined value errors in expressions (catch the error, and set value to undefined)
    assrt.ok(render('{ nonExistingVar }') === undefined)
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
    assrt.ok(render('{ no && "ok" }') == false)
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
    assert(render('{ $a }') === 0, true)
    assert(render('{ $a + $b }'), 1)
    assert(render('{ this.str }'), 'x')

    // global vars are supported in expressions
    assert(render('{ globalVar }'), mz.globalContext.globalVar)

    // all comments in expressions are stripped from the output
    assrt.ok(render('{ /* comment */ /* as*/ }') === undefined)
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
}

QUnit.test("Expressions", exprTests);
QUnit.test("Expressions (cached, should be faster)", exprTests);