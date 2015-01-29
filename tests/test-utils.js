define(function () {

    // add polyfill for Function.bind for phantomJS (running tests headlessly)
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    var TestUtils = {

        /**
         * Creates an event.
         * @param {string} name - The event name
         * @param {object} [options] - Options to be passed to event
         */
        createEvent: function (name, options) {
            var event;
            options = options || {};
            options.bubbles = options.bubbles || false;
            options.cancelable = options.cancelable|| false;

            event = document.createEvent('CustomEvent');
            event.initCustomEvent(name, options.bubbles, options.cancelable, null);
            return event;
        }

    };

    return TestUtils;

});
