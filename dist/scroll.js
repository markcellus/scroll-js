/** 
* scroll - v0.1.0.
* https://github.com/mkay581/scroll.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
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
     * Scrolls the element until it's scroll properties match the coordinates provided.
     * @param {Number} x - The pixel along the horizontal axis of the element that you want displayed in the upper left.
     * @param {Number} y - The pixel along the vertical axis of the element that you want displayed in the upper left.
     * @param {Object} [options] - Scroll options
     * @param {Number} [options.duration]- The amount of time for the animation
     * @param {string} [options.easing] - The easing function to use
     * @param {Function} [callback] - The callback that fires when the scrolling is complete
     * @memberOf Scroll
     */
    to: function (x, y, options, callback) {
        var elem = this.options.el,
            fromY = elem.scrollTop,
            fromX = elem.scrollLeft;

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        // defaults
        options = options || {};
        options.duration = options.duration || 400;

        this._scroll(elem, fromY, y, 'scrollTop', Date.now(), options.duration, this._getEasing(options.easing), callback);
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

            // increase scrollTop or scrollLeft
            el[prop] = (easeFunc(time) * (to - from)) + from;

            /* prevent scrolling, if already there, or at end */
            if (time < 1) {
                this._scroll(el, el[prop], to, prop, startTime, duration, easeFunc, callback);
            } else if (callback) {
                callback();
            }
        }.bind(this));
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
},{}]},{},[1]);
