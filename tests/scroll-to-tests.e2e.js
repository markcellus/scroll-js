import { Selector } from 'testcafe';

fixture`Scroll-to Tests`.page`http://localhost:4231/scroll-to-element.html`;

test('scrolls to green box after clicking scroll button after 1000 ms', async (t) => {
    const body = Selector('body');
    const green = body.find('.green');
    await t.expect(await green.getBoundingClientRectProperty('top')).notEql(0);
    await t.click('#scroll-btn');
    await t.expect(await green.getBoundingClientRectProperty('top')).notEql(0);
    await t.wait(300);
    await t.expect(await green.getBoundingClientRectProperty('top')).notEql(0);
    await t.wait(701);
    await t.expect(await green.getBoundingClientRectProperty('top')).eql(0);
});

test('clicking green box scrolls to pink box after 1000 ms', async (t) => {
    const body = Selector('body');
    const green = body.find('.green');
    const pink = body.find('.pink');

    await t.click(green);
    await t.wait(400);
    await t.expect(await pink.getBoundingClientRectProperty('top')).notEql(0);
    await t.expect(await green.getBoundingClientRectProperty('top')).notEql(0);
    await t.wait(601);
    await t.expect(await pink.getBoundingClientRectProperty('top')).eql(0);
    await t.expect(await green.getBoundingClientRectProperty('top')).notEql(0);
});
