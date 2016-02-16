ALPHA v0.1.0a
=====
- [ ] mz-model: Add property modifier, today=`<input mz-model="user_name" />` planned=`<div mz-model="user.name" />`, it should update `user.name` and send a update signal if `{this.user}` is decorated with `@mz.MVCObject.proxy`.  
- [ ] mz-repeat: Create tests  
- [ ] mz-if: Create attribute and tests
- [ ] mz-form: Create component
- [ ] mz-repeat: support filters `<mz-repeat filter-from="4" filter-length="10" order-by="Name DESC" filter-by="{this.filter}"></mz-repeat>`
- [ ] add `{ $index }` to `<mz-repeat>` scoped vars 
- [ ] raml2mzcore generator
- [*] avoid parse expressions on `<![CDATA[ everithing inside a cdata is plain text .. { this must not be parsed as expression } .. ]]>`
- [*] `@mz.Widget.Attr` decorator for widget's properties
- [*] Include backbone and lodash on dist.
- [ ] attr `visible` test
- [ ] `@mz.app.AppController.RouteName` decorator
- [*] Allow `<mz-repeat>` to use anything IForEachable as list
    
Tests
-----
- [ ] Allow `<mz-repeat>` to use anything IForEachable as list
- [*] Test for CDATA content
- [ ] add `{ $index }` to scoped vars 
- [ ] mz-form
- [ ] create scoped component, change scope, then check expressions using scope
- [ ] mz-switcher

UIKit
-----
- [ ] add `<flex-row>` and `<flex-col>` components
- [ ] add gridview
- [ ] add contextMenu

v0.2.0
======
- [ ] Redux state tree bindings with immutable.js