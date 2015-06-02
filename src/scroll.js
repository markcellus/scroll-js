'use strict';
var Promise = require('promise');
var animationFramePolyFill = require('./utils/request-anim-polyfill');
/**
 * Scroll class.
 * @class Scroll
 * @param {object} options - Options to pass
 * @param {HTMLElement} options.el - The element to apply scroll to
 */
var Scroll = function (options) {
    this.initialize(options);
};
Scroll.prototype = {

    /**
     * When the scroll is instantiated.
     * @memberOf Scroll
     */
    initialize: function (options) {

        this.options = options;

        if (!options.el) {
            console.error('Scroll error: element passed to Scroll constructor is ' + options.el + '! Bailing...');
        }

        this.setup();
    },

    /**
     * Sets up the polyfill for requestAnimationFrame/cancelAnimationFrame.
     * @memberOf Scroll
     */
    setup: function () {
        animationFramePolyFill();
    },

    /**
     * Scrolls the element until it's scroll properties match the coordinates provided.
     * @param {Number} x - The pixel along the horizontal axis of the element that you want displayed in the upper left.
     * @param {Number} y - The pixel along the vertical axis of the element that you want displayed in the upper left.
     * @param {Object} [options] - Scroll options
     * @param {Number} [options.duration]- The amount of time for the animation
     * @param {string} [options.easing] - The easing function to use
     * @memberOf Scroll
     * @return {Promise}
     */
    to: function (x, y, options) {
        var elem = this.options.el,
            fromY = elem.scrollTop,
            fromX = elem.scrollLeft;
        // defaults
        options = options || {};
        options.duration = options.duration || 400;

        return new Promise(function (resolve) {
            this._scroll(elem, fromY, y, 'scrollTop', Date.now(), options.duration, this._getEasing(options.easing), resolve);
        }.bind(this));
    },

    /**
     * Returns document element
     * @returns {HTMLDocument}
     */
    getDocumentElement: function () {
        return document;
    },

    /**
     * Scroll to an element.
     * @param {HTMLElement} el - The element to scroll to.
     * @param {Object} [options] - The scroll options
     */
    toElement: function (el, options) {
        var container = this.options.el,
            currentContainerScrollYPos = 0,
            elementScrollYPos =  el ? el.offsetTop : 0,
            errorMsg;

        // if the container is the document body or document itself, we'll
        // need a different set of coordinates for accuracy
        if (container === document.body) {
            // using pageYOffset for cross-browser compatibility
            currentContainerScrollYPos = window.pageYOffset;
            // must add containers scroll y position to ensure an absolute value that does not change
            elementScrollYPos = el.getBoundingClientRect().top + currentContainerScrollYPos;
        }
        if (!el) {
            errorMsg = 'The element passed to Scroll.toElement() was undefined';
            console.error(errorMsg);
            return Promise.reject(new Error(errorMsg));
        } else if (!container.contains(el)) {
            errorMsg = 'Scroll.toElement() was passed an element that does not exist inside the scroll container';
            console.warn(errorMsg);
            return Promise.reject(new Error(errorMsg));
        } else {
            return this.to(0, elementScrollYPos, options);
        }
    },

    /**
     * Does a bit of calculating and scrolls an element.
     * @param {HTMLElement} el - The element to be scrolled
     * @param {Number} from - The number of where to scroll from
     * @param {Number} to - The number of where to scroll to
     * @param {string} prop - The property to animate
     * @param {Number} startTime - The timestamp of when the animation should start
     * @param {Number} duration - The amount of time for the animation
     * @param {Function} easeFunc - The easing function to use
     * @param [callback]
     * @private
     * @memberOf Scroll
     */
    _scroll: function (el, from, to, prop, startTime, duration, easeFunc, callback) {
        requestAnimationFrame(function () {
            var currentTime = Date.now(),
                time = Math.min(1, ((currentTime - startTime) / duration));

            if (from === to) {
                return callback ? callback() : null;
            }

            this._moveElement(prop, (easeFunc(time) * (to - from)) + from);

            /* prevent scrolling, if already there, or at end */
            if (time < 1) {
                this._scroll(el, el[prop], to, prop, startTime, duration, easeFunc, callback);
            } else if (callback) {
                callback();
            }
        }.bind(this));
    },

    /**
     * Sets element's property to a value.
     * @param prop
     * @param value
     * @private
     */
    _moveElement: function (prop, value) {
        var el = this.options.el;

        el[prop] = value;

        // scroll the html element also for cross-browser compatibility
        // (ie. silly browsers like IE who need the html element to scroll too)
        if (el === document.body) {
            this.getDocumentElement().documentElement[prop] = value;
        }
    },

    /**
     * Gets an easing function based on supplied easing string.
     * @param {String} easing - The easing id
     * @returns {Function} - Returns the easing function
     * @private
     * @memberOf Scroll
     */
    _getEasing: function (easing) {
        var defaultEasing = 'linear',
            easeFunc = this._easing[easing || defaultEasing];
        if (!easeFunc) {
            console.warn('Scroll error: scroller does not support an easing option of ' + easing + '. Using "' + defaultEasing + '" instead');
            easeFunc = this._easing[easing];
        }
        return easeFunc;
    },

    /**
     * Use this to clean up the DOM when done.
     * @memberOf Scroll
     */
    destroy: function () {},

    /**
     * Easing functions.
     */
    _easing: {
        linear: function (t) { return t },
        easeInQuad: function (t) { return t*t },
        easeOutQuad: function (t) { return t*(2-t) },
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        easeInCubic: function (t) { return t*t*t },
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        easeInQuart: function (t) { return t*t*t*t },
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        easeInQuint: function (t) { return t*t*t*t*t },
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    }

};

module.exports = Scroll;