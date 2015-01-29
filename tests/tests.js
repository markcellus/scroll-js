"use strict";

// set config options
require.config({
    'baseUrl': '../',
    'paths': {
        qunit: 'tests/libs/qunit/qunit-require',
        sinon: 'tests/libs/sinon/sinon',
        'test-utils': 'tests/libs/test-utils'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        }
    }
});

// require each test
require([
    'tests/scroll-tests'
], function() {

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

    QUnit.config.requireExpects = true;
    QUnit.start();
});