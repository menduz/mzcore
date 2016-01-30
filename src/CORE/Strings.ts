

interface String {
    capitalize(): string;
    setAt(charIndex: number, char: string): string;
    endsWith(part: string): boolean;
    startsWith(part: string): boolean;
    contains(part: string): boolean;
    toCamelCase(): string;
    isValidMail(): boolean;

    /** 'Hola {0}, mi nombre es {1}.'.format('Carlos', 'Esteban') => 'Hola Carlos, mi nombre es Esteban.' */
    format(...params: any[]): string;
}


var sp = String.prototype;

if (!('capitalize' in sp)) {
    sp.capitalize = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

if (!('setAt' in sp)) {
    sp.setAt = function (index, character) {
        return this.substr(0, index) + character + this.substr(index + character.length);
    };
}

if (!('endsWith' in sp)) {
    sp.endsWith = function (suffix) {
        suffix = suffix.toString();
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (!('startsWith' in sp)) {
    sp.startsWith = function (prefix) {
        prefix = prefix.toString();
        return this.indexOf(prefix) === 0;
    };
}

if (!('contains' in sp)) {
    sp.contains = function (prefix) {
        prefix = prefix.toString();
        return this.indexOf(prefix) !== -1;
    };
}

sp.toCamelCase = function () {
    return this.toLowerCase().replace(/-([a-z])/g, function (match, group1) {
        return group1.toUpperCase();
    });
}

sp.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

sp.isValidMail = function () {
    return this.length > 5 && re.test(this);
}
