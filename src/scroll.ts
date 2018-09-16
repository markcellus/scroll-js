export interface ScrollToOptions extends ScrollOptions {
    top?: number;
    duration?: number;
    easing?: string
}

export function scrollTo(el: Element | Window, x: number, y: number, options?: ScrollToOptions) {

    if (!(el instanceof Element) && !(el instanceof Window)) {
        throw new Error(`element passed to scrollTo() must be either the window or a DOM element, you passed ${el}!`);
    }
    const document = getDocument();
    if (el === document.body) {
        el = document.documentElement;
    }

    options = sanitizeScrollOptions(options);

    const moveElement = (prop, value) => {
        el[prop] = value;
        // scroll the html element also for cross-browser compatibility
        // (ie. silly browsers like IE who need the html element to scroll too)
        document.documentElement[prop] = value;
    };

    const scroll = (from: number, to: number, prop: string, startTime: number, duration: number | undefined = 300, easeFunc: (time: number) => number, callback: () => void) => {
        window.requestAnimationFrame(() => {
            const currentTime = Date.now();
            const time = Math.min(1, ((currentTime - startTime) / duration));

            if (from === to) {
                return callback ? callback() : null;
            }

            moveElement(prop, (easeFunc(time) * (to - from)) + from);

            /* prevent scrolling, if already there, or at end */
            if (time < 1) {
                scroll(el[prop], to, prop, startTime, duration, easeFunc, callback);
            } else if (callback) {
                callback();
            }
        });
    };

    const currentScrollPosition = getScrollPosition(el, 'y');
    const scrollProperty = getScrollPropertyByElement(el, 'y');
    return new Promise((resolve) => {
        scroll(currentScrollPosition, y, scrollProperty, Date.now(), options.duration, getEasing(options.easing), resolve);
    });
}

export function scrollIntoView (element: HTMLElement, scroller?: Element, options?: ScrollIntoViewOptions) {
    if (scroller && !(scroller instanceof Element)) {
        options = scroller;
        scroller = undefined
    }
    options = sanitizeScrollOptions(options);
    scroller = scroller || getDocument().body;
    let currentContainerScrollYPos = 0;
    let elementScrollYPos =  element ? element.offsetTop : 0;
    let errorMsg;

    if (!element) {
        errorMsg = 'The element passed to scrollIntoView() was undefined';
        throw new Error(errorMsg);
    }

    // if the container is the document body or document itself, we'll
    // need a different set of coordinates for accuracy
    if (scroller === getDocument().body) {
        // using pageYOffset for cross-browser compatibility
        currentContainerScrollYPos = window.pageYOffset;
        // must add containers scroll y position to ensure an absolute value that does not change
        elementScrollYPos = element.getBoundingClientRect().top + currentContainerScrollYPos;
    }

    return scrollTo(scroller, 0, elementScrollYPos, options);
}


function getScrollPropertyByElement(el: Element | Window, axis: 'y' | 'x') {
    const props = {
        window: {
            y: 'scrollY',
            x: 'scrollX'
        },
        element: {
            y: 'scrollTop',
            x: 'scrollLeft'
        }
    };
    const document = getDocument();
    if (el === document.body) {
        return props.element[axis];
    } else if (el instanceof Window) {
        return props.window[axis];
    } else {
        return props.element[axis];
    }
}

function sanitizeScrollOptions(options?: ScrollToOptions): ScrollToOptions {
    if (!options) {
        return {};
    }
    if (options.behavior === 'smooth') {
        options.easing = 'ease-in-out';
        options.duration = 300;
    }
    if (options.behavior === 'instant' || options.behavior === 'auto') {
        options.duration = 0;
    }
    return options;
}

function getScrollPosition(el: Element | Window, axis: 'y' | 'x'): number {

    const document = getDocument();
    const prop = getScrollPropertyByElement(el, axis);
    if (el === document.body) {
        return document.body[prop] || document.documentElement[prop];
    } else if (el instanceof Window) {
        return window[prop];
    } else {
        return el[prop];
    }
}


function getDocument (): HTMLDocument {
    return document;
}

/**
 * Gets an easing function based on supplied easing string.
 * @param {String} easing - The easing id
 * @returns {Function} - Returns the easing function
 */
const getEasing = (easing) => {
    const defaultEasing = 'linear';
    /**
     * Map to hold easing functions.
     * @type {Object}
     */
    const animMap = {
        linear: function (t) { return t; },
        'ease-in': function (t) { return t*t; },
        'ease-out': function (t) { return t*(2-t); },
        'ease-in-out': function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; },
    };
    let easeFunc = animMap[easing || defaultEasing];
    if (!easeFunc) {
        console.debug('Scroll error: scroller does not support an easing option of ' + easing + '. Using "' + defaultEasing + '" instead');
        easeFunc = animMap[easing];
    }
    return easeFunc;
};
