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

    export var translate: I18nTranslate = function ( claveIdioma: string, defaultValue?: string ) {
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

    translate.faltantes = erroresEncontradosIdioma;
    translate.idioma = idioma;

    globalContext["ñ"] = translate;
} 

declare var ñ: mz.I18nTranslate;