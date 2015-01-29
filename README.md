# Scroll

A lighteight scroller with no dependencies, using native javascript.

## Why use this scroller over other scroll libraries and plugins?

This library solves the accessibility issues on mobile devices that many scroll libraries miss.

Most libraries today use absolutely positioning, css animations, transitions and other types of workarounds directly on
the `window.document`, `<html>`, or `<body>` elements to get the scroller to behave. But desktop and mobile devices
(mobile mainly), heavily depend on the event triggering of these elements to do helpful things for the user.
Like hiding the location url bar as
you scroll down the window of the document on mobile browsers, for instance. Or
[pausing heavy processes](http://developer.telerik.com/featured/scroll-event-change-ios-8-big-deal/), until
the user is done performing a task as to not interrupt them. So it's increasingly important to use these elements in a way that
lends nicely to native browser functionality, including scrolling logic.

The other libraries out there use CSS transitioning and animations to "fake" a scrolling effect. While this is clever,
it moves you further away from the tools native javascript gives you, like event listening (you can not
use [window.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/window.onscroll) and
[Element.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onscroll)) with many of these tools.

The Scroll class does not suffer from any of these issues as it uses native scroll properties so that native javascript events fire
([see Event Listening](#Event-listening)) and the browsers internal animation frames for better rendering performance.


## Scrolling

```javascript
var scroll = new Scroll({
    el: document.body
});
scroll.to(0, 500); //scroll 500 pixels down the page

```

## Event Listening

With this library you can listen in on native scroll events the same way you would if a user was scrolling the
page with a mouse or touch event.

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