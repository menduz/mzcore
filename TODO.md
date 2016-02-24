ALPHA v0.1.0a
=====
Dev
---
- [*] mz-model: Add property modifier, today=`<input mz-model="user_name" />` planned=`<div mz-model="user.name" />`, it should update `user.name` and send a update signal if `{this.user}` is decorated with `@mz.MVCObject.proxy`.  
- [ ] mz-if
- [ ] mz-form: Create component, WIP, treat mz-form as MzInput, it can be used with `mz-model` attrib
- [ ] mz-repeat: support filters `<mz-repeat filter-from="4" filter-length="10" order-by="Name DESC" filter-by="{this.filter}"></mz-repeat>`
- [*] avoid parse expressions on `<![CDATA[ everithing inside a cdata is plain text .. { this must not be parsed as expression } .. ]]>`
- [*] `@mz.Widget.Attr` decorator for widget's properties
- [*] Include backbone and lodash on dist
- [*] `@mz.app.AppController.RouteName` decorator
- [*] Allow `<mz-repeat>` to use anything IForEachable as list
- [ ] Register template from `<template id="my_custom_view">` using `@mz.Widget.Template("#my_custom_view")`
- [*] Register template from file using `@mz.Widget.Template("@views/my_template.xml")`
- [*] redux experiment
- [*] read checked prop on checkboxs with mz-model
- [*] read scope from option on selects with mz-model
- [*] comments are parsed as text
- [*] object pool for generateScopedContent
- [*] MVCObject hooks
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

Tests
-----
- [ ] Allow `<mz-repeat>` to use anything IForEachable as list
- [*] Test for CDATA content
- [ ] mz-form
- [ ] create scoped component, change scope, then check expressions using scope
- [ ] mz-switcher
- [ ] mz-repeat
- [ ] mz-if
- [ ] attr `visible` test
- [*] mz-model attr
- [ ] specially on mz-repeat, test scopedContentPoll
- [*] MVCObject tests
- [*] event dispatcher tests
- [ ] test for object pool in mz-repeat, using arrays and mz.Collection 

UIKit
-----
- [*] add `<flex-row>` and `<flex-col>` components
- [ ] add gridview
- [ ] add contextMenu

Backlog
======

- [ ] raml2mzcore generator
- [ ] add `{ $index }` to scoped vars on mz-repeat