declare type EasingOptions = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
export interface ScrollToCustomOptions extends ScrollToOptions {
    duration?: number;
    easing?: EasingOptions;
}
export declare function scrollTo(el: Element | Window, options?: ScrollToCustomOptions): Promise<unknown>;
export declare function scrollIntoView(element: HTMLElement, scroller?: Element | ScrollIntoViewOptions, options?: ScrollIntoViewOptions): Promise<unknown>;
export declare const utils: {
    getDocument(): HTMLDocument;
};
declare type EasingFunction = (t: number) => number;
interface EasingFunctions {
    linear: EasingFunction;
    'ease-in': EasingFunction;
    'ease-out': EasingFunction;
    'ease-in-out': EasingFunction;
}
export declare const easingMap: EasingFunctions;
export {};
