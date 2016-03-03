[![Build Status](https://travis-ci.org/menduz/mzcore.svg?branch=master)](https://travis-ci.org/menduz/mzcore)

# mzcore

**What is this?** A templating library built on top of Typescript

**Dependencies?** No external library or framework is needed, only Visual Studio, VSCode or tsc

### Inspiration

The idea of this library is to give the opportunity to develop web applications quickly, without needing to use Gulp, Grunt, Bower, Node.js, Babel or other transpiler. Only Typescript, which is included in VSCode or Visual Studio.

It's simple, you tap Cmd+S and your code is compiled, then you can try out your changes easily. You are happy, the PM is happy, you ship your product faster and everything without (a drop of rum!) setting up the right version of node, or fighting hours with a gulp file, bower dependencies, compilers, etc.

## Focus on easy learning

Are you familiar with Typescript and HTML? ... We then have the job almost done

Our crowd was familiar with C#, jQuery, plain HTML and <scripts>. Our business grew up, our products too, became more complex and almost impossible to maintain built on plains HTML and hardcoded scripts. But there was a problem: nobody ever used Angular, React, Ember or similar technology. Even Node.js.

Then I thought: can I keep the basic HTML layout, and attach a simple controller to it without spend resources dealing with controllers, directives, scopes, virtual dom or weird syntaxes on templates? This library is the answer

# Getting started

You have to know few things to get started
* **There is Views and Widgets** Widgets use Views to draw themselves
* **Views** are XML or HTML
* **Widgets** are Typescripts classes (controllers on MVC pattern)


#### Widgets
* All widgets extends `mz.Widget` or derivated class
* Unless other libraries, widgets do not includes mutation detectors, everything who needs constant update on views is decorated with `@mz.MVCObject.proxy` in order to propagate changes to the view

#### Views
* It can be statically defined as a template on code or it can be loaded from a HTML or XML
* Everything inside braces (expressions) `<span>{Math.round(counter * 2)}</span>` is evaluated as javascript. Without restrictions.
* If you want to scape a brace, just add `<span>\{ non evaluated fragment }</span>` or CDATA `<style><![CDATA[  .button { color: red } .link { color: blue }  ]]></span>` 
* Inside expressions, `this` is the Widget's instance.
* All user events' arguments implements `mz.IMZComponentEvent`, which contains information of the original event, and for ex: the clicked node

# Examples

## HelloWorld

```typescript
@HelloWorld.Template(`
  <div>
    Hello world!
  </div>
`)
class HelloWorld extends mz.widgets.BasePagelet { /* empty */ }

new HelloWorld().appendTo('body');
```

This snippet would append a `<div>Hello world!</div>` into the body.

## Auto Updated Clock

```typescript
@Clock.Template(`
  <div>
    Time: {this.time}
  </div>
`)
class Clock extends mz.widgets.BasePagelet {
    @Clock.proxy
    time: Date;

    interval = setInterval(() => this.time = new Date, 1000);
}
new Clock().appendTo('body');
```

Renders `<div>Time: Sun Feb 07 2016 17:11:03 GMT-0300 (ART)</div>` and update the time every 1 second

## Events

```typescript
@ColorTest.Template(`
  <div>
    <button 
        onclick="{this.toggleColor}" 
        style="color: {this.isRed ? 'red' : 'black'}">
           Toggle color!
    </button>
  </div>
`)
class ColorTest extends mz.widgets.BasePagelet {
    @ColorTest.proxy
    isRed: boolean = true;

    toggleColor(){
        this.isRed = !this.isRed;
    }
}
new ColorTest().appendTo('body');
```

A button, when pressed toggle it's font color 

## Input's value

```typescript
@InputTest.Template(`
  <div>
    <input mz-model="my_text" />
    <span>{my_text.toUpperCase()}</span>
  </div>
`)
class InputTest extends mz.widgets.BasePagelet {
    @InputTest.proxy
    my_text: string;
}
new InputTest().appendTo('body');
```

Install with bower
===

```shell 
$ bower install mzcore --save
```
then include this script at the top of your html

```html
<script src="bower_components/mzcore/mz.boot.js"></script>
```
Manual installation
===

First, [download a release](https://github.com/menduz/mzcore/releases), then include the file "mz.boot.js" in your file
```html
<script src="bower_components/mzcore/mz.boot.js"></script>
```

Checkout the examples
===

- [Mzcore's Homepage](http://mzcore.menduz.com)
- [SPA, with url routing](https://github.com/menduz/mzcore-spa-example) **[Demo](https://menduz.github.io/mzcore-spa-example)**
- [DBMonster performance test](https://github.com/menduz/mzcore-dbmonster) **[Demo](http://menduz.github.io/mzcore-dbmonster)**
- [Ionic components + app routing](https://github.com/menduz/mzcore-ionic-example) **[Demo](http://menduz.github.io/mzcore-ionic-example/)**