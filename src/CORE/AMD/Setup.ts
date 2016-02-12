/// <reference path="Define.ts" />
/// <reference path="Require.ts" />

mz.define("jquery", () => jQuery);
mz.require.route("backbone", "@mz/backbone-min.js");
mz.require.route("underscore", "@mz/underscore-min.js");

if (mz.globalContext.Backbone) {
    mz.define("backbone", () => mz.globalContext.Backbone);
}
if (mz.globalContext._) {
    mz.define("underscore", () => mz.globalContext._);
}