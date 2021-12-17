import sinon from 'sinon';
import { scrollTo, utils, easingMap, DEFAULT_DURATION } from '../src/scroll';
import { expect, assert } from '@esm-bundle/chai';
import { createScrollerElement } from './utils';
import { aTimeout, nextFrame } from '@open-wc/testing-helpers';

describe('scroll', function () {
    it('should throw an error when attempting to scroll anything that is not a DOM element', async function () {
        return Promise.all(
            [true, false, {}].map(async (testValue) => {
                // @ts-ignore
                return await scrollTo(testValue).catch((e) => {
                    assert.equal(
                        e.message,
                        `element passed to scrollTo() must be either the window or a DOM element, you passed ${testValue}!`
                    );
                });
            })
        );
    });

    it('should NOT throw an error when initializing with a value that is a DOM element', function () {
        assert.doesNotThrow(() => {
            scrollTo(document.createElement('div'));
        });
    });

    it("updates the scrolled element's scrollTop property in 300ms by default", async function () {
        const outerEl = createScrollerElement(150);
        const innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        const testTo = 120;
        scrollTo(outerEl, { top: testTo });
        expect(outerEl.scrollTop).to.not.equal(testTo);
        await aTimeout(DEFAULT_DURATION + 1);
        await nextFrame();
        expect(outerEl.scrollTop).to.equal(testTo);
        outerEl.remove();
    });

    it("should update the window's scrollTop property when nothing is passed as the container", async function () {
        const innerEl = document.createElement('div');
        document.body.appendChild(innerEl);
        // inner element
        innerEl.style.height = '200vh';
        const testTo = 120;
        await scrollTo(window, { top: testTo });
        expect(window.scrollY).to.equal(testTo);
        innerEl.remove();
    });

    it("should update the scrolled element's scrollTop property to the same coordinate specified in the second parameter supplied to scrollTo()", async function () {
        const outerEl = createScrollerElement(150);
        const innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        const testTo = 120;
        await scrollTo(outerEl, { top: testTo });
        expect(outerEl.scrollTop).to.equal(testTo);
        outerEl.remove();
    });

    it('scrollTo() should update document.documentElement (html element) scrollTop property if passed into scroll', async function () {
        const getDocumentStub = sinon.stub(utils, 'getDocument');
        const bodyElement = document.createElement('div');
        bodyElement.scrollTop = 0;
        const docEl = createScrollerElement(150);
        document.body.appendChild(docEl);
        const docInnerEl = document.createElement('div');
        docInnerEl.style.height = '600px';
        docEl.appendChild(docInnerEl);
        document.body.appendChild(docEl);
        const testTo = 120;
        const testDocumentElement = {
            documentElement: docEl,
            body: bodyElement,
        };
        getDocumentStub.returns(testDocumentElement as unknown as HTMLDocument);
        await scrollTo(docEl, { top: testTo });
        expect(docEl.scrollTop).to.equal(testTo);
        docEl.remove();
        getDocumentStub.restore();
    });

    it("should update its element's scrollTop to value supplied to scrollTo() immediately when duration 0 is used", async function () {
        const outerEl = document.createElement('div');
        const innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        const testTo = 120;
        scrollTo(outerEl, { top: testTo, duration: 0 });
        await nextFrame(); // still need to advance to next frame
        expect(outerEl.scrollTop).to.equal(testTo);
        outerEl.remove();
    });

    it("should update its element's scrollTop to value supplied to scrollTo() immediately when behavior is set to auto", async function () {
        const outerEl = document.createElement('div');
        const innerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        document.body.appendChild(outerEl);
        // setup to be "scrollable"
        outerEl.style.overflow = 'hidden';
        outerEl.style.height = '150px';
        // inner element
        innerEl.style.height = '600px';
        // setup current scroll position
        outerEl.scrollTop = 100;
        const testTo = 120;
        scrollTo(outerEl, { top: testTo, behavior: 'auto' });
        await aTimeout(301);
        expect(outerEl.scrollTop).to.equal(testTo);
        outerEl.remove();
    });

    it('should throw an error when attempting to scroll with an unsupported easing function', function () {
        const options = Object.keys(easingMap).join(',');
        const easing = 'invalidEasing' as any;
        const outerEl = document.createElement('div');
        return scrollTo(outerEl, { easing }).catch((e) => {
            assert.equal(
                e.message,
                `Scroll error: scroller does not support an easing option of "${easing}". Supported options are ${options}`
            );
        });
    });

    it('body should scroll back to top after having been scrolled', async function () {
        const getDocumentStub = sinon.stub(utils, 'getDocument');
        const fakeBodyElement = document.createElement('div');
        fakeBodyElement.style.overflow = 'hidden';
        fakeBodyElement.style.height = '150px';
        const innerEl = document.createElement('div');
        innerEl.style.height = '600px';
        fakeBodyElement.appendChild(innerEl);
        document.body.appendChild(fakeBodyElement);
        const testTo = 120;
        getDocumentStub.returns({
            body: fakeBodyElement,
            documentElement: document.createElement('div'),
        } as unknown as HTMLDocument);
        await scrollTo(fakeBodyElement, { top: testTo });
        await scrollTo(fakeBodyElement, { top: 0 });
        expect(fakeBodyElement.scrollTop).to.equal(0);
        fakeBodyElement.remove();
        getDocumentStub.restore();
    });
});
