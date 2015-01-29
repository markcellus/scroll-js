define(function () {

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
