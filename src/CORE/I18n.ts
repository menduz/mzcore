/// <reference path="../mz.ts" />

module mz {
    export interface I18nTranslate {
        ( claveIdioma: string, defaultValue?: string ): string;
    }

    export interface I18nTranslate {
        faltantes?: any;
        idioma?: any;
    }

    var mzLang = ( <any>mz ).mzLang || {};

    var idioma = globalContext.idioma = globalContext.idioma || {};

    var erroresEncontradosIdioma = {};

    var ñ_privada: I18nTranslate = function ñ( claveIdioma: string, defaultValue?: string ) {
        if ( !( claveIdioma in idioma ) ) {
            if ( claveIdioma in mzLang )
                return idioma[claveIdioma] = mzLang[claveIdioma];
            if ( !( claveIdioma in erroresEncontradosIdioma ) ) {
                ( <any>mz )._debug && console.warn( 'ñ: ' + claveIdioma, defaultValue );
                erroresEncontradosIdioma[claveIdioma] = defaultValue || claveIdioma;
                idioma[claveIdioma] = defaultValue || claveIdioma;
            }
        }
        return idioma[claveIdioma];
    }

    ñ_privada.faltantes = erroresEncontradosIdioma;
    ñ_privada.idioma = idioma;

    export var ñ = globalContext.ñ = ñ_privada;
} 

declare var ñ: mz.I18nTranslate;