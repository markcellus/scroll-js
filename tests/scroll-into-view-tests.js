import sinon from '../node_modules/sinon/pkg/sinon-esm.js';
import chai from 'chai';
import { scrollIntoView, utils } from '../src/scroll';
import createMockRaf from 'mock-raf';

const { assert } = chai;

let mockRaf;

describe('scrollIntoView', function() {
    let dateNowStub;
    let currentTime;

    beforeEach(function() {
        mockRaf = createMockRaf();
        sinon.stub(window, 'requestAnimationFrame').callsFake(mockRaf.raf);
        dateNowStub = sinon.stub(Date, 'now');
        currentTime = 1422630923001;
        dateNowStub.onFirstCall().returns(currentTime); // set the current time for first animation frame
        currentTime += 5;
        dateNowStub.onSecondCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
        currentTime += 1000;
        dateNowStub.onThirdCall().returns(currentTime); // set the current animation time enough time forward to simulate a time that will trigger the last frame
    });

    afterEach(function() {
        window.requestAnimationFrame.restore();
        dateNowStub.restore();
    });

    [true, false, {}].forEach(testValue => {
        it(`should throw an error when attempting to pass ${typeof testValue} to scrollIntoView()`, function() {
            assert.throws(() => {
                scrollIntoView(testValue);
            }, `The element passed to scrollIntoView() must be a valid element. You passed ${testValue}.`);
        });
    });

    it('should throw an error when nothing is passed to scrollIntoView()', function() {
        assert.throws(() => {
            scrollIntoView();
        }, `The element passed to scrollIntoView() was undefined.`);
    });

    it('should NOT throw an error when initializing with a value that is a DOM element', function() {
        assert.doesNotThrow(() => {
            scrollIntoView(document.createElement('div'));
        });
    });

    it('passing an element scrollIntoView() with a custom container should move the element the amount of distance from the top of its container', function(done) {
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
        scrollIntoView(secondInnerEl, outerEl);
        mockRaf.step({ count: 3 });
        setTimeout(function() {
            assert.equal(outerEl.scrollTop, innerElHeight);
            document.body.removeChild(outerEl);
            done();
        }, 0);
    });

    it('passing an element scrollIntoView() with no container element should move the element from the top of document.body el', function(done) {
        let bodyEl = document.createElement('div');
        // must set up outer element to not have any offsetTop
        // value by placing it at the top/left-most area in viewport
        bodyEl.style.position = 'absolute';
        bodyEl.style.left = '0';
        bodyEl.style.top = '0';
        let innerEl = document.createElement('div');
        let secondInnerEl = document.createElement('div');
        bodyEl.appendChild(innerEl);
        bodyEl.appendChild(secondInnerEl);
        document.body.appendChild(bodyEl);
        // setup to be "scrollable"
        bodyEl.style.overflow = 'hidden';
        bodyEl.style.height = '150px';
        // inner element
        let innerElHeight = 120;
        innerEl.style.height = `${innerElHeight}px`;
        // second element should be underneath
        secondInnerEl.style.height = '600px';
        // setup current scroll position
        bodyEl.scrollTop = 0;
        sinon.stub(utils, 'getDocument').returns({
            body: bodyEl,
            documentElement: bodyEl
        });
        scrollIntoView(secondInnerEl);
        mockRaf.step({ count: 3 });
        setTimeout(function() {
            assert.equal(bodyEl.scrollTop, innerElHeight);
            utils.getDocument.restore();
            document.body.removeChild(bodyEl);
            done();
        }, 0);
    });

    it('passing a deeply nested element that is out of viewport to scrollIntoView() should move the element the proper amount of distance from the top of document.body el', function(done) {
        let bodyEl = document.createElement('div');
        let firstInnerElHeight = 73;
        bodyEl.style.position = 'absolute';
        bodyEl.style.top = '0';
        bodyEl.style.left = '0';
        bodyEl.style.height = `${firstInnerElHeight}px`;
        bodyEl.style.overflow = 'hidden';
        let containerEl = document.createElement('div');
        bodyEl.appendChild(containerEl);
        // padded inner el
        let firstInnerEl = document.createElement('div');
        firstInnerEl.style.width = '100%';
        firstInnerEl.style.height = firstInnerElHeight + 'px';
        containerEl.appendChild(firstInnerEl);
        // inner element
        let innerEl = document.createElement('div');
        innerEl.style.width = '100%';
        innerEl.style.height = '200px';
        containerEl.appendChild(innerEl);
        document.body.appendChild(bodyEl);
        sinon.stub(utils, 'getDocument').returns({
            body: bodyEl,
            documentElement: bodyEl
        });
        assert.equal(innerEl.getBoundingClientRect().top, firstInnerElHeight); // make sure element is in right position
        scrollIntoView(innerEl);
        mockRaf.step({ count: 3 });
        setTimeout(function() {
            assert.equal(bodyEl.scrollTop, firstInnerElHeight);
            utils.getDocument.restore();
            bodyEl.removeChild(containerEl);
            done();
        }, 0);
    });

    it('passing an element to scrollIntoView() with a duration of 0 should scroll to that element immediately', function(done) {
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
        scrollIntoView(secondInnerEl, outerEl, { behavior: 'smooth' });
        mockRaf.step({ count: 3 });
        setTimeout(function() {
            assert.equal(outerEl.scrollTop, innerElHeight);
            document.body.removeChild(outerEl);
            done();
        }, 0);
    });
});
