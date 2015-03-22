'use strict';
var sinon = require('sinon');
var assert = require('assert');
var ScrollListener = require('../src/scroll-listener');

describe('Scroll Listener', function () {
    var requestAnimationFrameStub;

    beforeEach(function () {
        // phantomjs doesnt have requestAnimationFrame implemented... *eye roll*
        // so use polyfill setTimeout
        if (!window.requestAnimationFrame) {
            requestAnimationFrameStub = sinon.stub(window, 'setTimeout');
        } else {
            requestAnimationFrameStub = sinon.stub(window, 'requestAnimationFrame');
        }
    });

    afterEach(function () {
        requestAnimationFrameStub.restore();
    });

    it('should fire onEnterView callback when container\'s scrollTop position + its height reaches the top of the element', function() {
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        var scrollListener = new ScrollListener({el: outerEl});
        document.body.removeChild(outerEl);
    });
});

