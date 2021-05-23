import sinon, { SinonStub } from 'sinon';
import { scrollIntoView, utils } from '../src/scroll';
import { aTimeout, nextFrame } from '@open-wc/testing';
import { expect, assert } from '@esm-bundle/chai';
import { createScrollerElement } from './utils';

describe('scrollIntoView', function () {
    let getDocumentStub: SinonStub;

    beforeEach(function () {
        getDocumentStub = sinon.stub(utils, 'getDocument').returns(({
            body: document.createElement('div'),
            documentElement: document.createElement('div'),
        } as unknown) as HTMLDocument);
    });

    afterEach(function () {
        getDocumentStub.restore();
    });

    [true, false, {}].forEach((testValue) => {
        it(`should throw an error when attempting to pass ${typeof testValue} to scrollIntoView()`, function () {
            assert.throws(function () {
                // @ts-ignore
                scrollIntoView(testValue);
            }, `The element passed to scrollIntoView() must be a valid element. You passed ${testValue}.`);
        });
    });

    it('should throw an error when nothing is passed to scrollIntoView()', function () {
        assert.throws(function () {
            // @ts-ignore
            scrollIntoView();
        }, `The element passed to scrollIntoView() was undefined.`);
    });

    it('should NOT throw an error when initializing with a value that is a DOM element', function () {
        assert.doesNotThrow(function () {
            scrollIntoView(document.createElement('div'));
        });
    });

    it('passing an element scrollIntoView() with a custom container should move the element the amount of distance from the top of its container', async function () {
        const innerElHeight = 120;
        const innerEl = document.createElement('div');
        innerEl.style.height = `${innerElHeight}px`;
        const secondInnerEl = document.createElement('div');
        secondInnerEl.style.height = '600px';
        const outerEl = createScrollerElement(150);
        outerEl.appendChild(innerEl);
        outerEl.appendChild(secondInnerEl);
        document.body.appendChild(outerEl);
        scrollIntoView(secondInnerEl, outerEl);
        await aTimeout(1);
        expect(outerEl.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(200);
        expect(outerEl.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(301);
        expect(outerEl.scrollTop).to.equal(innerElHeight);
        outerEl.remove();
    });

    it('passing an element scrollIntoView() with no container element should move the element from the top of document.body el', async function () {
        const innerElHeight = 120;
        const innerEl = document.createElement('div');
        innerEl.style.height = `${innerElHeight}px`;
        const secondInnerEl = document.createElement('div');
        secondInnerEl.style.height = '600px';
        const fakeDocumentBody = createScrollerElement(150);
        fakeDocumentBody.appendChild(innerEl);
        fakeDocumentBody.appendChild(secondInnerEl);
        document.body.appendChild(fakeDocumentBody);
        getDocumentStub.returns(({
            body: fakeDocumentBody,
            documentElement: fakeDocumentBody,
        } as unknown) as HTMLDocument);
        scrollIntoView(secondInnerEl);
        await aTimeout(1);
        expect(fakeDocumentBody.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(200);
        expect(fakeDocumentBody.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(301);
        expect(fakeDocumentBody.scrollTop).to.equal(innerElHeight);
        fakeDocumentBody.remove();
    });

    it('passing a deeply nested element that is out of viewport to scrollIntoView() should move the element the proper amount of distance from the top of document.body el', async function () {
        const firstInnerElHeight = 73;
        const fakeDocumentBody = createScrollerElement(firstInnerElHeight);
        const containerEl = document.createElement('div');
        fakeDocumentBody.appendChild(containerEl);
        // padded inner el
        const firstInnerEl = document.createElement('div');
        firstInnerEl.style.width = '100%';
        firstInnerEl.style.height = firstInnerElHeight + 'px';
        containerEl.appendChild(firstInnerEl);
        // inner element
        const innerEl = document.createElement('div');
        innerEl.style.width = '100%';
        innerEl.style.height = '200px';
        containerEl.appendChild(innerEl);
        document.body.appendChild(fakeDocumentBody);
        getDocumentStub.returns(({
            body: fakeDocumentBody,
            documentElement: fakeDocumentBody,
        } as unknown) as HTMLDocument);
        assert.equal(innerEl.getBoundingClientRect().top, firstInnerElHeight); // make sure element is in right position
        scrollIntoView(innerEl);
        await aTimeout(1);
        expect(fakeDocumentBody.scrollTop).to.not.equal(firstInnerElHeight);
        await aTimeout(200);
        expect(fakeDocumentBody.scrollTop).to.not.equal(firstInnerElHeight);
        await aTimeout(301);
        expect(fakeDocumentBody.scrollTop).to.equal(firstInnerElHeight);
        fakeDocumentBody.remove();
    });

    it('passing an element to scrollIntoView() with a duration of 0 should scroll to that element immediately', async function () {
        const outerEl = createScrollerElement(150);
        const innerEl = document.createElement('div');
        const secondInnerEl = document.createElement('div');
        outerEl.appendChild(innerEl);
        outerEl.appendChild(secondInnerEl);
        document.body.appendChild(outerEl);
        const innerElHeight = 120;
        innerEl.style.height = `${innerElHeight}px`;
        secondInnerEl.style.height = '600px';
        scrollIntoView(secondInnerEl, outerEl, { behavior: 'smooth' });
        await aTimeout(1);
        expect(outerEl.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(200);
        expect(outerEl.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(301);
        expect(outerEl.scrollTop).to.equal(innerElHeight);
        outerEl.remove();
    });

    it('passing an element to scrollIntoView() with an extra long duration should scroll to that element within the duration', async function () {
        this.timeout(6000); // need longer timeout for this test
        const fakeDocumentBody = createScrollerElement(150);
        const innerEl = document.createElement('div');
        const secondInnerEl = document.createElement('div');
        // inner element
        const innerElHeight = 120;
        innerEl.style.height = `${innerElHeight}px`;
        // second element should be underneath
        secondInnerEl.style.height = '600px';
        fakeDocumentBody.appendChild(innerEl);
        fakeDocumentBody.appendChild(secondInnerEl);
        document.body.appendChild(fakeDocumentBody);
        getDocumentStub.returns(({
            body: fakeDocumentBody,
            documentElement: fakeDocumentBody,
        } as unknown) as HTMLDocument);
        scrollIntoView(secondInnerEl, {
            duration: 5000,
        } as ScrollIntoViewOptions);
        await aTimeout(1000);
        expect(fakeDocumentBody.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(3900);
        expect(fakeDocumentBody.scrollTop).to.not.equal(innerElHeight);
        await aTimeout(100);
        await nextFrame();
        expect(fakeDocumentBody.scrollTop).to.equal(innerElHeight);
        fakeDocumentBody.remove();
    });
});
