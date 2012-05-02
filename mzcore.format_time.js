(function($) {
    // fix for IE6 suckage
    document.createElement("abbr");
    document.createElement("time");

    var vInt = 0; // this variable controls the loop
    var refresh = 1; // refresh when a time finish
    var interval = 1000; // the loop interval

    if (Object.prototype.eval) {
        window.eval = Object.prototype.eval;
    }
    delete Object.prototype.eval;     // silly Mozilla
    delete Object.prototype.valueOf;  // sorry, use Object.valueOf instead

    $.timeago = function(timestamp) {
        if (timestamp instanceof Date) return $.timeago.inWords(timestamp);
        if (typeof timestamp == "number" || typeof timestamp == "string") {
            return $.timeago.inWords(parseDate(timestamp));
        }
        else return $.timeago.inWords($.timeago.datetime(timestamp));
    };
    var $t = $.timeago;


    var NuevasSettings = {
        refreshMillis: 30000,
        allowFuture: false,
        strings: {
            instante: "hace un instante",
            secs: "Hace {sa} segundos",
            min: "Hace un minuto",
            mins: "Hace {ma} minutos",
            hora: "Hace una hora",
            horas: "Hace {ha} horas",
            ayer: "Ayer a las {h}:{m}",
            pocos_dias: "El {dd} a las {h}:{m}", // 
            este_ano: "El {d} de {MM} a las {h}:{m}",
            muchos_anos: "El {d} de {MM} del {y}"// a las {h}:{m}
        },
        meses: {
            0: 'Enero',
            1: 'Febrero',
            2: 'Marzo',
            3: 'Abril',
            4: 'Mayo',
            5: 'Junio',
            6: 'Julio',
            7: 'Agosto',
            8: 'Septiembre',
            9: 'Octubre',
            10: 'Noviembre',
            11: 'Diciembre'
        },
        dias: {
            0: 'Lunes',
            1: 'Martes',
            2: 'Miércoles',
            3: 'Jueves',
            4: 'Viernes',
            5: 'Sabado',
            6: 'Domingo'
        }
    };

    //copy_properties(NuevasSettings, idioma["TIEMPOS"]);

    $.extend($.timeago, {
        settings: NuevasSettings,
        inWords: function(date) {
            var $l = this.settings.strings;
            var distanceMillis = (new Date()).getTime() - date.getTime();

            var seconds = distanceMillis / 1000;
            seconds = Math.floor(seconds);
            var minutes = seconds / 60;

            var hours = minutes / 60;
            minutes = Math.floor(minutes);
            var days = hours / 24;
            hours = Math.floor(hours);
            var years = days / 365;
            days = Math.floor(days);
            years = Math.floor(years);

            var to_sprint = {
                s: date.getSeconds(),
                m: date.getMinutes(),
                h: date.getHours(),
                dd: idioma["TIEMPOS_CHICOS"].dias[date.getDay()],
                mm: date.getMonth(),
                MM: idioma["TIEMPOS_CHICOS"].meses[date.getMonth()],
                y: date.getYear(),
                sa: Math.round(seconds % 60),
                ma: minutes % 60,
                ha: hours,
                d: date.getDate()
            };

            if (years > 0) return _tx($l.muchos_anos, to_sprint);
            if (days > 7) return _tx($l.este_ano, to_sprint);
            if (days > 1) return _tx($l.pocos_dias, to_sprint);
            if (days == 1) return _tx($l.ayer, to_sprint);
            if (hours > 1) return _tx($l.horas, to_sprint);
            if (hours == 1) return _tx($l.hora, to_sprint);
            if (minutes > 1) return _tx($l.mins, to_sprint);
            if (minutes == 1) return _tx($l.min, to_sprint);
            if (seconds <= 10) return _tx($l.instante, to_sprint);
            return _tx($l.secs, to_sprint);
        },
        datetime: function(elem) {
            if (elem) {
                var e = elem instanceof jQuery ? elem : $(elem);
                
                if (!!e.attr("timestamp")) 
                    return parseDate(intval(e.attr("timestamp")));

                if (!!e.attr("datetime")) 
                    return parseDate( e.attr("datetime") );
                
                if (!!e.attr("title")) 
                    return parseDate( e.attr("title") );   
                    
                return parseDate( e.html() );
            }
        }
    });

    // this function autostarts the infinite loop, every second, triggers the countdown fn
    jQuery.autotimeago = function() {
        $('.timestamp').timeago(); // trigger the fn
        setInterval("$('.timestamp').timeago();", $.timeago.settings.refreshMillis); // set the loop
    }

    $.fn.timeago = function(force) {
        return this.each(function() {
            var self = $(this);
            
            var date = self.data("date");
            
            if (!date || force) {

                date = $.timeago.datetime(self);
                
                if(isNaN(date)) return;
                
                self.data("date", date);
                
                var text = $.trim(self.html());
                
                var tt = format_date_time(date,true);
                
                if (text.length > 0) 
                    self.attr("title", text);

                self.hover(function() {
                    self.html(tt);
                }, function() {
                    self.html(self.attr("title"));
                });
            }
            
            var t = $t.inWords(date);
            
            self.text(t);
            self.attr("title", t);

        });
    };


    // this function autostarts the infinite loop, every second, triggers the countdown fn
    jQuery.autocountdown = function() {
        $('.countdown').countdown(); // trigger the fn
        vInt = setInterval("$('.countdown').countdown();", interval); // set the loop
    }

    


    // countdown function, update second-by-second the time to finish
    jQuery.fn.countdown = function(options) {
        var defaults = {  // set up default options
            refresh: 1, 	 // refresh when a time finish
            interval: 1000, // the loop interval
            cdClass: 'countdown', // the class to apply this plugin
            granularity: 5,

            label: ['Semanas ', 'd  ', 'hs ', ':', ''],
            units: [604800, 86400, 3600, 60, 1]
        };
        if (options && options.label) {
            $.extend(defaults.label, options.label);
            delete options.label;
        }
        if (options && options.units) {
            $.extend(defaults.units, options.units);
            delete options.units;
        }
        $.extend(defaults, options);

        // pad fn, add left zeros to the string
        var pad = function(value, length) {
            value = String(value);
            length = parseInt(length) || 2;
            while (value.length < length)
                value = "0" + value;
            if (value < 1) value = "00";
            return value;
        };

        var format_interval = function(timestamp) {
            var label = defaults.label;
            var units = defaults.units;
            var granularity = defaults.granularity;

            output = '';
            for (i = 1; i <= units.length; i++) {
                value = units[i];
                if (timestamp >= value) {
                    var val = pad(Math.floor(timestamp / value), 2);
                    val = val > 0 ? val : '00';
                    output += val + label[i];
                    timestamp %= value;
                    granularity--;
                }
                else if (value == 1) output += '00'; // we need the final seconds to allways show 00, i.e., 03:00

                if (granularity == 0)
                    break;
            }

            if (output.length < 3) output = '00:' + output;
            return output ? output : '00:00';
        }

        // the countdown core
        return this.each(function() {
            secs = $(this).attr('secs');
            $(this).html(format_interval(secs));
            secs--;

            if (secs < 1) {
                $(this).attr('secs', '...');
                clearInterval(vInt);
                if (refresh)
                    window.location.href = window.location.href;
            } else
                $(this).attr('secs', secs);

        });

    }
})(jQuery);