/**
 * Sets up an element to act as the outer scroller.
 * @param {array} HTML Elements to append to scroller
 * @returns Scroller element
 */
export function createScrollerElement(height: number) {
    const scrollerEl = document.createElement('div');
    // placing at top/left-most area in viewport
    scrollerEl.style.position = 'absolute';
    scrollerEl.style.left = '0';
    scrollerEl.style.top = '0';

    // must have a width and overflow set to hidden order to set scrollTop
    scrollerEl.style.width = '1px';
    scrollerEl.style.overflow = 'hidden';

    scrollerEl.style.height = `${height}px`;

    return scrollerEl;
}
