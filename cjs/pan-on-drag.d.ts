export interface PanOnDragOptions {
    readonly button: 'left' | 'right';
    readonly modifier?: 'Alt' | 'Control' | 'Meta' | 'Shift';
}
export declare const panOnDrag: (attributeName: string, defaultOptions: PanOnDragOptions) => void;
