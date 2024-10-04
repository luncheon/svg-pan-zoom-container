export interface ZoomOptions {
    readonly origin?: {
        readonly clientX: number;
        readonly clientY: number;
    };
    readonly minScale?: number;
    readonly maxScale?: number;
}
export declare const getScale: (container: HTMLElement) => number;
export declare const setScale: (container: HTMLElement, value: number, options?: ZoomOptions) => void;
export declare const resetScale: (container: HTMLElement) => void;
export declare const zoom: (container: HTMLElement, ratio: number, options?: ZoomOptions) => void;
