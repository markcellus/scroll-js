'use strict';
var sinon = require('sinon');
var assert = require('assert');
var TestUtils = require('test-utils');
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

    it('should not fire onEnterView callback if element is out of view upon instantiation', function() {
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup outer element
        outerEl.style.overflow = 'hidden'; // make it scrollable
        outerEl.style.height = '150px';
        outerEl.style.width = '10px';
        // inner element
        innerEl.style.top = '300px'; // move element out of view
        innerEl.style.width = '10px';
        innerEl.style.height = '150px';
        // setup current scroll position
        outerEl.scrollTop = 0;
        var onEnterSpy = sinon.spy();
        var scrollListener = new ScrollListener({
            el: outerEl,
            container: outerEl,
            onEnter: onEnterSpy
        });
        assert.equal(onEnterSpy.callCount, 0, 'onEnter callback was not fired upon instantiation because element is out of view');
        scrollListener.destroy();
        document.body.removeChild(outerEl);
    });

    it('should not fire onEnterView callback if element is in view upon instantiation', function() {
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup outer element
        outerEl.style.overflow = 'hidden'; // make it scrollable
        outerEl.style.height = '150px';
        outerEl.style.width = '10px';
        // inner element
        innerEl.style.top = '0px'; // move element into view
        innerEl.style.width = '10px';
        innerEl.style.height = '150px';
        // setup current scroll position
        outerEl.scrollTop = 0;
        var onEnterSpy = sinon.spy();
        var scrollListener = new ScrollListener({
            el: outerEl,
            container: outerEl,
            onEnter: onEnterSpy
        });
        // trigger animation frame
        requestAnimationFrameStub.yield();
        assert.equal(onEnterSpy.callCount, 1, 'onEnter callback was fired upon instantiation because element is in view');
        scrollListener.destroy();
        document.body.removeChild(outerEl);
    })

    it('should fire onEnter callback when container\'s scrollTop position + its height reaches the top of the element', function() {
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup outer element
        outerEl.style.overflow = 'hidden'; // make it scrollable
        outerEl.style.height = '150px';
        outerEl.style.width = '10px';
        // inner element
        innerEl.style.top = '300px'; // move element out of view
        innerEl.style.left = '0';
        innerEl.style.width = '10px';
        innerEl.style.height = '150px';
        innerEl.style.position = 'relative';
        // setup current scroll position
        outerEl.scrollTop = 0;
        var onEnterSpy = sinon.spy();
        var scrollListener = new ScrollListener({
            el: innerEl,
            container: outerEl,
            onEnter: onEnterSpy
        });

        outerEl.scrollTop = 301; // inner element is showing at 150 (outer element scrollTop + outer element height)
        // trigger scroll event
        outerEl.dispatchEvent(TestUtils.createEvent('scroll'));
        // trigger animation frame
        requestAnimationFrameStub.yield();
        assert.equal(onEnterSpy.callCount, 1, 'onEnter callback was fired when outer element is scrolled to point where top of inner element is showing');
        scrollListener.destroy();
        document.body.removeChild(outerEl);
    });

    it('should not fire onEnter callback after destruction', function() {
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup outer element
        outerEl.style.overflow = 'hidden'; // make it scrollable
        outerEl.style.height = '150px';
        outerEl.style.width = '10px';
        // inner element
        innerEl.style.top = '300px'; // move element out of view
        innerEl.style.left = '0';
        innerEl.style.width = '10px';
        innerEl.style.height = '150px';
        innerEl.style.position = 'relative';
        // setup current scroll position
        outerEl.scrollTop = 0;
        var onEnterSpy = sinon.spy();
        var requestAnimationFrameCallCount = 0;
        var scrollListener = new ScrollListener({
            el: innerEl,
            container: outerEl,
            onEnter: onEnterSpy
        });
        requestAnimationFrameCallCount++; // initializing calls automatically
        scrollListener.destroy();
        outerEl.scrollTop = 301; // inner element is showing at 150 (outer element scrollTop + outer element height)
        // trigger scroll event
        outerEl.dispatchEvent(TestUtils.createEvent('scroll'));
        assert.equal(requestAnimationFrameStub.callCount, requestAnimationFrameCallCount, 'animation frame was not triggered');
        assert.equal(onEnterSpy.callCount, 0, 'onEnter callback was not fired after destroy');
        document.body.removeChild(outerEl);
    });
});

