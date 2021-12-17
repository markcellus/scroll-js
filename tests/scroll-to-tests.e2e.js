import { Selector, ClientFunction } from 'testcafe';

const getViewportHeight = ClientFunction(() => window.innerHeight);
const getWindowScrollY = ClientFunction(() => window.scrollY);

fixture`Scroll-to Tests`
    .page`http://localhost:4231/examples/scroll-to-element.html`;

test('scrolls to green box into view after clicking scroll button after 1000ms', async (t) => {
    const body = Selector('body');
    const green = body.find('.green');
    const viewportHeight = await getViewportHeight();

    // should be below the viewport initially
    await t
        .expect(await green.getBoundingClientRectProperty('top'))
        .gt(viewportHeight);
    await t.click('#scroll-btn');
    // should still be below the viewport here
    await t
        .expect(await green.getBoundingClientRectProperty('top'))
        .gte(viewportHeight);
    await t.wait(1100); // some browsers take longer than 1000ms
    // should be inside viewport here
    await t.expect(await green.getBoundingClientRectProperty('top')).gte(0);
});

test('clicking green box scrolls pink box to top of viewport after 1000 ms', async (t) => {
    const body = Selector('body');
    const green = body.find('.green');
    const pink = body.find('.pink');
    const viewportHeight = await getViewportHeight();
    await t.scrollIntoView(green); // ensure green is in view first
    await t.click(green);
    // should still be below viewport
    await t
        .expect(await pink.getBoundingClientRectProperty('top'))
        .gt(viewportHeight);
    await t.wait(1100); // some browsers take longer than 1000ms
    const top = await pink.getBoundingClientRectProperty('top');
    await t.expect(top).eql(0, 'top of pink element is NOT at top of viewport');
});

test('clicking pink box scrolls back up to top of page', async (t) => {
    const body = Selector('body');
    const pink = body.find('.pink');
    await t.scrollIntoView(pink); // ensure pink is in view first
    await t.expect(await getWindowScrollY()).notEql(0);
    await t.click(pink);
    // should not be at top just yet...
    await t.expect(await getWindowScrollY()).notEql(0);
    await t.wait(1200);
    await t.expect(await getWindowScrollY()).eql(0);
});
