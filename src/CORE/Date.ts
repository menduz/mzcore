/// <reference path="../mz.ts" />
/// <reference path="I18n.ts" />
/// <reference path="Xr.ts" />

/*
* Date prototype extensions. Doesn't depend on any
* other code. Doens't overwrite existing methods.
*
* Adds dayNames, abbrDayNames, monthNames and abbrMonthNames static properties and isLeapYear,
* isWeekend, isWeekDay, getDaysInMonth, getDayName, getMonthName, getDayOfYear, getWeekOfYear,
* setDayOfYear, addYears, addMonths, addDays, addHours, addMinutes, addSeconds methods
*
* Copyright (c) 2006 JÃ¶rn Zaefferer and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
*
* Additional methods and properties added by Kelvin Luck: firstDayOfWeek, dateFormat, zeroTime, asString, fromString -
* I've added my name to these methods so you know who to blame if they are broken!
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/


interface Date {
    add(intervalo: string, cantidad: number): Date;
    part(intervalo: string): string | number;
    asString(formato: string): string;
}


Date.prototype.add = function(sInterval, iNum) {
    var dTemp = this;
    if (!sInterval || iNum == 0) return dTemp;
    switch (sInterval.toLowerCase()) {
        case "ms":
            dTemp.setMilliseconds(dTemp.getMilliseconds() + iNum);
            break;
        case "s":
        case "ss":
            dTemp.setSeconds(dTemp.getSeconds() + iNum);
            break;
        case "mi":
        case "m":
        case "mm":
            dTemp.setMinutes(dTemp.getMinutes() + iNum);
            break;
        case "h":
        case "hh":
            dTemp.setHours(dTemp.getHours() + iNum);
            break;
        case "d":
        case "dd":
            dTemp.setDate(dTemp.getDate() + iNum);
            break;
        case "mo":
            dTemp.setMonth(dTemp.getMonth() + iNum);
            break;
        case "y":
        case "yyyy":
            dTemp.setFullYear(dTemp.getFullYear() + iNum);
            break;
    }
    return dTemp;
}

Date.prototype.part = function(sInterval) {
    var dTemp = this;
    if (!sInterval) return dTemp;
    switch (sInterval.toLowerCase()) {
        case "ms":
            return ('0000' + (dTemp.getMilliseconds().toString())).substr(-4);
        case "s":
        case "ss":
            return ('00' + (dTemp.getSeconds()).toString()).substr(-2);
        case "mi":
        case "m":
        case "mm":
            return ('00' + (dTemp.getMinutes()).toString()).substr(-2);
        case "h":
        case "hh":
            return ('00' + (dTemp.getHours()).toString()).substr(-2);
        case "d":
        case "dd":
            return ('00' + (dTemp.getDate()).toString()).substr(-2);
        case "mo":
            return ('00' + (dTemp.getMonth() + 1).toString()).substr(-2);
        case "y":
        case "yyyy":
            return dTemp.getFullYear().toString();
    }
    return sInterval;
}



namespace mz.date {

    var regexpISO8601 = /^[0-9]{4}(.{1})[0-9]{1,2}\1[0-9]{1,2}\T/;

    export function parseObject<T>(json: T): T {


        if (typeof json == "object") {
            var out: any;

            if (json instanceof Array)
                out = [];
            else
                out = {};

            for (var i in json) {
                if (typeof json[i] == "string") {
                    if (json[i].substr(0, 6) === "/Date(" && json[i].substr(-2) === ")/") {
                        out[i] = parse(json[i]);
                    } else if (json[i].substr(10, 1) === "T" && (json[i].length < 32) && regexpISO8601.test(json[i])) {
                        let a = new Date(json[i]);
                        if (!isNaN(a as any))
                            out[i] = a;
                        else
                            out[i] = json[i];
                    } else {
                        out[i] = json[i];
                    }
                } else {
                    if (mz.isIterable(json[i])) {
                        out[i] = parseObject(json[i]);
                    } else {
                        out[i] = json[i];
                    }
                }
            }
            return out;
        }
        return json;
    }
    
    
    /**
    * An Array of day names starting with Sunday.
    * 
    * @example dayNames[0]
    * @result 'Sunday'
    *
    * @name dayNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    export var dayNames = mz.translate('#dayNames', 'Domingo|Lunes|Martes|Miercoles|Jueves|Viernes|Sabado').split('|');

    /**
    * An Array of abbreviated day names starting with Sun.
    * 
    * @example abbrDayNames[0]
    * @result 'Sun'
    *
    * @name abbrDayNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    export var abbrDayNames = mz.translate('#abbrDayNames', 'Dom|Lun|Mar|Mie|Jue|Vie|Sab').split('|');

    /**
    * An Array of month names starting with Janurary.
    * 
    * @example monthNames[0]
    * @result 'January'
    *
    * @name monthNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    export var monthNames = mz.translate('#monthNames', 'Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre').split('|');

    /**
    * An Array of abbreviated month names starting with Jan.
    * 
    * @example abbrMonthNames[0]
    * @result 'Jan'
    *
    * @name monthNames
    * @type Array
    * @cat Plugins/Methods/Date
    */
    export var abbrMonthNames = mz.translate('#abbrMonthNames', 'Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic').split('|');

    /**
    * The first day of the week for this locale.
    *
    * @name firstDayOfWeek
    * @type Number
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    export var firstDayOfWeek = 0;

    /**
    * The format that string dates should be represented as (e.g. 'dd/mm/yyyy' for UK, 'mm/dd/yyyy' for US, 'yyyy-mm-dd' for Unicode etc).
    *
    * @name format
    * @type String
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    export var format = mz.translate('#DateFormat', 'dd/mm/yyyy');
    //Date.format = 'mm/dd/yyyy';
    //Date.format = 'yyyy-mm-dd';
    //Date.format = 'dd mmm yy';

    /**
    * The first two numbers in the century to be used when decoding a two digit year. Since a two digit year is ambiguous (and date.setYear
    * only works with numbers < 99 and so doesn't allow you to set years after 2000) we need to use this to disambiguate the two digit year codes.
    *
    * @name format
    * @type String
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    export var fullYearStart = '20';


    /**
    * Adds a given method under the given name 
    * to the Date prototype if it doesn't
    * currently exist.
    *
    * @private
    */
    function addFeature(name, method) {
        if (!Date.prototype[name]) {
            Date.prototype[name] = method;
        }
    };

    /**
    * Checks if the year is a leap year.
    *
    * @example var dtm = new Date("01/12/2008");
    * dtm.isLeapYear();
    * @result true
    *
    * @name isLeapYear
    * @type Boolean
    * @cat Plugins/Methods/Date
    */
    addFeature("isLeapYear", function() {
        var y = this.getFullYear();
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
    });

    /**
    * Checks if the day is a weekend day (Sat or Sun).
    *
    * @example var dtm = new Date("01/12/2008");
    * dtm.isWeekend();
    * @result false
    *
    * @name isWeekend
    * @type Boolean
    * @cat Plugins/Methods/Date
    */
    addFeature("isWeekend", function() {
        return this.getDay() == 0 || this.getDay() == 6;
    });

    /**
    * Check if the day is a day of the week (Mon-Fri)
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.isWeekDay();
    * @result false
    * 
    * @name isWeekDay
    * @type Boolean
    * @cat Plugins/Methods/Date
    */
    addFeature("isWeekDay", function() {
        return !this.isWeekend();
    });

    /**
    * Gets the number of days in the month.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getDaysInMonth();
    * @result 31
    * 
    * @name getDaysInMonth
    * @type Number
    * @cat Plugins/Methods/Date
    */
    addFeature("getDaysInMonth", function() {
        return [31, (this.isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()];
    });

    /**
    * Gets the name of the day.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getDayName();
    * @result 'Saturday'
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getDayName(true);
    * @result 'Sat'
    * 
    * @param abbreviated Boolean When set to true the name will be abbreviated.
    * @name getDayName
    * @type String
    * @cat Plugins/Methods/Date
    */
    addFeature("getDayName", function(abbreviated) {
        return abbreviated ? mz.date.abbrDayNames[this.getDay()] : mz.date.dayNames[this.getDay()];
    });

    /**
    * Gets the name of the month.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getMonthName();
    * @result 'Janurary'
    *
    * @example var dtm = new Date("01/12/2008");
    * dtm.getMonthName(true);
    * @result 'Jan'
    * 
    * @param abbreviated Boolean When set to true the name will be abbreviated.
    * @name getDayName
    * @type String
    * @cat Plugins/Methods/Date
    */
    addFeature("getMonthName", function(abbreviated) {
        return abbreviated ? mz.date.abbrMonthNames[this.getMonth()] : mz.date.monthNames[this.getMonth()];
    });

    /**
    * Get the number of the day of the year.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getDayOfYear();
    * @result 11
    * 
    * @name getDayOfYear
    * @type Number
    * @cat Plugins/Methods/Date
    */
    addFeature("getDayOfYear", function() {
        var tmpdtm = new Date("1/1/" + this.getFullYear());
        return Math.floor((this.getTime() - tmpdtm.getTime()) / 86400000);
    });

    /**
    * Get the number of the week of the year.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.getWeekOfYear();
    * @result 2
    * 
    * @name getWeekOfYear
    * @type Number
    * @cat Plugins/Methods/Date
    */
    addFeature("getWeekOfYear", function() {
        return Math.ceil(this.getDayOfYear() / 7);
    });

    /**
    * Set the day of the year.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.setDayOfYear(1);
    * dtm.toString();
    * @result 'Tue Jan 01 2008 00:00:00'
    * 
    * @name setDayOfYear
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("setDayOfYear", function(day) {
        this.setMonth(0);
        this.setDate(day);
        return this;
    });

    /**
    * Add a number of years to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addYears(1);
    * dtm.toString();
    * @result 'Mon Jan 12 2009 00:00:00'
    * 
    * @name addYears
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addYears", function(num) {
        this.setFullYear(this.getFullYear() + num);
        return this;
    });

    /**
    * Add a number of months to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addMonths(1);
    * dtm.toString();
    * @result 'Tue Feb 12 2008 00:00:00'
    * 
    * @name addMonths
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addMonths", function(num) {
        var tmpdtm = this.getDate();

        this.setMonth(this.getMonth() + num);

        if (tmpdtm > this.getDate())
            this.addDays(-this.getDate());

        return this;
    });

    /**
    * Add a number of days to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addDays(1);
    * dtm.toString();
    * @result 'Sun Jan 13 2008 00:00:00'
    * 
    * @name addDays
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addDays", function(num) {
        //this.setDate(this.getDate() + num);
        this.setTime(this.getTime() + (num * 86400000));
        return this;
    });

    /**
    * Add a number of hours to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addHours(24);
    * dtm.toString();
    * @result 'Sun Jan 13 2008 00:00:00'
    * 
    * @name addHours
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addHours", function(num) {
        this.setHours(this.getHours() + num);
        return this;
    });

    /**
    * Add a number of minutes to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addMinutes(60);
    * dtm.toString();
    * @result 'Sat Jan 12 2008 01:00:00'
    * 
    * @name addMinutes
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addMinutes", function(num) {
        this.setMinutes(this.getMinutes() + num);
        return this;
    });

    /**
    * Add a number of seconds to the date object.
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.addSeconds(60);
    * dtm.toString();
    * @result 'Sat Jan 12 2008 00:01:00'
    * 
    * @name addSeconds
    * @type Date
    * @cat Plugins/Methods/Date
    */
    addFeature("addSeconds", function(num) {
        this.setSeconds(this.getSeconds() + num);
        return this;
    });

    /**
    * Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
    * 
    * @example var dtm = new Date();
    * dtm.zeroTime();
    * dtm.toString();
    * @result 'Sat Jan 12 2008 00:01:00'
    * 
    * @name zeroTime
    * @type Date
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    addFeature("zeroTime", function() {
        this.setMilliseconds(0);
        this.setSeconds(0);
        this.setMinutes(0);
        this.setHours(0);
        return this;
    });

    /**
    * Returns a string representation of the date object according to Date.format.
    * (Date.toString may be used in other places so I purposefully didn't overwrite it)
    * 
    * @example var dtm = new Date("01/12/2008");
    * dtm.asString();
    * @result '12/01/2008' // (where Date.format == 'dd/mm/yyyy'
    * 
    * @name asString
    * @type Date
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */
    addFeature("asString", function(format) {
        var r = format || mz.date.format;
        if (r.split('mm').length > 1) { // ugly workaround to make sure we don't replace the m's in e.g. noveMber
            r = r.split('mmmm').join(this.getMonthName(false))
                .split('mmm').join(this.getMonthName(true))
                .split('mm').join(_zeroPad(this.getMonth() + 1))
        } else {
            r = r.split('m').join(this.getMonth() + 1);
        }
        r = r.split('yyyy').join(this.getFullYear())
            .split('yy').join((this.getFullYear() + '').substring(2))
            .split('dd').join(_zeroPad(this.getDate()))
            .split('d').join(this.getDate());
        return r;
    });

    /**
    * Returns a new date object created from the passed String according to Date.format or false if the attempt to do this results in an invalid date object
    * (We can't simple use Date.parse as it's not aware of locale and I chose not to overwrite it incase it's functionality is being relied on elsewhere)
    *
    * @example var dtm = Date.fromString("12/01/2008");
    * dtm.toString();
    * @result 'Sat Jan 12 2008 00:00:00' // (where Date.format == 'dd/mm/yyyy'
    * 
    * @name fromString
    * @type Date
    * @cat Plugins/Methods/Date
    * @author Kelvin Luck
    */


    export function fromString(s, f) {
        f = f || format;

        f.replace('mo', 'mm');

        var d = new Date('01/01/1970');

        if (s == '') return d;

        s = s.toLowerCase();
        var matcher = '';
        var order = [];
        var r = /(dd?d?|mm?m?|yy?yy?)+([^(m|d|y)])?/g;
        var results;
        while ((results = r.exec(f)) != null) {
            switch (results[1]) {
                case 'd':
                case 'dd':
                case 'm':
                case 'mm':
                case 'yy':
                case 'yyyy':
                    matcher += '(\\d+\\d?\\d?\\d?)+';
                    order.push(results[1].substr(0, 1));
                    break;
                case 'mmm':
                    matcher += '([a-z]{3})';
                    order.push('M');
                    break;
            }
            if (results[2]) {
                matcher += results[2];
            }

        }
        var dm = new RegExp(matcher);
        var result = s.match(dm);
        if (!result) return d;

        for (var i = 0; i < order.length; i++) {
            var res = result[i + 1];
            switch (order[i]) {
                case 'd':
                    d.setDate(res);
                    break;
                case 'm':
                    d.setMonth(Number(res) - 1);
                    break;
                case 'M':
                    for (var j = 0; j < abbrMonthNames.length; j++) {
                        if (abbrMonthNames[j].toLowerCase() == res) break;
                    }
                    d.setMonth(j);
                    break;
                case 'y':
                    d.setFullYear(res);
                    break;
            }
        }

        return d;
    };

    // utility method
    var _zeroPad = function(num) {
        var s = '0' + num;
        return s.substring(s.length - 2)
        //return ('0'+num).substring(-2); // doesn't work on IE :(
    };

    export var _offsetServer = 0;
    export function newSyncro() {
        var date = new Date();
        date.setTime(date.getTime() + _offsetServer);
        return date;
    }
    export function sync(url) {
        mz.xr.get(url).then(x => {
            var xhr = x.xhr;
            var date = xhr.getResponseHeader("Date") || xhr.getResponseHeader("date");

            var serverTimeMillisGMT = Date.parse(new Date(Date.parse(date)).toUTCString());
            var localMillisUTC = Date.parse(new Date().toUTCString());

            _offsetServer = serverTimeMillisGMT - localMillisUTC;

            if (mz._debug) {
                console.log('Timer sincronizados con el servidor: offset=' + _offsetServer);
                console.log('Timer local:', new Date());
                console.log('Timer remoto:', newSyncro());
            }
        });
    }
    export function parse(date: any, format?: string) {
        function parseJsonDate(d) {
            if (!d) return null;

            if (d instanceof Date)
                return new Date(d);

            //return eval("new " + d.substr(1).replace("/",""));

            if (d.indexOf("/Date(") == 0 && d.lastIndexOf("/") == (d.length - 1))
                return new Date(mz.intval(d.substr(6)));

            return new Date(d);
        }

        function convertirAFechaHora(s) {
            if (s instanceof Date)
                return s;
            var date = null;

            if (s.match(/^\d{4}([./-])\d{1,2}\1\d{1,2}[ ]\d{1,2}:\d{1,2}/)) {
                date = new Date(s);
            } else if (format && s.match(/^\d{2}([./-])\d{2}\1\d{4}[ ]\d{2}:\d{2}/) && format.startsWith('dd')) {
                var mes = s.substring(3, 5);
                var dia = s.substring(0, 2);
                var anio = s.substring(6, 10);

                if (mes > 12) {
                    var a = dia;
                    dia = mes;
                    mes = a;
                }

                var hora = s.substring(11, 13);
                var min = s.substring(14, 16);

                date = new Date(mes + "/" + dia + "/" + anio + " " + hora + ":" + min);
            } else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}[ ]\d{2}:\d{2}/)) {
                var mes = s.substring(3, 5);
                var dia = s.substring(0, 2);
                var anio = s.substring(6, 10);

                if (mes > 12) {
                    var a = dia;
                    dia = mes;
                    mes = a;
                }

                var hora = s.substring(11, 13);
                var min = s.substring(14, 16);

                date = new Date(mes + "/" + dia + "/" + anio + " " + hora + ":" + min);
            } else {
                var tmp = new Date(date);
                if (!isNaN(tmp as any)) date = tmp;
            }

            return date;
        }

        function convertirAFecha(s) {
            if (s instanceof Date)
                return s;
            var date = null;

            if (s.match(/^\d{4}([./-])\d{1,2}\1\d{1,2}/)) {
                date = new Date(s);
            } else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}/) && format && (format.startsWith('mm') || format.startsWith('mo'))) {
                var dia = s.substring(3, 5);
                var mes = s.substring(0, 2);
                var anio = s.substring(6, 10);

                if (mes > 12) {
                    var a = dia;
                    dia = mes;
                    mes = a;
                }

                date = new Date(anio, mes, dia);
            } else if (s.match(/^\d{2}([./-])\d{2}\1\d{4}/)) {
                var mes = s.substring(3, 5);
                var dia = s.substring(0, 2);
                var anio = s.substring(6, 10);

                if (mes > 12) {
                    var a = dia;
                    dia = mes;
                    mes = a;
                }

                date = new Date(anio, mes, dia);
            } else {
                var tmp = new Date(date);
                if (!isNaN(tmp as any)) date = tmp;
            }

            return date;
        }

        if (date == null)
            return null;

        if (date instanceof Date)
            return date;

        if (typeof date === 'string') {
            date = mz.trim(date);
            if (date.indexOf("/Date(") == 0 && date.lastIndexOf("/") == (date.length - 1)) {
                return parseJsonDate(date);
            } else if (date.indexOf("T") == 10 && date.lastIndexOf("Z") == (date.length - 1)) {
                let a = new Date(date);
                if (!isNaN(a as any))
                    return a;
            } else if (date.indexOf("UTC") != -1) {
                date = date.replace(/-/, "/").replace(/-/, "/");
                date = date.replace(/T/, " ").replace(/Z/, " UTC");
                date = date.replace(/([\+-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
                return new Date(date);
            } else if (date.indexOf("/") != -1) {
                if (date.indexOf(":") != -1) {
                    return convertirAFechaHora(date);
                }
                return convertirAFecha(date);
            } else {
                return new Date(date);
            }
        } else if (typeof date == "number") {
            return new Date(date);
        }

        return date;
    }

    export function add(date, intervalo, numero) {
        return this.parse(date).add(intervalo, numero);
    }

    export function fmt_date(obj_date) {
        if (obj_date === null) return '';

        if (!(obj_date instanceof Date)) {
            obj_date = this.parse(obj_date);
        }

        if (!(obj_date instanceof Date)) {
            return '';
        }

        if ('asString' in obj_date) return obj_date.asString();

        var d = obj_date.getDate();
        var m = obj_date.getMonth() + 1;
        var a = obj_date.getFullYear();

        if (m < 10) m = "0" + m.toString();
        if (d < 10) d = "0" + d.toString();

        return a.toString() + '/' + m.toString() + '/' + d.toString();
    }

    export function fmt_time(obj_date, segundos) {
        if (obj_date === null) return '';
        if (!(obj_date instanceof Date)) {
            obj_date = this.parse(obj_date);
        }

        if (!(obj_date instanceof Date)) {
            return '';
        }

        var hr = obj_date.getHours();
        var min = obj_date.getMinutes();
        var seg = obj_date.getSeconds();

        if (min < 10)
            min = "0" + min.toString();

        if (hr < 10)
            hr = "0" + hr.toString();

        if (seg < 10)
            seg = "0" + seg.toString();

        segundos = segundos || false;

        return hr.toString() + ':' + min.toString() + (segundos != false ? ":" + seg.toString() : '');
    }

    export function fmt_date_time(obj_date, segundos) {
        if (obj_date === null) return '';
        segundos = segundos || false;
        return this.fmt_date(obj_date) + ' ' + this.fmt_time(obj_date, segundos);
    }

    export function toString(date, fmt) {
        if (date && date instanceof Date) {
            return (fmt || 'yyyy/mo/dd hh:mm').replace(/(\w{4}|\w{2}|\w{1})/g, function(a) {
                return date.part(a);
            });
        } else {
            return '';
        }
    }

    export function fmt_duracion(segundos, segs) {
        segundos = Number(segundos || 0);

        var negativo = segundos < 0;

        if (negativo) segundos = -segundos;

        let h: any = Math.floor(segundos / 3600)
        let m: any = Math.floor(segundos / 60 - h * 60);
        let s: any = Math.floor(segundos % 60);

        if (m < 10) m = "0" + m.toString();
        if (s < 10) s = "0" + s.toString();
        if (h < 10) h = "0" + h.toString();

        return (negativo ? '-' : '') + (segs ? "{0}:{1}:{2}" : "{0}:{1}").format(h, m, s);
    }

    export function parseDuracion(val) {
        if (val == null || val instanceof Number) return val;

        if (typeof val == 'string' && val.indexOf(':') != -1) {
            var s = val.split(':');
            var hr = mz.intval(s[0]);

            return (hr < 0 ? -1 : 1) * Math.abs(hr) * 3600 + mz.intval(s[1]) * 60 + (s.length == 3 ? mz.intval(s[2]) : 0);
        }

        return mz.intval(val);
    }

};
