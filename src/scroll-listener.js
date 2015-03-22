'use strict';
var _ = require('underscore');
var animationFramePolyFill = require('./utils/request-anim-polyfill');
/**
 * @constructor ScrollListener
 * @description Allows any element's scroll to be listened to
 * @param options
 * @param {HTMLElement} options.el - The element of which scrolling should be listened
 * @param {Number} [options.offsetTop] - How many pixels from the top of the element to include in evaluation
 * @param {Number} [options.offsetRight] - How many pixels from the right of the element to include in evaluation
 * @param {Number} [options.offsetBottom] - How many pixels from the bottom of the element to include in evaluation
 * @param {Number} [options.offsetLeft] - How many pixels from the left of the element to include in evaluation
 * @param {Function} [options.onEnter] - Callback triggered when any piece of the element (including its offsets) starts entering the viewport
 * @param {Function} [options.onEntered] - Callback triggered when all of the element (including its offsets) has entered the viewport
 * @param {Function} [options.onExit] - Callback triggered when any piece of the element (including its offsets) leaves the viewport
 * @param {Function} [options.onExited] - Callback triggered when the element in its entirety (including its offsets) leaves the viewport
 * @param {HTMLElement} [options.container] - The container of the viewport (document is used by default)
 */
var ScrollListener = function (options) {
    this.initialize(options);
};
ScrollListener.prototype = {

    initialize: function (options) {
        this.options = _.extend({
            el: null,
            offsetTop: 0,
            offsetRight: 0,
            offsetLeft: 0,
            offsetBottom: 0,
            container: document
        }, options);

        animationFramePolyFill();
        this._bindScrollListener();
    },

    /**
     * Adds a listener to the document's scroll event.
     */
    _bindScrollListener: function () {
        var self = this;
        // assigning self so we can reference same function when removing event listener.
        this._scrollEventListener = function (e) {
            self._onScroll(e);
        };
        this.options.container.addEventListener('scroll', this._scrollEventListener, false);
    },

    /**
     * Removes listener on the document's scroll event.
     */
    _unbindScrollListener: function () {
        this.options.container.removeEventListener('scroll', this._scrollEventListener, false);
    },

    /**
     * When the user has scrolled.
     * @private
     */
    _onScroll: function () {
        this._animationFrame = window.requestAnimationFrame(function () {
            if (this.isElementInsideView()) {
                this._onElementInsideView();
            } else {
                this._onElementOutsideView();
            }
        }.bind(this));
    },

    /**
     * Gets the container's scroll top position.
     * @returns {Number}
     */
    getContainerScrollYPos: function () {
        var container = this.options.container;
        // using pageYOffset for cross-browser compatibility
        return container === document ? window.pageYOffset : container.scrollTop;
    },

    /**
     * Checks whether element is inside of the user's view.
     * @returns {boolean}
     */
    isElementInsideView: function () {
        var currentContainerYScrollPos = this.getContainerScrollYPos(),
            minPos = this.getElementMinYPos(),
            maxPos = this.getElementMaxYPos() + this.getViewportHeight();
        return currentContainerYScrollPos >= minPos && currentContainerYScrollPos <= maxPos;
    },

    /**
     * Triggered as user scrolls while element is in user's view.
     * @private
     */
    _onElementInsideView: function () {
        if (!this._showing) {
            this._showing = true;
            if (this.options.onEnter) {
                this.options.onEnter(this.options.el);
            }
        }
    },

    /**
     * Triggered as user scrolls while element is not in user's view.
     * @private
     */
    _onElementOutsideView: function () {
        if (this._showing) {
            this._showing = false;
            if (this.options.onExit) {
                this.options.onExit(this.options.el);
            }
        }
    },

    /**
     * Returns the number of pixels the top portion of the element is from the top of its container element.
     * @returns {number}
     */
    getElementMinYPos: function () {
        if (!this._elementMinYPos) {
            var // must add viewport scroll position to getBoundingClientRect get a constant, absolute value
                elementYPos = this.getElementYPos();
            this._elementMinYPos = elementYPos - this.getViewportHeight() - this.options.offsetTop;
        }
        return this._elementMinYPos;
    },

    /**
     * Returns the amount of pixels the element is from the top of the container.
     * @returns {number}
     */
    getElementYPos: function () {
        var container = this.options.container,
            elementYPos = container.scrollTop;
        if (container === document) {
            // must add viewport scroll position to getBoundingClientRect get a constant, absolute value
            elementYPos = this.options.el.getBoundingClientRect().top + this.getContainerScrollYPos();
        }
        return elementYPos;
    },

    /**
     * Returns the number of pixels the bottom portion of the element is from the top of its container element.
     * @returns {number}
     */
    getElementMaxYPos: function () {
        if (!this._elementMaxYPos) {
            var el = this.options.el;
            this._elementMaxYPos = this.getElementMinYPos() + el.offsetHeight + this.options.offsetBottom;
        }
        return this._elementMaxYPos;
    },

    /**
     * Returns the height of the viewport.
     * @returns {Number}
     */
    getViewportHeight: function () {
        if (!this._vpHeight) {
            var viewport = this.options.container;
            this._vpHeight = viewport === document ? window.innerHeight : viewport.offsetHeight;
        }
        return this._vpHeight;
    },

    /**
     * Unbinds event listeners and removes animation frames.
     */
    destroy: function () {
        this._unbindScrollListener();
        window.cancelAnimationFrame(this._animationFrame);
    }
};

module.exports = ScrollListener;