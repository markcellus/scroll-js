'use strict';
var sinon = require('sinon');
var assert = require('assert');
var Scroll = require('../src/scroll');

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
});

    