# Scroll

A lighteight scroller with no dependencies, using native javascript.

## Why use this scroller over other scroll libraries and plugins?

This library solves the accessibility issues on mobile devices that many scroll libraries miss. Most libraries today
use absolutely positioning, css animations, transitions and other types of workarounds to get the scroller to behave.

Desktop and mobile devices (mobile mainly), heavily depend on the document, html and body tags to do helpful things for the user.
Like hiding the location url bar as you scroll down the window of the document on mobile browsers, for instance. Or
[pausing heavy processes](http://developer.telerik.com/featured/scroll-event-change-ios-8-big-deal/), until
the user is done performing a task as to not interrupt them.

The other libraries out there use CSS transitioning and animations to "fake" a scrolling effect.
Outside of this being such a "hacky" way to do things, it moves you further away from native javascript.
Like event listening (you can not use [window.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/window.onscroll) and
[Element.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onscroll)) with many of these tools.

The Scroll class does not suffer from any of these issues as it uses native scroll properties
and animation frames for better rendering performance.


## Scrolling

```javascript
var scroll = new Scroll({
    el: document.body
});
scroll.to(0, 500); //scroll 500 pixels down the page

```

## Event Listening

With this library you can listen in on native scroll events.

```javascript
var scroll = new Scroll({
    el: document.body
});

// setup event
window.onscroll = function () {
    // scrolling!
}
// scroll to trigger event
scroll.to(0, 300);

```