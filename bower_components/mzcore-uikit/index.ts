mz.loadCss(module.getPath('./uikit.css'));

export * from './mz-sidebar';
export * from './mz-autocomplete';
export * from './mz-tabs';

@MzClear.Template('<div style="clear:both" />')
@MzClear.ConfigureUnwrapped
@MzClear.RegisterComponent('clear')
export class MzClear extends mz.Widget {}