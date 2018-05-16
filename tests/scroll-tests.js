import sinon from 'sinon';
import assert from 'assert';
import Scroll from '../src/scroll';
let Promise = require('es6-promise').Promise;
let createMockRaf = require('mock-raf');
let mockRaf;

let requestAnimationPolyfill = function () {
    let x = 0,
        lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for (0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function () {
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

    before(function () {
        // phantomjs doesnt have requestAnimationFrame implemented... *eye roll* so use polyfill
        requestAnimationPolyfill();
    });

    beforeEach(function () {
        mockRaf = createMockRaf();
        sinon.stub(window, 'requestAnimationFrame').callsFake(mockRaf.raf);
    });

    afterEach(function () {
        window.requestAnimationFrame.restore();
    });

    it('should throw an error when initializing with a value that is not a DOM node', function() {
        let testValue = true;
        assert.throws(() => {
            new Scroll(testValue);
        }, (e) => {
            assert.equal(e.message, `Scroll error: element passed to Scroll constructor must be a DOM node, you passed ${testValue}!`);
            return true;
        });
    });

    it('should NOT throw an error when initializing with a value that is a DOM node', function() {
        assert.doesNotThrow(() => {
            new Scroll(document.createElement('div'));
        });
    });

    it('should set the container el as document.body if nothing is passed to constructor', function() {
        let scroll = new Scroll();
        assert.deepEqual(scroll.el, document.body);
    });

    it('should update its element\'s scrollTop property to the same coordinate specified in the second parameter supplied to scroll.to()', function() {

        let dateNowStub = sinon.stub(Date, 'now');
        dateNowStub.onFirstCall().returns(1422630923001); // set the current time for first animation frame
        let testCurrentTime = 1422630923005;
        dateNowStub.onSecondCall().returns(testCurrentTime); // set the current on second animation frame
        dateNowStub.onThirdCall().returns(testCurrentTime + 1000); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        let outerEl = document.createElement('div');
        let innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        let scroll = new Scroll(outerEl);
        let testTo = 120;
        let scrollPromise = scroll.to(0, testTo);
        mockRaf.step({count: 3});
        return scrollPromise.then(function () {
            assert.equal(outerEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the element was changed to ' + testTo);
            dateNowStub.restore();
            document.body.removeChild(outerEl);
        });
    });

    it('passing an absolutely positioned element toElement() should call .to() with the amount of distance the element is from the top of its container', function() {
        let scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        let outerEl = document.createElement('div');
        let innerEl = document.createElement('div');
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
        let innerElFromTop = 156;
        innerEl.style.top = innerElFromTop + 'px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        let scroll = new Scroll(outerEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], innerElFromTop, 'to() was called with inner elements position (from top of outer element) as second parameter');
            scrollToStub.restore();
            document.body.removeChild(outerEl);
        });
    });

    it('passing an absolutely positioned element toElement() when container is a document.body element should call .to() with the amount of distance the element is from the top of document.body el', function() {
        let scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        let docEl = document.body;
        let innerEl = document.createElement('div');
        docEl.appendChild(innerEl);
        // inner element
        innerEl.style.width = '100%';
        innerEl.style.height = '600px';
        innerEl.style.position = 'absolute';
        innerEl.style.left = '0';
        let innerElFromTop = 210;
        innerEl.style.top = innerElFromTop + 'px';
        // setup current scroll position
        docEl.scrollTop = 100;
        let scroll = new Scroll(docEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], innerElFromTop, 'to() was called with inner elements position (from top of document.body el) as second parameter');
            scrollToStub.restore();
            docEl.removeChild(innerEl);
        });
    });

    it('passing an element to toElement() that is inside of a container that is inside the document.body element under an element with a designated height should call .to() with the amount of distance the element is from the top of document.body el', function() {
        let scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        let docEl = document.body;
        let containerEl = document.createElement('div');
        // remove any auto padding/margins for our test
        containerEl.style.position = 'absolute';
        containerEl.style.top = '0';
        containerEl.style.left = '0';
        docEl.appendChild(containerEl);
        // padded inner el
        let firstInnerElHeight = 73;
        let firstInnerEl = document.createElement('div');
        firstInnerEl.style.width = '100%';
        firstInnerEl.style.height = firstInnerElHeight + 'px';
        containerEl.appendChild(firstInnerEl);
        // inner element
        let innerEl = document.createElement('div');
        innerEl.style.width = '100%';
        innerEl.style.height = '200px';
        containerEl.appendChild(innerEl);
        // setup current scroll position
        let scroll = new Scroll(docEl);
        // test
        return scroll.toElement(innerEl).then(function () {
            assert.equal(scrollToStub.args[0][0], 0, 'to() was called with 0 as first parameter');
            assert.equal(scrollToStub.args[0][1], firstInnerElHeight, 'to() was called with inner elements position (from top of document body el PLUS top padding) as second parameter');
            scrollToStub.restore();
            docEl.removeChild(containerEl);
        });
    });

    it('passing an undefined to toElement() rejects the promise, prints an error, and does not call to()', function() {
        let scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        let consoleErrorStub = sinon.stub(window.console, 'error');
        let scroll = new Scroll(document.body);
        return scroll.toElement()
            .catch((e) => {
                return e;
            })
            .then((result) => {
                scrollToStub.restore();
                consoleErrorStub.restore();
                assert.ok(result instanceof Error, 'error was thrown');
                assert.equal(consoleErrorStub.callCount, 1, 'console.error() was called');
                assert.equal(scrollToStub.callCount, 0, 'to() was NOT called');
            });
    });

    it('passing an undefined to toElement() when the container is the document\'s body rejects the promise and does not call to()', function() {
        let scrollToStub =  sinon.stub(Scroll.prototype, 'to').returns(Promise.resolve());
        let consoleErrorStub = sinon.stub(window.console, 'error');
        let scroll = new Scroll(document.body);
        return scroll.toElement()
            .catch((e) => {
                return e;
            })
            .then((result) => {
                scrollToStub.restore();
                consoleErrorStub.restore();
                assert.ok(result instanceof Error, 'error was thrown');
                assert.equal(consoleErrorStub.callCount, 1, 'console.error() was called');
                assert.equal(scrollToStub.callCount, 0, 'to() was NOT called');
            });
    });

    it('scroll.to() should update document.documentElement (html element) scrollTop property if element passed into scroll is document.body', function() {
        let dateNowStub = sinon.stub(Date, 'now');
        dateNowStub.onFirstCall().returns(1422630923001); // set the current time for first animation frame
        let testCurrentTime = 1422630923005;
        dateNowStub.onSecondCall().returns(testCurrentTime); // set the current on second animation frame
        dateNowStub.onThirdCall().returns(testCurrentTime + 1000); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        // setup element to be "scrollable"
        let scrollableEl = document.createElement('div');
        scrollableEl.style.overflow = 'hidden';
        scrollableEl.style.height = '150px';
        document.body.appendChild(scrollableEl);
        let innerEl = document.createElement('div');
        innerEl.style.height = '600px';
        scrollableEl.appendChild(innerEl);

        // setup documentElement to be "scrollable"
        let docEl = document.createElement('div');
        docEl.style.overflow = 'hidden';
        docEl.style.height = '150px';
        document.body.appendChild(docEl);
        let docInnerEl = document.createElement('div');
        docInnerEl.style.height = '600px';
        docEl.appendChild(docInnerEl);

        //test
        let testDocumentElement = {
            documentElement: docEl,
            body: scrollableEl
        };
        let scroll = new Scroll(scrollableEl);
        let testTo = 120;
        // redefine document getter
        Object.defineProperty(scroll, 'document', {
            get: function () {
                return testDocumentElement;
            }
        });
        let scrollPromise = scroll.to(0, testTo);
        mockRaf.step({count: 3});
        return scrollPromise.then(function () {
            assert.equal(docEl.scrollTop, testTo, 'after duration of scroll ends, the scrollTop property of the document element was changed to ' + testTo);
            dateNowStub.restore();
            document.body.removeChild(scrollableEl);
            document.body.removeChild(docEl);
        });
    });

    it('should update its element\'s scrollTop to value supplied to scroll.to() immediately when duration 0 is used', function(done) {
        let dateNowStub = sinon.stub(Date, 'now');
        let currentTime = 1422630923001;
        dateNowStub.onFirstCall().returns(currentTime); // set the current time for first animation frame
        currentTime += 5;
        dateNowStub.onSecondCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        currentTime += 1000;
        dateNowStub.onThirdCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        let outerEl = document.createElement('div');
        let innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        let scroll = new Scroll(outerEl);
        let testTo = 120;
        scroll.to(0, testTo, {duration: 0});
        mockRaf.step({count: 3});
        setTimeout(function () {
            assert.equal(outerEl.scrollTop, testTo);
            dateNowStub.restore();
            document.body.removeChild(outerEl);
            done();
        }, 0);
    });

    it('passing an element to toElement() with a duration of 0 should scroll to that element immediately', function(done) {
        let dateNowStub = sinon.stub(Date, 'now');
        let currentTime = 1422630923001;
        dateNowStub.onFirstCall().returns(currentTime); // set the current time for first animation frame
        currentTime += 5;
        dateNowStub.onSecondCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        currentTime += 1000;
        dateNowStub.onThirdCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        let outerEl = document.createElement('div');
        // must set up outer element to not have any offsetTop
        // value by placing it at the top/left-most area in viewport
        outerEl.style.position = 'absolute';
        outerEl.style.left = '0';
        outerEl.style.top = '0';
        let innerEl = document.createElement('div');
        let secondInnerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        outerEl.appendChild(secondInnerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        let innerElHeight = 120;
        innerEl.style.height = `${innerElHeight}px`;
        // second element should be underneath
        secondInnerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 0;
        
        let scroll = new Scroll(outerEl);
        scroll.toElement(secondInnerEl, {duration: 0});
        mockRaf.step({count: 3});
        setTimeout(function () {
            assert.equal(outerEl.scrollTop, innerElHeight);
            dateNowStub.restore();
            document.body.removeChild(outerEl);
            done();
        }, 0);
    });

    it('should return scrollTop property of the document.documentElement when document.body returns 0', function() {
        const scrollTop = 55;
        let testDocumentElement = {
            documentElement: {
                scrollTop: 55
            },
            body: {
                scrollTop: 0
            }
        };
        let scroll = new Scroll();
        scroll.el = testDocumentElement.body;
        Object.defineProperty(scroll, 'document', {
            get: function () {
                return testDocumentElement;
            }
        });

        assert.equal(scroll.scrollPosition, scrollTop);
    });

});

