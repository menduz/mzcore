ALPHA v0.1.0a
=====
Dev
---
- [x] mz-model: Add property modifier, today=`<input mz-model="user_name" />` planned=`<div mz-model="user.name" />`, it should update `user.name` and send a update signal if `{this.user}` is decorated with `@mz.MVCObject.proxy`.  
- [ ] mz-if
- [ ] mz-form: Create component, WIP, treat mz-form as MzInput, it can be used with `mz-model` attrib
- [ ] mz-repeat: support filters `<mz-repeat filter-from="4" filter-length="10" order-by="Name DESC" filter-by="{this.filter}"></mz-repeat>`
- [x] avoid parse expressions on `<![CDATA[ everithing inside a cdata is plain text .. { this must not be parsed as expression } .. ]]>`
- [x] `@mz.Widget.Attr` decorator for widget's properties
- [x] Include backbone and lodash on dist
- [x] `@mz.app.AppController.RouteName` decorator
- [x] Allow `<mz-repeat>` to use anything IForEachable as list
- [ ] Register template from `<template id="my_custom_view">` using `@mz.Widget.Template("#my_custom_view")`
- [x] Register template from file using `@mz.Widget.Template("@views/my_template.xml")`
- [x] redux experiment
- [x] read checked prop on checkboxs with mz-model
- [x] read scope from option on selects with mz-model
- [x] comments are parsed as text
- [x] object pool for generateScopedContent
- [x] MVCObject hooks
    ```typescript
    class ValidatedMVCObject extends mz.MVCObject {
        @mz.MVCObject.proxy
        test: number;
        
        test_changed(val, prevVal){
            if(val === prevVal) throw mz.MVCObject.Exception_PreventPropagation;
            if(val == null || val == undefined) throw mz.MVCObject.Exception_RollbackOperation;
            if(val > 10) return 10;
            if(val < 0) return 0;
        }
    }
    ```
- [*] mz.boot.js
- [ ] check for absolute urls on mz.loadCss
- [ ] Add redux route to mz.app.PageController
- [ ] Add redux selector decorator for properties
- [ ] Add mzproject.json parsing
- [ ] url() on styles should prepend the local address
- [ ] add `dispatch` to redux class

Tests
-----
- [ ] Allow `<mz-repeat>` to use anything IForEachable as list
- [x] Test for CDATA content
- [ ] mz-form
- [ ] create scoped component, change scope, then check expressions using scope
- [ ] mz-switcher
- [ ] mz-repeat
- [ ] mz-if
- [ ] attr `visible` test
- [x] mz-model attr
- [ ] specially on mz-repeat, test scopedContentPool
- [x] MVCObject tests
- [x] event dispatcher tests
- [ ] test for object pool in mz-repeat, using arrays and mz.Collection  
    ```typescript
        class sarasa extends mz.Widget {
        @sarasa.proxy
            test: string = 'a'   
        }
    ```  
    ```xml
        <div><sarasa test="b" /></div>
    ```  
    Renders
    ```xml
        <div><sarasa test="a" /></div>
    ```

- [ ] generateScopedContent of `<scoper><b>{scope.name}</b> (test)</scoper>` generates `[<b>myName</b>, undefined]`
- [ ] input send a value thru mz-model, the hook transforms the value, the new value should update the input
- [ ] Collection tests

UIKit
-----
- [x] add `<flex-row>` and `<flex-col>` components
- [ ] add gridview
- [ ] add contextMenu

Backlog
======

- [ ] raml2mzcore generator, WIP
- [ ] add `{ $index }` to scoped vars on mz-repeat