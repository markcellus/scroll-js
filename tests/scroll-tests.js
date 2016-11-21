'use strict';
import sinon from 'sinon';
import assert from 'assert';
import Scroll from '../src/scroll';
var Promise = require('es6-promise').Promise;

var requestAnimationPolyfill = function () {
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
};

describe('Scroll', function () {
    let requestAnimationFrameStub;

    before(function () {
        // phantomjs doesnt have requestAnimationFrame implemented... *eye roll* so use polyfill
        requestAnimationPolyfill();
    });

    beforeEach(function () {
        if (!window.requestAnimationFrame) {
            requestAnimationFrameStub = sinon.stub(window, 'setTimeout');
        } else {
            requestAnimationFrameStub = sinon.stub(window, 'requestAnimationFrame');
        }
    });

    afterEach(function () {
        requestAnimationFrameStub.restore();
    }) ;

    it('should update its element\'s scrollTop property to the same coordinate specified in the second parameter supplied to scroll.to()', function() {

        var dateNowStub = sinon.stub(Date, 'now');
        dateNowStub.onFirstCall().returns(1422630923001); // set the current time for first animation frame
        var testCurrentTime = 1422630923005;
        dateNowStub.onSecondCall().returns(testCurrentTime); // set the current on second animation frame
        dateNowStub.onThirdCall().returns(testCurrentTime + 1000); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        requestAnimationFrameStub.yields(); // trigger requested animation frame immediately
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
        var scroll = new Scroll(outerEl);
        var testTo = 120;
        // test
        return scroll.to(0, testTo).then(function () {
            assert.equal(outerEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the element was changed to ' + testTo);
            dateNowStub.restore();
            document.body.removeChild(outerEl);
        });
    });

    it('passing an absolutely positioned element toElement() should call .to() with the amount of distance the element is from the top of its container', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.width = '200px'; // put some arbitrary width
        outerEl.style.height = '150px';
        outerEl.style.position = 'relative';
        // inner element
        innerEl.style.width = '100%';
        innerEl.style.height = '600px';
        innerEl.style.position = 'absolute';
        innerEl.style.left = '0';
        var innerElFromTop = 156;
        innerEl.style.top = innerElFromTop + 'px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        var scroll = new Scroll(outerEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], innerElFromTop, 'to() was called with inner elements position (from top of outer element) as second parameter');
            scrollToStub.restore();
            document.body.removeChild(outerEl);
        });
    });

    it('passing an absolutely positioned element toElement() when container is a document.body element should call .to() with the amount of distance the element is from the top of document.body el', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var docEl = document.body;
        var innerEl = document.createElement('div');
        docEl.appendChild(innerEl);
        // inner element
        innerEl.style.width = '100%';
        innerEl.style.height = '600px';
        innerEl.style.position = 'absolute';
        innerEl.style.left = '0';
        var innerElFromTop = 210;
        innerEl.style.top = innerElFromTop + 'px';
        // setup current scroll position
        docEl.scrollTop = 100;
        var scroll = new Scroll(docEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], innerElFromTop, 'to() was called with inner elements position (from top of document.body el) as second parameter');
            scrollToStub.restore();
            docEl.removeChild(innerEl);
        });
    });

    it('passing an element to toElement() that is inside of a container that is inside the document.body element under an element with a designated height should call .to() with the amount of distance the element is from the top of document.body el', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var docEl = document.body;
        var containerEl = document.createElement('div');
        // remove any auto padding/margins for our test
        containerEl.style.position = 'absolute';
        containerEl.style.top = '0';
        containerEl.style.left = '0';
        docEl.appendChild(containerEl);
        // padded inner el
        var firstInnerElHeight = 73;
        var firstInnerEl = document.createElement('div');
        firstInnerEl.style.width = '100%';
        firstInnerEl.style.height = firstInnerElHeight + 'px';
        containerEl.appendChild(firstInnerEl);
        // inner element
        var innerEl = document.createElement('div');
        innerEl.style.width = '100%';
        innerEl.style.height = '200px';
        containerEl.appendChild(innerEl);
        // setup current scroll position
        var scroll = new Scroll(docEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], firstInnerElHeight, 'to() was called with inner elements position (from top of document body el PLUS top padding) as second parameter');
            scrollToStub.restore();
            docEl.removeChild(containerEl);
        });
    });

    it('passing an element to toElement() that is that is not inside of the container passed to constructor rejects the promise with an error', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var docEl = document.body;
        var containerEl = document.createElement('div');
        var consoleWarnStub = sinon.stub(window.console, 'warn');
        docEl.appendChild(containerEl);
        var scroll = new Scroll(containerEl);
        return scroll.toElement(document.createElement('div'))
            .catch(function (e) {
                assert.ok(e, 'promise was rejected and error was passed');
                assert.equal(consoleWarnStub.callCount, 1, 'console.warn() was called');
                assert.equal(scrollToStub.callCount, 0, 'to() was NOT called');
                scrollToStub.restore();
                consoleWarnStub.restore();
                docEl.removeChild(containerEl);
            });
    });

    it('passing an undefined to toElement() rejects the promise with an error', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var docEl = document.body;
        var containerEl = document.createElement('div');
        var consoleErrorStub = sinon.stub(window.console, 'error');
        docEl.appendChild(containerEl);
        var scroll = new Scroll(containerEl);
        // test
        return scroll.toElement()
            .catch(function (e) {
                assert.ok(e, 'promise was rejected and error was passed');
                assert.equal(consoleErrorStub.callCount, 1, 'console.error() was called');
                assert.equal(scrollToStub.callCount, 0, 'to() was NOT called');
                scrollToStub.restore();
                consoleErrorStub.restore();
                docEl.removeChild(containerEl);
            });
    });

    it('passing an undefined to toElement() when the container is the document\'s body rejects the promise with an error', function() {
        var scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        var docEl = document.body;
        var consoleErrorStub = sinon.stub(window.console, 'error');
        var scroll = new Scroll(docEl);
        // test
        return scroll.toElement()
            .catch(function (e) {
                assert.ok(e, 'promise was rejected and error was passed');
                assert.equal(consoleErrorStub.callCount, 1, 'console.error() was called');
                assert.equal(scrollToStub.callCount, 0, 'to() was NOT called');
                scrollToStub.restore();
                consoleErrorStub.restore();
            });
    });

    it('scroll.to() should update document.documentElement (html element) scrollTop property if element passed into scroll is document.body', function() {
        var dateNowStub = sinon.stub(Date, 'now');
        dateNowStub.onFirstCall().returns(1422630923001); // set the current time for first animation frame
        var testCurrentTime = 1422630923005;
        dateNowStub.onSecondCall().returns(testCurrentTime); // set the current on second animation frame
        dateNowStub.onThirdCall().returns(testCurrentTime + 1000); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        requestAnimationFrameStub.yields(); // trigger requested animation frame immediately

        // setup element to be "scrollable"
        var scrollableEl = document.createElement('div');
        scrollableEl.style.overflow = 'hidden';
        scrollableEl.style.height = '150px';
        document.body.appendChild(scrollableEl);
        var innerEl = document.createElement('div');
        innerEl.style.height = '600px';
        scrollableEl.appendChild(innerEl);

        // setup documentElement to be "scrollable"
        var docEl = document.createElement('div');
        docEl.style.overflow = 'hidden';
        docEl.style.height = '150px';
        document.body.appendChild(docEl);
        var docInnerEl = document.createElement('div');
        docInnerEl.style.height = '600px';
        docEl.appendChild(docInnerEl);

        //test
        var testDocumentElement = {
            documentElement: docEl,
            body: scrollableEl
        };
        var scroll = new Scroll(scrollableEl);
        var testTo = 120;
        // redefine document getter
        Object.defineProperty(scroll, 'document', {
            get: function () {
                return testDocumentElement;
            }
        });
        return scroll.to(0, testTo).then(function () {
            assert.equal(docEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the document element was changed to ' + testTo);
            dateNowStub.restore();
            document.body.removeChild(scrollableEl);
            document.body.removeChild(docEl);
        });
    });

});

