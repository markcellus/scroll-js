export interface ScrollToCustomOptions extends ScrollToOptions {
    duration?: number;
    easing?: string;
}

export function scrollTo(
    el: Element | Window,
    options?: ScrollToCustomOptions
) {
    if (!(el instanceof Element) && !(el instanceof Window)) {
        throw new Error(
            `element passed to scrollTo() must be either the window or a DOM element, you passed ${el}!`
        );
    }
    const document = utils.getDocument();
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

    const scroll = (
        from: number,
        to: number,
        prop: string,
        startTime: number,
        duration: number | undefined = 300,
        easeFunc: (time: number) => number,
        callback: () => void
    ) => {
        window.requestAnimationFrame(() => {
            const currentTime = Date.now();
            const time = Math.min(1, (currentTime - startTime) / duration);

            if (from === to) {
                return callback ? callback() : null;
            }

            moveElement(prop, easeFunc(time) * (to - from) + from);

            /* prevent scrolling, if already there, or at end */
            if (time < 1) {
                scroll(
                    el[prop],
                    to,
                    prop,
                    startTime,
                    duration,
                    easeFunc,
                    callback
                );
            } else if (callback) {
                callback();
            }
        });
    };

    const currentScrollPosition = getScrollPosition(el, 'y');
    const scrollProperty = getScrollPropertyByElement(el, 'y');
    return new Promise(resolve => {
        scroll(
            currentScrollPosition,
            options.top,
            scrollProperty,
            Date.now(),
            options.duration,
            getEasing(options.easing),
            resolve
        );
    });
}

export function scrollIntoView(
    element: HTMLElement,
    scroller?: Element,
    options?: ScrollIntoViewOptions
) {
    validateElement(element);
    if (scroller && !(scroller instanceof Element)) {
        options = scroller;
        scroller = undefined;
    }
    const { top, duration, easing } = sanitizeScrollOptions(options);
    scroller = scroller || utils.getDocument().body;
    let currentContainerScrollYPos = 0;
    let elementScrollYPos = element ? element.offsetTop : 0;

    // if the container is the document body or document itself, we'll
    // need a different set of coordinates for accuracy
    if (scroller === utils.getDocument().body) {
        // using pageYOffset for cross-browser compatibility
        currentContainerScrollYPos = window.pageYOffset;
        // must add containers scroll y position to ensure an absolute value that does not change
        elementScrollYPos =
            element.getBoundingClientRect().top + currentContainerScrollYPos;
    }

    return scrollTo(scroller, {
        top: elementScrollYPos,
        left: 0,
        duration,
        easing
    });
}

function validateElement(element?: HTMLElement) {
    if (element === undefined) {
        const errorMsg =
            'The element passed to scrollIntoView() was undefined.';
        throw new Error(errorMsg);
    }
    if (!(element instanceof HTMLElement)) {
        throw new Error(
            `The element passed to scrollIntoView() must be a valid element. You passed ${element}.`
        );
    }
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
    const document = utils.getDocument();
    if (el === document.body) {
        return props.element[axis];
    } else if (el instanceof Window) {
        return props.window[axis];
    } else {
        return props.element[axis];
    }
}

function sanitizeScrollOptions(
    options?: ScrollToCustomOptions
): ScrollToCustomOptions {
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
    const document = utils.getDocument();
    const prop = getScrollPropertyByElement(el, axis);
    if (el === document.body) {
        return document.body[prop] || document.documentElement[prop];
    } else if (el instanceof Window) {
        return window[prop];
    } else {
        return el[prop];
    }
}

export const utils = {
    // we're really just exporting this so that tests can mock the document.documentElement
    getDocument(): HTMLDocument {
        return document;
    }
};

/**
 * Gets an easing function based on supplied easing string.
 * @param {String} easing - The easing id
 * @returns {Function} - Returns the easing function
 */
const getEasing = easing => {
    const defaultEasing = 'linear';
    /**
     * Map to hold easing functions.
     * @type {Object}
     */
    const animMap = {
        linear(t: number) {
            return t;
        },
        'ease-in'(t: number) {
            return t * t;
        },
        'ease-out'(t: number) {
            return t * (2 - t);
        },
        'ease-in-out'(t: number) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
    };
    let easeFunc = animMap[easing || defaultEasing];
    if (!easeFunc) {
        console.warn(
            'Scroll error: scroller does not support an easing option of ' +
                easing +
                '. Using "' +
                defaultEasing +
                '" instead'
        );
        easeFunc = animMap[easing];
    }
    return easeFunc;
};
