/// <reference path="MVCObject.ts" />
/// <reference path="../mz.ts" />

namespace mz {

    export class Collection<T> extends MVCObject implements IForEachable<T> {
        opciones: IMZCollectionOpc = {};

        protected array: T[];
        private __indice__: Dictionary<number> = {};

        static EVENTS = copy({
            BeforeClearCollection: 'pre_clear',
            AfterClearCollection: 'clear',
            Changed: 'changed',
            ElementInserted: 'insert_at',
            ElementChanged: 'set_at',
            ElementRemoved: 'remove_at',
            ElementRangeInserted: 'addRange',
            CollectionSorted: 'sorted',
            ElementRangeRemoved: 'removed'
        }, MVCObject.EVENTS);

        @MVCObject.proxy
        agregandoLote: boolean = false;

        constructor(base?: T[], opc?: IMZCollectionOpc) {
            super();
            this.opciones = opc || {};

            this.array = (this.opciones.initialSize ? new Array(this.opciones.initialSize) : new Array());

            base && this.addRange(base);
        }


        first(): T {
            return this.array[0];
        }
        last(): T {
            if (this.array.length)
                return this.array[this.array.length - 1];
        }
        /**
        Limpia la coleccion
        @method clear
        @param {Boolean} noTriggerear si es "true" entonces no se desencadena ningun evento del tipo "changed"
        */
        clear(noTriggerear?: boolean) {
            this.trigger(Collection.EVENTS.BeforeClearCollection, !!noTriggerear);
            this.array.length = 0;
            this.__indice__ = {};
            this.trigger(Collection.EVENTS.AfterClearCollection, !!noTriggerear);
            !noTriggerear && this.emit(Collection.EVENTS.Changed, 'clear', !!noTriggerear);
        }
        /**
        Tamaño de la coleccion (getter)
        @property length
        */
        get length() {
            return this.array.length;
        }
        /**
        Tamaño de la coleccion (setter)
        @property length
        */
        set length(value) {
            if (isNaN(value) || value < 0) throw new TypeError();
            this.setLength(value);
        }

        getLength() {
            return this.array.length;
        }

        setLength(nuevoTamanio: number) {
            if (nuevoTamanio < 0) throw "Tamanio invalido";
            if (this.getLength() > nuevoTamanio) {
                while (this.getLength() > nuevoTamanio) {
                    this.pop();
                }
            } else {
                this.array.length = nuevoTamanio;
            }
            this.emit(Collection.EVENTS.Changed, 'length', this.array.length);
            return this;
        }

        /**
	    The map() method creates a new array with the results of calling a provided function on every element in this array.
	    El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
	    @method map
	    @param {Function} callback función que se va a ejecutar, a esta function se le pasa 1 argumento, el elemento de la coleccion que se esta iterando
	    */
        map<J>(func: (elem: T) => J, thisp?: any): Collection<J> {
            var thisp = arguments[1] || this;

            var coll = new Collection<J>();

            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && coll.push(func.call(thisp, this.array[i]));

            return coll;
        };
        /**
	    The forEach() method executes a provided function once per array element.
	    El contexto "this" es el segundo argumento si se especifica, sino es la coleccion
	    @method forEach
	    @param {Function|MzDelegate} callback función que se va a ejecutar, a esta function se le pasan 2 argumentos, el elemento de la coleccion que se esta iterando y el indice (zero based) dentro de la coleccion.
	    */
        forEach(func: (elem: T, index: number) => void, thisp?: any): void {
            var thisp = arguments[1] || this;

            if ('forEach' in this.array) {
                this.array.forEach(func, thisp);
            } else {
                for (var i = 0; i < this.array.length; i++)
                    (i in this.array) && typeof this.array[i] != 'undefined' && func.call(thisp, this.array[i], i);
            }
        }
        
        /**
         * Basicamente lo que hace esta funcion es ejecutar lotes asincronicos que diren X tiempo cada uno, es util para procesar grandes cantidades de informacion y darle un feedback al usuario sin bloquear la pantalla.
         * Si iterationDurationMs es 0, entonces utiliza setImmediate y el tiempo de cada iteracion se setea en 32ms
         */
        asyncForEach(func: (elem: T, index: number) => void, iterationDurationMs?: number): void {
            if (this.array.length) {
                var items = this.array.concat();

                var that = this;

                var timerFn = iterationDurationMs <= 0 ? setImmediate : setTimeout;

                if (iterationDurationMs <= 0) iterationDurationMs = 32;

                iterationDurationMs = Math.abs(iterationDurationMs || 32);

                var i = 0;


                function sch() {
                    timerFn(function() {
                        var start = mz.now();
                        while (mz.now() - start < iterationDurationMs && items.length) {
                            func.call(that, items.shift(), i);
                            i++;
                        }
                        if (items.length) sch();
                    }, iterationDurationMs);
                }

                sch();
            }
        }

        private _indizar(elem, index) {
            if (this.opciones.key) {
                if (!(this.opciones.key in elem)) throw "No tiene la clave primaria";
                if (typeof elem[this.opciones.key] != 'undefined') {
                    this.__indice__[elem[this.opciones.key]] = index;
                }
            }
        }
        private _deindizar(elem) {
            if (this.opciones.key) {
                if (typeof elem[this.opciones.key] != 'undefined') {
                    if (elem[this.opciones.key] in this.__indice__) {
                        delete this.__indice__[elem[this.opciones.key]];
                    }
                }
            }
        }
        protected _reindizar() {
            if (this.opciones.key) {
                this.__indice__ = {};
                var that = this;
                this.forEach(function(e, i) {
                    if (e && typeof e[that.opciones.key] != 'undefined') {
                        that.__indice__[e[that.opciones.key]] = i;
                    }
                });
            }
        }
        
        
        /**
	    Obtiene el elemento en la posicion "index" de la coleccion
	    @method getAt
	    @param {Number} index
	    */
        getAt(index: number): T {
            return this.array[index];
        }

        reduce<U>(fn: (prev: U, curr: T, index: number, array: T[]) => U, initialValue?: U): U {
            return this.array.reduce(fn, initialValue);
        }
        /**
	    Agrupa los elementos de la colección.
	    Si "what" es tipo String, entonces va a asumir que es un campo y va a agrupar por ese campo.
	    Si "what" es tipo Function, va a evaluar la función por cada elemento de la colección y agrupa por el resultado.

	    Este método devuelve un objeto tipo Diccionario con el criterio de evaluación como clave y una coleccion de elementos como value
	    @method groupBy
	    @param {Mixed} what
	    */
        groupBy(what: ((T) => string) | string): Dictionary<Collection<T>> {
            var fn;

            if (typeof what != 'function') {
                throw new TypeError();
            } else {
                fn = what;
            }

            if (!fn) return {};

            var output: Dictionary<Collection<T>> = {};

            this.forEach(function(e) {
                var g = fn(e);
                if (g) {
                    if (g in output) {
                        output[g].push(e);
                    } else {
                        output[g] = new Collection<T>([e], this.opciones);
                    }
                }
            });

            return output;
        }
        /**
        Obtiene la key de la coleccion
        @property key
        */
        get key() {
            return this.opciones && this.opciones.key;
        }
        /**
	    Inserta un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "insert_at"
	    @method insertAt
	    @param {Number} indice
	    @param {Mixed} elemento
	    */
        insertAt(indice: number, elemento: T): void {
            if (this.opciones.key) {
                if (!(this.opciones.key in elemento)) {
                    console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                    return;
                }

                if (elemento[this.opciones.key] in this.__indice__) {
                    console.error('El elemento insertado ya existe en la coleccion ' + this.opciones.key + "=" + elemento[this.opciones.key]);
                    return;
                }
            }

            if (indice == this.array.length) {
                this.array.push(elemento);
                this._indizar(elemento, indice);
            } else {
                var fin = this.array.splice(indice);
                this.array.push(elemento);
                this.array = this.array.concat(fin);
                this._reindizar();
                this.emit(Collection.EVENTS.CollectionSorted);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
            }

            this.emit(Collection.EVENTS.ElementInserted, indice, elemento);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementInserted, indice, elemento);
        }
        /**
	    Remueve un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "remove_at"
	    @method removeAt
	    @param {Number} indice
	    @param {Mixed} elemento
	    */
        removeAt(indice: number): T {
            var backup = this.array[indice];
            this.array.splice(indice, 1);
            this._reindizar();
            this.emit(Collection.EVENTS.ElementRemoved, indice, backup);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRemoved, indice, backup);
            return backup;
        }
        /**
	    Cambia un elemento en cualquier posicion de la coleccion. Dispara evento "changed" con los mismos argumentos que el evento "set_at"
	    @method set_at
	    @param {Number} indice
	    @param {Mixed} elemento
	    */
        setAt(indice: number, elemento: T): void {
            var backup = this.array[indice];
            this._deindizar(backup);
            this.array[indice] = elemento;
            this._indizar(elemento, indice);
            this.emit(Collection.EVENTS.ElementChanged, indice, elemento, backup);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementChanged, indice, elemento, backup);
        }


        /**
	    Inserta un elemento al final de la colección. Dispara evento "insert_at" y "changed" con los mismos argumentos
	    @method push
	    @param {Mixed} elemento
	    @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
	    */
        push(elemento: T, noTriggerear?: boolean): number {
            var indice = -1;

            if (this.opciones.key) {
                if (!(this.opciones.key in elemento)) {
                    console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                    return indice;
                }

                if (elemento[this.opciones.key] in this.__indice__) {
                    console.error('El elemento insertado ya existe en la coleccion ' + this.opciones.key + "=" + elemento[this.opciones.key]);
                    return indice;
                }
            }

            indice = this.array.push(elemento) - 1;

            try {
                this._indizar(elemento, indice);
            } catch (e) {
                this.array.pop();
                console.error('El elemento insertado no tiene el campo ' + this.opciones.key);
                return -1;
            }

            if (!noTriggerear) {
                this.emit(Collection.EVENTS.ElementInserted, indice, elemento);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementInserted, indice, elemento);
            }

            return indice;
        }
        insert = this.push;
        /**
	    Quita el elemento al final de la colección. Dispara evento "remove_at" y "changed" con los mismos argumentos
	    @method pop
	    @param {Bool} noTriggerear si == 'true' entonces no se dispara ningún evento.
	    */
        pop(noTriggerear?: boolean): T {
            if (this.array.length > 0) {
                var ret = this.array.pop();
                this._deindizar(ret);

                if (!noTriggerear) {
                    this.emit(Collection.EVENTS.ElementRemoved, this.array.length, ret);
                    this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRemoved, this.array.length, ret);
                }
                return ret;
            }
            return null;
        }



        addRange(array: T[] | Collection<T>, noTriggerearCadaUno?: boolean, noTriggerear?: boolean) {
            if (!array) return this;

            var inicio = this.array.length - 1;

            this.agregandoLote = true;

            if (Object.prototype.toString.call(array).toLowerCase() === "[object array]" || array instanceof Collection) {
                if ('forEach' in array && typeof array.forEach == 'function') {
                    var that = this;
                    array.forEach(function(elem) {
                        that.push(elem, noTriggerearCadaUno);
                    });
                } else {
                    for (var i = 0; i < array.length; i++)
                        this.push(array[i], noTriggerearCadaUno);
                }
            } else {
                for (let i in array)
                    this.push(array[i], noTriggerearCadaUno);
            }



            if (!noTriggerear) {
                this.emit(Collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRangeInserted, inicio, this.array.length - 1, !noTriggerearCadaUno);
            }

            this.agregandoLote = false;

            return this;
        }

        /**
        Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
        Estos desencadenan los eventos "set_at" y "changed".

        Si la coleccion tiene Key entonces busca en el indice. no importa que no sea el mismo elemento. De otro modo busca la referencia a ese elemento.

        @method update
        @param {Mixed} elemento El elemento a ser actualizado
        */
        update(elemento: T) {
            var indice = -1;

            if (this.opciones.key && this.opciones.key in elemento && elemento[this.opciones.key] in this.__indice__ && this.array[indice = this.__indice__[elemento[this.opciones.key]]] === elemento) {
                return this.updateIndex(indice);
            }

            return this.updateIndex(this.indexOf(elemento));
        }
        /**
	    Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
	    Estos desencadenan los eventos "set_at" y "changed".

	    @method updateByKey
	    @param {String} key clave a ser buscada en el índice interno
	    */
        updateByKey(key: string) {
            if (this.opciones.key && key in this.__indice__) {
                return this.updateIndex(this.__indice__[key]);
            }
        }
        /**
	    Cuando se actualiza un valor en la colección y se quiere informar, se invoca a un método "update", "updateByKey" o "updateIndex".
	    Estos desencadenan los eventos "set_at" y "changed".

	    @method updateIndex
	    @param {Nuber} indice ïndice del elemento a ser actualizado
	    */
        updateIndex(index: number) {
            if (index != -1) {
                var elemento = this.getAt(index);
                this.emit(Collection.EVENTS.ElementChanged, index, elemento, elemento);
                this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementChanged, index, elemento, elemento);
            }
            return this;
        }

        join(delimitador: string) {
            return this.array.join(delimitador);
        }

        /**
        Suma elementos
        @method sum
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        sum(options: {
            /// columna por la cual se va a agrupar
            groupBy: string; 
            /// exclude
            exclude?: string[];
            /// Si se quiere sumar campos específicos, se pasan los nombres en forma de array.
            filtroCampos?: string[];
        }): Dictionary<any> {
            var result = [];

            var groupByField = options.groupBy || null;

            var sumarizarSubSet = function(col) {
                var out = null;
                var cant = 0;



                col.forEach(function(elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!options || ((!options.filtroCampos || options.filtroCampos.indexOf(i) != -1) && (!options.exclude || options.exclude.indexOf(i) == -1)))) {
                                out[i] = (out[i] || 0) + elem[i];
                            }
                        }
                        out['[[cantidad]]']++;
                    } else {
                        out = {};

                        Object.defineProperty(out, '[[cantidad]]', {
                            enumerable: false,
                            get: function() { return cant; },
                            set: function(value) { cant = value }
                        });

                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!options || ((!options.filtroCampos || options.filtroCampos.indexOf(i) != -1) && (!options.exclude || options.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                        out['[[cantidad]]'] = 1;
                    }
                });
                return out;
            }

            if (groupByField == null)
                return sumarizarSubSet(this);

            var subsets = this.groupBy(groupByField);

            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }

            return result;
        }
        
        
        /**
	     *	Simplemente ordena la colección. "what" puede tener cualquiera de estos formatos
	     *		'Campo ASC, CampoB DESC'
	     *		function(a, b) { return (a.Campo > b.Campo ? 1 : - 1) }
	     *		'Campo'
	     *
	     *
	     *	@method orderBy
	     *	@param {Mixed} what
	     */


        orderBy(what: ((a: T, b: T) => number) | string) {

            var orderBy = what ? mz.data.order.build(what) : undefined;

            this.array.sort(orderBy);
            this._reindizar();

            this.emit(Collection.EVENTS.CollectionSorted, what, 'ASC');
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, what);

            return this;
        }
        orderByDesc(what: ((a: T, b: T) => number) | string) {
            var fn = what ? mz.data.order.build(what) : null;

            if (fn) {
                this.array.sort(function(a, b) {
                    return -fn(a, b)
                });
            } else {
                this.array.sort();
                this.array.reverse();
            }

            this._reindizar();

            this.emit(Collection.EVENTS.CollectionSorted, what, 'DESC');
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, what);
            return this;
        }

        /**
        Devuelve true si hay algun elemento que cumpla con la condición
        @method some
        @param {Function} condicion
        */
        some(condition: (elem: T) => boolean): boolean {
            if ('some' in this.array)
                return this.array.some(condition);

            for (var i = 0; i < this.array.length; i++)
                if (i in this && condition.call(arguments[1], this[i], i, this))
                    return true;

            return false;
        }

        /**
	     *	Devuelve una coleccion de elementos que cumplan con la condición. También se puede llamar usando dos argumentos
	     *			.where('Campo', 3)
	     *	Y va a devolver una colección con todos los elementos de la primera que tengan Campo == 3
	     *	@method where
	     *	@param {Function} condicion
	     */

        where(campoOCondicion: string | ((elemento: T) => boolean), valorCampo?: any) {
            if (typeof campoOCondicion === "string") {
                var arr = new Collection<T>();

                for (var i = 0; i < this.array.length; i++)
                    if ((i in this.array) && this.array[i][campoOCondicion] == arguments[1])
                        arr.push(this.array[i]);

                return arr;
            } else {
                if (this.array.filter)
                    return new Collection<T>(this.array.filter(campoOCondicion));

                var arr = new Collection<T>();

                for (var i = 0; i < this.array.length; i++)
                    if ((i in this.array) && campoOCondicion(this.array[i]))
                        arr.push(this.array[i]);

                return arr;
            }
        }

        /**
	    Remueve un elemento buscandolo por clave
	    @method removeByKey
	    @param {String} key
	    */
        removeByKey(key: string): T {
            var indice = this.indexedGetIndex(key);
            if (indice != -1)
                return this.removeAt(indice);
        }

        /**
	    Remueve el elemento pasado, o varios elementos en base a una condición.

	    - Si se pasa el elemento para remover && la colección tiene clave primaria se va a remover por clave y no por referencia del objeto.
	    - Si se pasa uno solo y hay varios elementos que matchean o esta repetido en la colección se va a remover el ultimo.
	    - De esta forma se desencadena el evento "remove_at" y "changed" con los mismos argumentos

	    Si se pasa una cóndición, el método devuelve una colección con los elementos quitados.

	    - De esta forma se desencadena el evento "removed" y "changed" con los mismos argumentos

	    @method remove
	    @param {Mixed} condicion/elemento
	    */
        remove(condicion: ((elemento: T) => boolean) | T): T[] {
            let fn = condicion;
            var tipo = typeof fn;

            if (arguments.length == 1) {
                var cual = -1;

                if (this.opciones.key && this.opciones.key in fn) {
                    cual = this.indexedGetIndex(fn[this.opciones.key]);
                    if (cual !== -1 && fn !== this.getAt(cual)) {
                        cual = -1;
                    }
                }

                if (cual == -1)
                    cual = this.lastIndexOf(fn as T);

                if (cual != -1) {
                    return [this.removeAt(cual)];
                }

                if (tipo == 'object' || tipo == 'number' || tipo == 'boolean') return null;
            }

            if (tipo === 'function') {
                var sacadas = [];

                for (var i = 0; i < this.array.length; i++) {
                    if (i in this.array) {
                        if ((condicion as any)(this.array[i])) {
                            sacadas.push({
                                i: i,
                                e: this.array[i]
                            });
                        }
                    }
                }

                var that = this;
                var salida = [];

                if (sacadas.length) {
                    sacadas.forEach(function(e) {
                        that.remove(e.e);
                        salida.push(e.e);
                    });

                    this.emit(Collection.EVENTS.ElementRangeRemoved, salida);
                    this.emit(Collection.EVENTS.Changed, Collection.EVENTS.ElementRangeRemoved, salida);
                }

                return salida;
            }
        }

        /**
	    Obtiene el primer elemento que matchee con la condición.
	    También se puede llamar usando dos argumentos '.single('idEmpresa', 5)' y va a traer el primer elemento con idEmpresa == 5
	    @method single
	    @param {Mixed} condicion/campo
	    @param {Mixed} equals
	    @optional
	    */
        single(condicion: ((elemento: T) => boolean)): T;
        single(field: ((elemento: T) => boolean) | string, value?: any): T {
            if (arguments.length == 2 && typeof field == "string") {
                //Busco por el indice
                if (this.opciones.key) {
                    if (field === this.opciones.key) {
                        if (arguments[1] in this.__indice__) {
                            var tmp = this.array[this.__indice__[arguments[1]]];
                            if (tmp && tmp[field as string] == arguments[1]) return tmp;
                        }
                    }
                }

                for (var i = 0; i < this.array.length; i++)
                    if (this.array[i] && this.array[i][field as string] == arguments[1])
                        return this.array[i];
            } else {


                for (var i = 0; i < this.array.length; i++)
                    if (this.array[i] && (field as any)(this.array[i]))
                        return this.array[i];
            }
            return null;
        }

        /**
	    Devuelve true si la coleccion contiene el elemento (busca por referencia, tiene que ser EL MISMO)
	    @method contains
	    @param {Object} elemento
	    */
        contains(elem: T): boolean {
            return this.array.indexOf(elem) != -1;
        }

        /**
	    Devuelve true si la coleccion contiene la clave
	    @method containsKey
	    @param {String} key
	    */
        containsKey(key: string): boolean {
            if (this.opciones.key) {
                return (key in this.__indice__);
            } else {
                throw "La coleccion no tiene key";
            }
        }

        /**
	    Devuelve el indice de la primer ocurrencia del elemento. Si no lo encuentra devuelve -1
	    @method indexOf
	    @param {Object} elemento
	    */
        indexOf(elem: T): number { return this.array.indexOf(elem); }

        /**
	    Devuelve el indice de la última ocurrencia del elemento. Si no lo encuentra devuelve -1
	    @method lastIndexOf
	    @param {Object} elemento
	    */
        lastIndexOf(elem: T): number { return this.array.lastIndexOf(elem); }
        /**
	    Crea un array y lo llena con el contenido de la colección
	    @method toArray
	    */
        toArray(): T[] {
            var t = [];

            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && t.push(this.array[i]);

            return t;
        }

        /**
	    Clona la colección. Las referencias a los objetos van a ser las mismas.
	    @method clone
	    */
        clone() {
            var coll = new Collection<T>(null, mz.copy(this.opciones));

            for (var i = 0; i < this.array.length; i++)
                (i in this.array) && coll.push(this.array[i]);

            return coll;
        }

        /**
	    Obtiene un elemento buscando en el indice interno por clave primaria
	    @method indexedGet
	    @param {String} key
	    */
        indexedGet(key: string | number): T {
            if (this.opciones.key) {
                if (key in this.__indice__)
                    return this.array[this.__indice__[key]];
            }
            return null;
        }

        /**
	    Obtiene el índice un elemento buscando en el indice interno por clave primaria
	    @method indexedGetIndex
	    @param {String} key
	    */
        indexedGetIndex(key: string | number): number {
            if (this.opciones.key) {
                if (key in this.__indice__)
                    return this.__indice__[key];
            }
            return -1;
        }

        /**
	    Hace un merge de un elemento dentro de la colección. Busca el elemento por clave primaria y actualiza sus prupiedades copiandole los nuevos campos. Si no lo encuentra lo inserta.
	    @method mergeElem
	    @param {Object} elem
	    */
        mergeElem(elem: T | any): T {
            if (this.opciones.key) {
                if (!(this.opciones.key in elem)) {
                    throw new Error("El elemento no contiene la clave primaria");
                }

                var indice = this.indexedGetIndex(elem[this.opciones.key]);

                if (indice != -1) {
                    mz.copy(this.array[indice], elem);
                    this.updateIndex(indice);
                    return this.array[indice];
                } else {
                    this.push(elem);
                    return elem;
                }
            }
        }

        /**
            Buscar el o los elementos mas grandes
            @method max
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        max(opc: {
            groupBy: string,
            filtroCampos?: string[],
            exclude?: string[]
        }) {
            var result = [];

            var groupByField = opc.groupBy || null;

            var sumarizarSubSet = function(col) {
                var out = null;
                col.forEach(function(elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                if (elem[i] != null && (!(i in out) || out[i] < elem[i]))
                                    out[i] = elem[i];
                            }
                        }
                    } else {
                        out = {};
                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                    }
                });
                return out;
            }

            if (groupByField == null)
                return sumarizarSubSet(this);

            var subsets = this.groupBy(groupByField);

            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }

            return result;
        }
        /**
            Buscar el o los elementos mas chicos
            @method min
            @param {Mixed} opciones
            @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
            @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
            @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
            */
        min(opc: {
            groupBy: string,
            filtroCampos?: string[],
            exclude?: string[]
        }) {
            var result = [];

            var groupByField = opc.groupBy || null;

            var sumarizarSubSet = function(col) {
                var out = null;
                col.forEach(function(elem) {
                    if (out) {
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (typeof out[i] == 'number' || typeof out[i] == 'undefined') && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                if (elem[i] != null && (!(i in out) || out[i] > elem[i]))
                                    out[i] = elem[i];
                            }
                        }
                    } else {
                        out = {};
                        groupByField && (out[groupByField] = elem[groupByField]);
                        for (var i in elem) {
                            if (groupByField != i && typeof elem[i] == 'number' && (!opc || ((!opc.filtroCampos || opc.filtroCampos.indexOf(i) != -1) && (!opc.exclude || opc.exclude.indexOf(i) == -1)))) {
                                out[i] = elem[i];
                            }
                        }
                    }
                });
                return out;
            }

            if (groupByField == null)
                return sumarizarSubSet(this);

            var subsets = this.groupBy(groupByField);

            for (var i in subsets) {
                result.push(sumarizarSubSet(subsets[i]));
            }

            return result;
        }
	
        /**
        Promedio de los elementos.
    
        Cada elemento de el array de retorno tiene además la propiedad '[[cantidad]]' que indica la cantidad de elementos de ese subconjunto.
        @method avg
        @param {Mixed} opciones
        @param {Mixed} opciones.groupBy Si se van a agrupar los elementos
        @param {Array de strings} opciones.exclude Si no se quiere sumarizar algunos campos
        @param {Array de strings} opciones.filtroCampos Si se quiere especificar en cuales campos se va a sumarizar
        */
        avg(opc) {
            var that = this;
            var suma = this.sum(opc);
            for (var fila in suma) {
                for (var campo in suma[fila]) {
                    if (campo == '[[cantidad]]' || campo == opc.groupBy) continue;
                    suma[fila][campo] /= suma[fila]['[[cantidad]]'];
                }
            }
            return suma;
        }


        take(cantidad: number, from: number = 0) {
            var ret = [];

            this.takeInto(ret, cantidad, from);

            return ret;
        }

        takeInto(destino: { push: (any) => void }, cantidad: number, from: number = 0) {
            var hasta = Math.min(this.array.length + cantidad, this.array.length);
            from = mz.intval(from);

            var outer_i = 0;

            for (var i = from; i < hasta; i++)
                destino.push(this.array[i]);

            return this;
        }

        swapItems(primero: number, segundo: number) {
            var viejo = this.array[segundo];
            this.array[segundo] = this.array[primero];
            this.array[primero] = viejo;
            this._reindizar();
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
            this.emit(Collection.EVENTS.Changed, 'swap', primero, segundo);
            return this;
        }


        count(groupBy: string | Function) {
            var fn;

            if (typeof groupBy == 'function') {
                fn = groupBy;
            }

            var result = [];
            var that = this;

            if (fn) {
                var grupos = {};

                this.forEach(function(elem) {
                    var gb = fn(elem);
                    if (!(gb in grupos)) {
                        var obj = {
                            'Count': 0
                        };
                        obj['[[cantidad]]'] = 0;
                        grupos[gb] = obj;
                    }
                    grupos[gb]['[[cantidad]]']++;
                });

                for (var i in grupos) {
                    grupos[i].Count = grupos[i]['[[cantidad]]'];
                    grupos[i][groupBy.toString()] = i;
                    result.push(grupos[i]);
                }
            } else {
                var out = {
                    Count: 0
                };

                out['[[cantidad]]'] = this.array.length;

                out.Count = out['[[cantidad]]'];

                result.push(out);
            }

            return result;
        }
        
        /** Reverses the actual collections order */
        reverse() {
            this.array.reverse();
            this.emit(Collection.EVENTS.CollectionSorted);
            this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted);
        }
        

        /**
         * Mergea una colección contra un array o colección. cuando eliminarNoMatcheados == true, Hace una intersección 
         * - Merged = (Original ∈ New) + (New ∉ Original)
         * En todos los casos se va a llamar un evento changed del tipo insert_at, set_at o remove_at dependiendo de la operación.
         */
        mergeArray(array: T[] | any[] | Collection<T>, eliminarNoMatcheados?: boolean): { added: T[]; removed: T[] } {
            var ret = {
                added: [],
                removed: [],
                merged: []
            };
            if (this.opciones.key) {
                var keys = {};
                
                //array.forEach(function(elem, index) {
                for (var index in array) {
                    let elem = array[index];
                    if (!(this.opciones.key in elem)) {
                        throw new TypeError("El elemento no contiene la clave primaria");
                    }

                    var indice = this.indexedGetIndex(elem[this.opciones.key]);

                    keys[elem[this.opciones.key]] = true;

                    if (indice != -1) {
                        mz.copy(this.array[indice], elem);
                        this.updateIndex(indice);
                        ret.merged.push(this.array[indice]);
                    } else {
                        this.push(elem);
                        ret.added.push(elem);
                    }
                }
                //});

                if (eliminarNoMatcheados) {
                    ret.removed = this.remove((elem: T) => {
                        return !(elem[this.opciones.key] in keys);
                    });
                }
            } else console.error("You cannot mergeArray if the collection does not have 'key'")
            return ret;
        }

        createView() {
            return new CollectionView<T>(this, mz.copy(this.opciones));
        }
        
        /**
         * Usar con cuidado.
         */
        getPrivateArray(): T[] { return this.array; }
    }


    export class CollectionView<T> extends Collection<T> {
        constructor(base: Collection<T>, opc: IMZCollectionOpc) {
            super(null, opc);


            this.set('filter', null);

            this.set('order', null);

            this.on('order_changed', (nuevo, viejo) => {
                this._handleChanged('order', nuevo, viejo);
            });

            this.attachTo(base);
        }

        private filter_changed(nuevo, viejo) {
            nuevo = nuevo || null;
            if (nuevo != null && typeof nuevo !== "function") throw mz.MVCObject.Exception_RollbackOperation;
            this._handleChanged('filter', nuevo, viejo);
            return nuevo;
        }

        private _handleChanged(tipo, nuevo, viejo) {
            var necesitoReOrdenar = tipo == 'order' || tipo == Collection.EVENTS.CollectionSorted || tipo == 'insert_at' || tipo == 'set_at' || tipo == 'addRange';

            if (tipo == 'clear') {
                this.clear();
                necesitoReOrdenar = false;
            }

            if (tipo == 'addRange' || tipo == 'filter') {
                this._remake();
                necesitoReOrdenar = true;
            }

            if (necesitoReOrdenar) {
                this.resort();
            }
        }

        private _remake(noTriggerear?: boolean) {
            if (this.key) {
                if (this.get('parent')) {
                    var arr = this.get('parent').getPrivateArray();

                    var filtro = this.get('filter');
                    let newArray = [];

                    if (filtro) {
                        for (let i = 0; i < arr.length; i++) {
                            if (filtro(arr[i]))
                                newArray.push(arr[i]);
                        }
                    } else
                        newArray = arr;

                    if (newArray.length == 0 && this.length != 0) {
                        this.clear();
                        return;
                    }

                    let result = this.mergeArray(newArray, true);

                    // if we do not add any values, then tecnically we dont have to resort the array in case of deterministic sorts
                    if (!result.added || !result.added.length) return;
                } else {
                    this.clear();
                }
            } else {
                this.clear(noTriggerear);

                if (this.get('parent')) {
                    var arr = this.get('parent').getPrivateArray();

                    var filtro = this.get('filter');

                    if (filtro) {
                        for (let i = 0; i < arr.length; i++) {
                            if (filtro(arr[i]))
                                this.push(arr[i], noTriggerear);
                        }
                    } else {
                        for (let i = 0; i < arr.length; i++) {
                            this.push(arr[i], noTriggerear);
                        }
                    }
                }
            }

            this.resort();
        }

        resort() {
            var orden = this.get('order');

            if (orden) {
                var vieja = [];

                for (var i in this.array) vieja[i] = this.array[i];

                var fn = orden.q ? mz.data.order.build(orden.q) : null;

                if (fn) {
                    if (orden.desc)
                        this.array.sort(function(a, b) {
                            return -fn(a, b)
                        });
                    else
                        this.array.sort(fn);
                } else {
                    this.array.sort();
                    orden.desc && this.array.reverse();
                }

                for (var i in this.array) {
                    if (this.array[i] !== vieja[i]) {
                        this._reindizar();
                        this.emit(Collection.EVENTS.CollectionSorted, orden.q, orden.desc ? 'DESC' : 'ASC');
                        this.emit(Collection.EVENTS.Changed, Collection.EVENTS.CollectionSorted, orden.q);
                        break;
                    }
                }
            }
        }
        refresh() {
            this._remake();
        }
        filter(filter: (elem: T) => boolean) {
            this.set('filter', filter && filter.bind(this) || null);
            return this;
        }
        orderBy(q) {
            this.set('order', {
                q: q,
                desc: false
            });
            return this;
        }
        orderByDesc(q) {
            this.set('order', {
                q: q,
                desc: true
            });
            return this;
        }
        attachTo(obj: Collection<T>) {
            this.detach();
            this.set('bindeosParent', []);
            this.set('parent', obj);
            if (obj) {
                var that = this;

                this.key = obj.key;

                this.get('bindeosParent').push(obj.on(Collection.EVENTS.AfterClearCollection, function() {
                    that.clear();
                }));

                this.get('bindeosParent').push(
                    obj.on(Collection.EVENTS.BeforeClearCollection, function(noPropagado) {
                        that.trigger(CollectionView.EVENTS.BeforeClearCollection, noPropagado);
                    })
                );

                this.get('bindeosParent').push(
                    obj.on('changed', function(tipo, a1, a2) {
                        if ((tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged) && obj.agregandoLote) return;

                        var filter = that.get('filter');

                        if (tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged || tipo == Collection.EVENTS.ElementRemoved) {
                            var indice = that.indexOf(a2);
                            if (!filter || filter(a2)) {
                                switch (tipo) {
                                    case Collection.EVENTS.ElementInserted:
                                        if (indice == -1) {
                                            that.push(a2);
                                            that.resort();
                                        }
                                        return;
                                    case Collection.EVENTS.ElementChanged:

                                        if (indice != -1) {
                                            that.updateIndex(indice);
                                        } else {
                                            that.push(a2);
                                        }

                                        that.resort();

                                        return;
                                    case Collection.EVENTS.ElementRemoved:
                                        if (indice != -1) {
                                            that.removeAt(indice);
                                            return;
                                        }
                                }
                            } else {
                                if (indice != -1) {
                                    that.removeAt(indice);
                                    return;
                                }
                            }
                        }

                        if (tipo == 'refresh') {
                            that._remake();
                            return;
                        }

                        that._handleChanged.apply(that, arguments);
                    })
                );

                this._remake();
            }
        }
        detach() {
            if (this.get('bindeosParent') && this.get('parent')) {
                this.clear();

                var bindeos = this.get('bindeosParent');

                for (var i in bindeos) bindeos[i].off();

                bindeos.length = 0;

                this.set('bindeosParent', null);
                this.set('parent', null);
            }
        }
    }
/*

    export class CollectionRange<T> extends Collection<T> {

        @CollectionRange.proxy
        start: number = 0;

        @CollectionRange.proxy
        quantity: number = Infinity;

        private end: number;

        start_changed(val, prevVal) {
            if (val === prevVal)
                throw CollectionRange.Exception_PreventPropagation;
            val = parseInt(val);
            if (isNaN(val))
                throw CollectionRange.Exception_RollbackOperation;
            if (val < 0) val = 0;
            this.end = val + this.quantity;
            return val;
        }

        quantity_changed(val, prevVal) {
            if (val === prevVal)
                throw CollectionRange.Exception_PreventPropagation;
            val = parseInt(val);
            if (isNaN(val))
                throw CollectionRange.Exception_RollbackOperation;
            if (val < 1) val = 1;
            this.end = val + this.quantity;
            return val;
        }

        constructor(base: Collection<T>, opc: IMZCollectionOpc) {
            super(null, opc);

            this.attachTo(base);
        }

        private _handleChanged(tipo, nuevo, viejo) {
            var necesitoReOrdenar = tipo == 'order' || tipo == Collection.EVENTS.CollectionSorted || tipo == 'insert_at' || tipo == 'set_at' || tipo == 'addRange';

            if (tipo == 'clear') {
                this.clear();
                necesitoReOrdenar = false;
            }

            if (tipo == 'addRange' || tipo == 'filter') {

                necesitoReOrdenar = true;
            }
        }

        attachTo(obj: Collection<T>) {
            this.detach();
            this.set('bindeosParent', []);
            this.set('parent', obj);
            if (obj) {
                var that = this;

                this.key = obj.key;

                this.get('bindeosParent').push(obj.on(Collection.EVENTS.AfterClearCollection, function() {
                    that.clear();
                }));

                this.get('bindeosParent').push(
                    obj.on(Collection.EVENTS.BeforeClearCollection, function(noPropagado) {
                        that.trigger(CollectionView.EVENTS.BeforeClearCollection, noPropagado);
                    })
                );

                this.get('bindeosParent').push(
                    obj.on('changed', function(tipo, a1, a2) {
                        if ((tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged) && obj.agregandoLote) return;

                        var filter = that.get('filter');

                        if (tipo == Collection.EVENTS.ElementInserted || tipo == Collection.EVENTS.ElementChanged || tipo == Collection.EVENTS.ElementRemoved) {
                            var indice = that.indexOf(a2);
                            if (!filter || filter(a2)) {
                                switch (tipo) {
                                    case Collection.EVENTS.ElementInserted:
                                        if (indice == -1) {
                                            that.push(a2);
                                        }
                                        return;
                                    case Collection.EVENTS.ElementChanged:

                                        if (indice != -1) {
                                            that.updateIndex(indice);
                                        } else {
                                            that.push(a2);
                                        }


                                        return;
                                    case Collection.EVENTS.ElementRemoved:
                                        if (indice != -1) {
                                            that.removeAt(indice);
                                            return;
                                        }
                                }
                            } else {
                                if (indice != -1) {
                                    that.removeAt(indice);
                                    return;
                                }
                            }
                        }

                        if (tipo == 'refresh') {
                            that._remake();
                            return;
                        }

                        that._handleChanged.apply(that, arguments);
                    })
                );

                this._remake();
            }
        }
        detach() {
            if (this.get('bindeosParent') && this.get('parent')) {
                this.clear();

                var bindeos = this.get('bindeosParent');

                for (var i in bindeos) bindeos[i].off();

                bindeos.length = 0;

                this.set('bindeosParent', null);
                this.set('parent', null);
            }
        }
    }
*/
    export interface IMZCollectionOpc {
        key?: string;
        initialSize?: number;
    }
}