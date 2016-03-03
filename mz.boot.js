window._debug = window._debug || false;

var usemzcoreLecagy = false;

if (window.location.search.match('(\\?|&)mz-debug') !== null) {
    window._debug = true;
}

window.isTablet = navigator.userAgent.indexOf('Android') != -1 || navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPhone') != -1 || (navigator.userAgent.indexOf('Android') != -1 || navigator.userAgent.indexOf('Mobile') != -1);

if (window.location.search.match('(\\?|&)mz-tablet') !== null) {
    window.isTablet = true;
}

var scripts = document.getElementsByTagName('script'),
    test, path, i, ln, scriptSrc, match, lang;
var jquery = true;
var jqueryVer = null;

for (i = 0, ln = scripts.length; i < ln; i++) {
    scriptSrc = scripts[i].src;

    match = scriptSrc.match(/mz\.boot\.js/);

    if (match) {
        path = scriptSrc.substring(0, scriptSrc.indexOf(match[0]));
        break;
    }
}

window.mzcorePath = path;

if (!('Promise' in window))
    document.write('<' + 'scr' + 'ipt type="text/javascript" charset="UTF-8" src="' + path + 'dist/polyfills/promise.js"></' + 'script>');

if (!('atob' in window))
    document.write('<' + 'scr' + 'ipt type="text/javascript" charset="UTF-8" src="' + path + 'dist/polyfills/base64.js"></' + 'script>');

if (!('requestAnimationFrame' in window))
    document.write('<' + 'scr' + 'ipt type="text/javascript" charset="UTF-8" src="' + path + 'dist/polyfills/raf.js"></' + 'script>');

if (!('Promise' in window.jQuery))
    document.write('<' + 'scr' + 'ipt type="text/javascript" charset="UTF-8" src="' + path + 'dist/jquery.js"></' + 'script>');

document.write('<' + 'scr' + 'ipt type="text/javascript" charset="UTF-8" src="' + path + 'dist/mz' + (window._debug ? '' : '.min') + '.js"></' + 'script>');
