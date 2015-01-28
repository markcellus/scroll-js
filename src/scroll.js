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
        initialize: function () {
        },

        /**
         * Sets up the kit on an element.
         * @memberOf Scroll
         */
        setup: function (el) {
        },
        /**
         * Use this to clean up the DOM when done.
         * @memberOf Scroll
         */
        destroy: function () {}
    };

    return Scroll;

}));