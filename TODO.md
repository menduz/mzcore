ALPHA v0.1.0
=====

- [ ] mz-model: Add property modifier, today=`<input mz-model="user_name" />` planned=`<div mz-model="user.name" />`, it should update `user.name` and send a update signal if `{this.user}` is decorated with `@mz.MVCObject.proxy`.  
- [ ] mz-repeat: Create tests  
- [ ] mz-if: Create attribute and tests
- [ ] mz-form: Create component
- [ ] add `<flex-row>` and `<flex-col>` components 
- [ ] mz-repeat: support filters `<mz-repeat filter-from="4" filter-length="10" order-by="Name DESC" filter-by="{this.filter}"></mz-repeat>`
    - [ ] add `{ scope_index }` to scoped vars 
        - [ ] Write tests
- [ ] raml2mzcore generator
- [*] avoid parse expressions on `<![CDATA[ everithing inside a cdata is plain text .. { this must not be parsed as expression } .. ]]>`
    - [ ] Test for CDATA content
- [ ] `@mz.Widget.Attr` decorator for widget's properties
- [ ] Include backbone and lodash on dist.