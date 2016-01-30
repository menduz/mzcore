/// <reference path="Widget.ts" />



declare namespace JSX {

    interface Element extends mz.Widget { }
    interface ElementClass extends mz.Widget {
        //render(): JSX.Element;
    }
    interface ElementAttributesProperty { props: {}; }

    interface IntrinsicElements {
        // HTML
        a: mz.Widget.HTMLAttributes;
        abbr: mz.Widget.HTMLAttributes;
        address: mz.Widget.HTMLAttributes;
        area: mz.Widget.HTMLAttributes;
        article: mz.Widget.HTMLAttributes;
        aside: mz.Widget.HTMLAttributes;
        audio: mz.Widget.HTMLAttributes;
        b: mz.Widget.HTMLAttributes;
        base: mz.Widget.HTMLAttributes;
        bdi: mz.Widget.HTMLAttributes;
        bdo: mz.Widget.HTMLAttributes;
        big: mz.Widget.HTMLAttributes;
        blockquote: mz.Widget.HTMLAttributes;
        body: mz.Widget.HTMLAttributes;
        br: mz.Widget.HTMLAttributes;
        button: mz.Widget.HTMLAttributes;
        canvas: mz.Widget.HTMLAttributes;
        caption: mz.Widget.HTMLAttributes;
        cite: mz.Widget.HTMLAttributes;
        code: mz.Widget.HTMLAttributes;
        col: mz.Widget.HTMLAttributes;
        colgroup: mz.Widget.HTMLAttributes;
        data: mz.Widget.HTMLAttributes;
        datalist: mz.Widget.HTMLAttributes;
        dd: mz.Widget.HTMLAttributes;
        del: mz.Widget.HTMLAttributes;
        details: mz.Widget.HTMLAttributes;
        dfn: mz.Widget.HTMLAttributes;
        dialog: mz.Widget.HTMLAttributes;
        div: mz.Widget.HTMLAttributes;
        dl: mz.Widget.HTMLAttributes;
        dt: mz.Widget.HTMLAttributes;
        em: mz.Widget.HTMLAttributes;
        embed: mz.Widget.HTMLAttributes;
        fieldset: mz.Widget.HTMLAttributes;
        figcaption: mz.Widget.HTMLAttributes;
        figure: mz.Widget.HTMLAttributes;
        footer: mz.Widget.HTMLAttributes;
        form: mz.Widget.HTMLAttributes;
        h1: mz.Widget.HTMLAttributes;
        h2: mz.Widget.HTMLAttributes;
        h3: mz.Widget.HTMLAttributes;
        h4: mz.Widget.HTMLAttributes;
        h5: mz.Widget.HTMLAttributes;
        h6: mz.Widget.HTMLAttributes;
        head: mz.Widget.HTMLAttributes;
        header: mz.Widget.HTMLAttributes;
        hr: mz.Widget.HTMLAttributes;
        html: mz.Widget.HTMLAttributes;
        i: mz.Widget.HTMLAttributes;
        iframe: mz.Widget.HTMLAttributes;
        img: mz.Widget.HTMLAttributes;
        input: mz.Widget.HTMLAttributes;
        ins: mz.Widget.HTMLAttributes;
        kbd: mz.Widget.HTMLAttributes;
        keygen: mz.Widget.HTMLAttributes;
        label: mz.Widget.HTMLAttributes;
        legend: mz.Widget.HTMLAttributes;
        li: mz.Widget.HTMLAttributes;
        link: mz.Widget.HTMLAttributes;
        main: mz.Widget.HTMLAttributes;
        map: mz.Widget.HTMLAttributes;
        mark: mz.Widget.HTMLAttributes;
        menu: mz.Widget.HTMLAttributes;
        menuitem: mz.Widget.HTMLAttributes;
        meta: mz.Widget.HTMLAttributes;
        meter: mz.Widget.HTMLAttributes;
        nav: mz.Widget.HTMLAttributes;
        noscript: mz.Widget.HTMLAttributes;
        object: mz.Widget.HTMLAttributes;
        ol: mz.Widget.HTMLAttributes;
        optgroup: mz.Widget.HTMLAttributes;
        option: mz.Widget.HTMLAttributes;
        output: mz.Widget.HTMLAttributes;
        p: mz.Widget.HTMLAttributes;
        param: mz.Widget.HTMLAttributes;
        picture: mz.Widget.HTMLAttributes;
        pre: mz.Widget.HTMLAttributes;
        progress: mz.Widget.HTMLAttributes;
        q: mz.Widget.HTMLAttributes;
        rp: mz.Widget.HTMLAttributes;
        rt: mz.Widget.HTMLAttributes;
        ruby: mz.Widget.HTMLAttributes;
        s: mz.Widget.HTMLAttributes;
        samp: mz.Widget.HTMLAttributes;
        script: mz.Widget.HTMLAttributes;
        section: mz.Widget.HTMLAttributes;
        select: mz.Widget.HTMLAttributes;
        small: mz.Widget.HTMLAttributes;
        source: mz.Widget.HTMLAttributes;
        span: mz.Widget.HTMLAttributes;
        strong: mz.Widget.HTMLAttributes;
        style: mz.Widget.HTMLAttributes;
        sub: mz.Widget.HTMLAttributes;
        summary: mz.Widget.HTMLAttributes;
        sup: mz.Widget.HTMLAttributes;
        table: mz.Widget.HTMLAttributes;
        tbody: mz.Widget.HTMLAttributes;
        td: mz.Widget.HTMLAttributes;
        textarea: mz.Widget.HTMLAttributes;
        tfoot: mz.Widget.HTMLAttributes;
        th: mz.Widget.HTMLAttributes;
        thead: mz.Widget.HTMLAttributes;
        time: mz.Widget.HTMLAttributes;
        title: mz.Widget.HTMLAttributes;
        tr: mz.Widget.HTMLAttributes;
        track: mz.Widget.HTMLAttributes;
        u: mz.Widget.HTMLAttributes;
        ul: mz.Widget.HTMLAttributes;
        "var": mz.Widget.HTMLAttributes;
        video: mz.Widget.HTMLAttributes;
        wbr: mz.Widget.HTMLAttributes;
    }
}

// Since Typescript does not allow custom Hyperscript definition yet.. We have to hack react

declare type WidgetsType = mz.Widget | string | mz.widgets.TextNode;
declare type WidgetCtor = typeof mz.Widget;

interface T { props: any; }

namespace React {
    export function createElement(
        type: string | WidgetCtor,
        props?: any,
        ...children: WidgetsType[]): mz.Widget {
        let ctor: WidgetCtor = null;

        if (typeof type == "string") {
            ctor = (<any>mz).widgets.BaseElement;
            let typeStr = (<string>type).toLowerCase();

            if (typeStr in mz.widgets)
                ctor = mz.widgets[typeStr];

            if (props && (<any>props) instanceof Array && !children)
                children = <any>props;
            props = null;
        } else ctor = <any>type;

        return new ctor(null, props || {}, <any>children || [])
    }
    
    export var __spread = mz.copy;
}

namespace mz {
    /**
     * Hyperscript for JSX or TSX
     */
    export function h(componentName: string, attr?: Dictionary<any>, ...children: any[]): Widget {
        var clase = (<any>mz).widgets.BaseElement;
        componentName = componentName.toLowerCase();

        if (componentName in widgets)
            clase = widgets[componentName];

        if (attr && (<any>attr) instanceof Array && !children)
            attr = <any>children;

        return new clase(null, attr || {}, children || []);
    }
}