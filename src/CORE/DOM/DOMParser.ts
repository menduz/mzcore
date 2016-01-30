/// <reference path="../../mz.ts" />
/// <reference path="../DOM.ts" />
namespace mz.core.dom {
	export enum AstTypes {
		root,
		directive,
		element,
		text,
		comment,
	}
	
	export class AstElement {
		type: AstTypes;
		name: string;
		data: string;
		children: AstElement[] = [];
		attrs: Dictionary<any> = {};
	}
	
	export abstract class AbstractDomParser {
		abstract parse(html: string): AstElement;
	}
}