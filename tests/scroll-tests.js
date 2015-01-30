define([
    'sinon',
    'qunit',
    'src/scroll'
], function(
    Sinon,
    QUnit,
    Scroll
){
    "use strict";

    QUnit.module('Scroll Tests');

    QUnit.test('vertical scroll', function() {
        QUnit.expect(8);
        // phantomjs doesnt have requestAnimationFrame implemented... *eye roll*
        // so use polyfill setTimeout
        var requestAnimationFrameStub;
        if (!window.requestAnimationFrame) {
            requestAnimationFrameStub = Sinon.stub(window, 'setTimeout');
        } else {
            requestAnimationFrameStub = Sinon.stub(window, 'requestAnimationFrame');
        }
        var dateNowStub = Sinon.stub(Date, 'now');
        var fixture = document.getElementById('qunit-fixture');
        var outerEl = document.createElement('div');
        var innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        fixture.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // test
        var origTestTo = 100;
        outerEl.scrollTop = origTestTo;
        var scroll = new Scroll({el: outerEl});
        var callbackSpy = Sinon.spy();
        QUnit.equal(callbackSpy.callCount, 0, 'callback spy was not yet called because scroll.to() hasnt been called');
        dateNowStub.returns(1422630923001); // set the current time
        scroll.to(0, 100, callbackSpy);
        QUnit.equal(requestAnimationFrameStub.callCount, 1, 'when trying to scroll the element to ' + origTestTo + ' and its already there, requestAnimationFrame was called immediately');
        QUnit.equal(callbackSpy.callCount, 0, 'callback spy was NOT yet called because requestAnimationFrame hasnt fired yet');
        requestAnimationFrameStub.args[0][0](); // trigger requested animation frame immediately
        QUnit.equal(callbackSpy.callCount, 1, 'after requestAnimationFrame was fired, callback spy was called');
        QUnit.equal(outerEl.scrollTop, origTestTo, 'the element still has its original scrollTop property of ' + origTestTo);
        //QUnit.equal(requestAnimationFrameStub.callCount, 2, 'requestAnimationFrame was called again after first callback to process next step of animation');
        var testTo = 120;
        var testCurrentTime = 1422630923005;
        dateNowStub.returns(testCurrentTime); // set the current time
        scroll.to(0, testTo, callbackSpy);
        QUnit.equal(callbackSpy.callCount, 1, 'calling scroll.to() to coordinate of ' + testTo + ' does not fire callback immediately because duration time of scrolling hasnt finished');
        dateNowStub.returns(testCurrentTime + 1000); // set the current time enough time forward to simulate a time that will trigger the last frame
        requestAnimationFrameStub.args[1][0](); // trigger requested animation frame immediately
        QUnit.equal(outerEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the element was changed to ' + testTo);
        QUnit.equal(callbackSpy.callCount, 2, 'callback was fired again');
        requestAnimationFrameStub.restore();
        dateNowStub.restore();
    });

});