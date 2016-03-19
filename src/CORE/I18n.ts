/// <reference path="../mz.ts" />

module mz {
    export interface I18nTranslate {
        ( localeId: string, defaultValue?: string ): string;
    }

    export interface I18nTranslate {
        missing?: any;
        dictionary?: any;
    }

    var mzLang = ( <any>mz ).mzLang || {};

    var dictionary = globalContext.idioma = globalContext.idioma || {};

    var erroresEncontradosIdioma = {};

    export var translate: I18nTranslate = function ( localeId: string, defaultValue?: string ) {
        if ( !( localeId in dictionary ) ) {
            if ( localeId in mzLang )
                return dictionary[localeId] = mzLang[localeId];
            if ( !( localeId in erroresEncontradosIdioma ) ) {
                ( <any>mz )._debug && console.warn( 'Missing translation: ' + localeId, defaultValue );
                erroresEncontradosIdioma[localeId] = defaultValue || localeId;
                dictionary[localeId] = defaultValue || localeId;
            }
        }
        return dictionary[localeId];
    }

    translate.missing = erroresEncontradosIdioma;
    translate.dictionary = dictionary;

    globalContext["ñ"] = translate;
} 

declare var ñ: mz.I18nTranslate;