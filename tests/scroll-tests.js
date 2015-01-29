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

    QUnit.asyncTest('scrolling to', function() {
        QUnit.expect(5);
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
        outerEl.scrollTop = 100;
        var scroll = new Scroll({el: outerEl});
        var callbackSpy = Sinon.spy();
        QUnit.equal(callbackSpy.callCount, 0, 'callback spy was not yet called because scroll.to() hasnt been called');
        scroll.to(0, 100, callbackSpy);
        QUnit.equal(callbackSpy.callCount, 1, 'callback spy was called immediately when trying to scroll to a coordinate that element is already at');
        var testTo = 140;
        scroll.to(0, testTo, callbackSpy);
        QUnit.equal(callbackSpy.callCount, 1, 'calling scroll.to() to coordinate of ' + testTo + ' does not fire callback immediately because duration time of scrolling hasnt finished');
        // check with default duration of 400
        setTimeout(function () {
            QUnit.equal(outerEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the element was changed to ' + testTo);
            QUnit.equal(callbackSpy.callCount, 2, 'callback was fired again');
            QUnit.start();
        }, 410); // leave some extra time for animation frame to finish
    });

});