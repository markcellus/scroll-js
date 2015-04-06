'use strict';
var sinon = require('sinon');
var assert = require('assert');
var Scroll = require('../src/scroll');
var Promise = require('promise');

describe('Scroll', function () {

    it('should update its element\'s scrollTop property to the same coordinate specified in the second parameter supplied to scroll.to()', function() {
        // phantomjs doesnt have requestAnimationFrame implemented... *eye roll*
        // so use polyfill setTimeout
        var requestAnimationFrameStub;
        if (!window.requestAnimationFrame) {
            requestAnimationFrameStub = sinon.stub(window, 'setTimeout');
        } else {
            requestAnimationFrameStub = sinon.stub(window, 'requestAnimationFrame');
        }
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
        var scroll = new Scroll({el: outerEl});
        var testTo = 120;
        // test
        return scroll.to(0, testTo).then(function () {
            assert.equal(outerEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the element was changed to ' + testTo);
            requestAnimationFrameStub.restore();
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
        var scroll = new Scroll({el: outerEl});
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
        var scroll = new Scroll({el: docEl});
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
        var scroll = new Scroll({el: docEl});
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], firstInnerElHeight, 'to() was called with inner elements position (from top of document body el PLUS top padding) as second parameter');
            scrollToStub.restore();
            docEl.removeChild(containerEl);
        });
    });

});

    