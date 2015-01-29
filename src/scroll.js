(function (factory) {
    'use strict';
    // support both AMD and non-AMD
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.Scroll = factory();
    }
})((function () {
    'use strict';

    /**
     * Merges the contents of two or more objects.
     * @param {object} obj - The target object
     * @param {...object} - Additional objects who's properties will be merged in
     */
    function extend(target) {
        var merged = target,
            source, i;
        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    merged[prop] = source[prop];
                }
            }
        }
        return merged;
    }

    /**
     * Scroll class.
     * @class Scroll
     * @param {object} options - Options to pass
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
                console.error('Scroll error: there was no element passed to new Scroll() instantiation! Bailing...');
            }

            this.setup();
        },

        /**
         * Sets up the polyfill for requestAnimationFrame/cancelAnimationFrame.
         * @memberOf Scroll
         */
        setup: function () {
            var x = 0,
                lastTime = 0,
                vendors = ['ms', 'moz', 'webkit', 'o'];

            for (0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                            callback(currTime + timeToCall);
                        },
                        timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        },

        /**
         * Scrolls the browser to the supplied pos vertically.
         * @param {Number} x - The pixel along the horizontal axis of the element that you want displayed in the upper left.
         * @param {Number} y - The pixel along the vertical axis of the element that you want displayed in the upper left.
         * @param {Object} [options] - Scroll options
         * @param {Number} [options.duration]- The amount of time for the animation
         * @param {string} [options.easing] - The easing function to use
         * @param {Function} [callback] - The callback that fires when the scrolling is complete
         * @memberOf Scroll
         */
        to: function (x, y, options, callback) {
            var start = Date.now(),
                elem = this.options.el,
                from = elem.scrollTop;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            /* prevent scrolling, if already there */
            if (from === y) {
                callback ? callback() : null;
                return;
            }

            // defaults
            options.duration = options.duration || 400;

            requestAnimationFrame(function () {
                this._scroll(elem, from, y, start, options.duration, this._getEasing(options.easing), callback);
            }.bind(this));
        },

        /**
         * Calculates where to actually move the element that is being scrolled.
         * @param {HTMLElement} el - The element to be scrolled
         * @param {Number} from - The number of where to scroll from
         * @param {Number} to - The number of where to scroll to
         * @param {Number} startTime - The timestamp of when the animation should start
         * @param {Number} duration - The amount of time for the animation
         * @param {Function} easeFunc - The easing function to use
         * @param [callback]
         * @private
         * @memberOf Scroll
         */
        _scroll: function (el, from, to, startTime, duration, easeFunc, callback) {
            var currentTime = Date.now(),
                time = Math.min(1, ((currentTime - startTime) / duration));

            el.scrollTop = (easeFunc(time) * (to - from)) + from;

            if (time < 1) {
                requestAnimationFrame(function () {
                    this._scroll(el, el.scrollTop, to, startTime, duration, easeFunc, callback);
                }.bind(this));
            } else if (callback) {
                callback();
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

    return Scroll;

}));