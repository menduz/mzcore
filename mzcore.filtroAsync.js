/// <reference path="mzcore.js" />

mz.add_prop("worker", {
    filtrar: function (fn, filtro, datos, callback) {
        if (mz.browser_caps.webworkers) {
            console.log("Inicio filtro worker");
            var worker = new Worker('javaScript/workers/worker_filtro.js'),
            message = {
                fn: fn.toString(),
                data: datos,
                filtro: filtro
            };

            worker.addEventListener('message', function (event) {
                callback(event.data);
                worker.terminate();
            }, false);

            worker.postMessage(JSON.stringify(message));

            return worker;
        } else {
            console.log("Inicio filtro comun");

            var result = [];

            for (var i in datos)
                if (fn(datos[i], filtro))
                    result.push(datos[i]);

            callback(result);
            return null;
        }
    }
});
