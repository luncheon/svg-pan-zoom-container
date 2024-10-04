export declare const clamp: (value: number, min: number, max: number) => number;
export declare const getScaleAndOffset: (container: Element, content: HTMLElement | SVGElement) => [number, number, number];
export declare const setScaleAndOffset: (container: Element, content: HTMLElement | SVGElement, scale: number, offsetX: number, offsetY: number) => void;
export declare const parseOptions: (optionsString: string | undefined | null) => Record<string, string>;
export declare const findTargetAndParseOptions: (element: Element | null, attributeName: string) => [HTMLElement, Record<string, string>] | [];
