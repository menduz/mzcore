module mz.view {
    // riot!.js


    var brackets = (function(orig) {

        var cachedBrackets,
            r,
            b,
            re = /[{}]/g

        return function(x) {

            // make sure we use the current setting
            var s = orig

            // recreate cached vars if needed
            if (cachedBrackets !== s) {
                cachedBrackets = s
                b = s.split(' ')
                r = b.map(function(e) { return e.replace(/(?=.)/g, '\\') })
            }

            // if regexp given, rewrite it with current brackets (only if differ from default)
            return x instanceof RegExp ? (
                s === orig ? x :
                    new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
                ) :
                // else, get specific bracket
                b[x]
        }
    })('{ }')



    var cache = {},
        reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi
    //           [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
    // find variable names:
    // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
    // 2. skip object properties: .name
    // 3. skip object literals: name:
    // 4. skip javascript keywords
    // 5. match var name

    // build a template (or get it from cache), render with data
    export function tmpl(str: string, context: any, scope?: any) {
        return str && (cache[str] = cache[str] || tmpl.internalTmpl(str)).call(context, scope || context)
    }

    export module tmpl {
        export var debug: boolean = false;
        // create a template instance
        export function internalTmpl(s: string, p?: any) {
            if (debug) {
                console.groupCollapsed(s);
            }

            var orig = s;
            // default template string to {}
            s = (s || (brackets(0) + brackets(1)))

            // temporarily convert \{ and \} to a non-character
                .replace(brackets(/\\{/g), '\uFFF0')
                .replace(brackets(/\\}/g), '\uFFF1')

            // split string to expression and non-expresion parts
            p = split(s, extract(s, brackets(/{/), brackets(/}/)))
            let body = (

                // is it a single expression or a template? i.e. {x} or <b>{x}</b>
                !p[0] && !p[2] && !p[3]

                // if expression, evaluate it
                    ? expr(p[1])

                // if template, evaluate all expressions in it
                    : '[' + p.map(function(s, i) {

                        // is it an expression or a string (every second part is an expression)
                        return i % 2

                        // evaluate the expressions
                            ? expr(s, true)

                        // process string parts of the template:
                            : '"' + s

                            // preserve new lines
                                .replace(/\r\n/g, '\\n')
                                .replace(/\r/g, '\\n')
                                .replace(/\n/g, '\\n')
                                
                            // escape quotes
                                .replace(/"/g, '\\"')

                            + '"'

                    }).join(',') + '].join("")'
                )

            // bring escaped { and } back
                .replace(/\uFFF0/g, brackets(0))
                .replace(/\uFFF1/g, brackets(1));

            if (body.trim().length == 0)
                body = 'void 0';

            if (debug) {

                console.log(body);
                console.groupEnd();
            }
            var a = new Function('scope', 'return (' + body + ')');

            (<any>a).mzt = orig;

            return a;

        }


        // parse { ... } expression

        export function expr(s, n?) {
            if (debug)
                console.log('expr:', s);
            s = s

            // convert new lines to spaces
                .replace(/\n/g, ' ')

            // trim whitespace, brackets, strip comments
                .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

            // is it an object literal? i.e. { key : value }
            return /^\s*[\w-#\. "']+ *:/.test(s)

            // if object literal, return trueish keys
            // e.g.: { show: isOpen(), done: item.done } -> "show done"
                ? '[' +

                // extract key:val pairs, ignoring any nested objects
                extract(s,

                // name part: name:, "name":, 'name':, name :
                    /["' ]*[\w-#\. ]+["' ]*:/,

                // expression part: everything upto a comma followed by a name (see above) or end of line
                    /,(?=["' ]*[\w-#\. ]+["' ]*:)|}|$/
                    ).map(function(pair) {

                        // get key, val parts
                        return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

                            // wrap all conditional parts to ignore errors
                            return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

                        })

                    }).join('')

                + '].join(" ").trim()'

            // if js expression, evaluate as javascript
                : wrap(s, n)

        };


        // execute js w/o breaking on errors or undefined vars

        export function wrap(s, nonull) {
            s = s.trim()

            return !s ? '' : `
                (function(){ 
                    var v; 
                    try { 
                        v = `

            // prefix vars (name => data.name)
                + (

                    s.replace(reVars, function(s, _, v) {
                        return v ?
                            `
                            (typeof ${v} === "undefined" ? typeof this.${v} === "undefined" ? this.get && this.get("${v}") : this.${v} : ${v})`
                            :
                            s
                    }) || '[][0]'
                    )

                + `
                    } catch(e) { }
                    return ${(nonull === true ? ' !v && v !== 0 ? "" : v' : 'v') };
                }).call(this)`
        }


        // split string by an array of substrings

        export function split(str, substrings) {
            var parts = []
            substrings.map(function(sub, i) {

                // push matched expression and part before it
                i = str.indexOf(sub)
                parts.push(str.slice(0, i), sub)
                str = str.slice(i + sub.length)
            })

            // push the remaining part
            return parts.concat(str)
        }


        // match strings between opening and closing regexp, skipping any inner/nested matches

        export function extract(str, open, close) {

            var start,
                level = 0,
                matches = [],
                re = new RegExp('(' + open.source + ')|(' + close.source + ')', 'g')

            str.replace(re, function(_, open, close, pos) {

                // if outer inner bracket, mark position
                if (!level && open) start = pos

                // in(de)crease bracket level
                level += open ? 1 : -1

                // if outer closing bracket, grab the match
                if (!level && close != null) matches.push(str.slice(start, pos + close.length))

            })

            return matches
        }
    }

}
