[![Build Status](https://travis-ci.org/mkay581/scroll-js.svg?branch=master)](https://travis-ci.org/mkay581/scroll-js)
[![npm version](https://badge.fury.io/js/scroll-js.svg)](https://www.npmjs.com/package/scroll-js)

# Scroll

A light-weight scroll manager that uses only native javascript. Manipulates native scroll properties so that
native events fire appropriately and uses browser's animation frames for fast and smooth rendering.

## Why use this over other scroll libraries and plugins?

Many other scroller libraries use absolutely positioning, css animations, transitions and other types of workarounds directly on
the `window.document`, `<html>`, `<body>` and other elements to "fake" a scrolling effect in order to get the scroller to behave.

While this is clever, desktop and mobile devices (mobile mainly), heavily depend on the natural scroll events of these
elements to do helpful things for the user.
Like hiding the location url bar as you scroll down the window of the document (on mobile browsers), for instance. Or
[pausing heavy processes](http://developer.telerik.com/featured/scroll-event-change-ios-8-big-deal/), until
the user is done performing a task as to not interrupt them, or adding inertia or natural momentum when scrolling. So
it's increasingly important that the scroll logic added to these elements is done in a way that
lends nicely to these use cases, which is what this Scroll class does.

## Benefits

* pure, native javascript
* no css transitions, animations or absolute positioning hacks
* manually scroll to any portion of a page and detect when done
* safe to use on the `document.body` element
* supports easing functions when scrolling
* battery-friendly -- uses minimal amount of CPU power (no processing on inactive tabs, and hidden elements!)
* fast and smooth rendering (no choppiness)
* does not hijack native browser functionality (i.e. inertia scrolling, momentum defaults)
* native "onscroll" events can still be used ([window.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/window.onscroll) and
[Element.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onscroll))
* Both non-AMD and AMD compatible


## Installation

You can install the library as a npm module by running the following command: 

```
npm install scroll-js --save-dev
```

Alternatively, you can simply download one of the distribution files (un-minified or minified version) in the [/dist](/dist) folder and reference them directly in your html file.

```html
<script src="scroll.js"></script>

```

## Usage

In addition to the samples below, you can find more in the [examples](/examples) folder.

### Scrolling an element

You can manually scroll any element on a page and optionally detect when done. Just make sure the element you want to scroll has:

1. A specified `height` css property.
1. css `overflow` property that is set to `hidden`.
1. Content that extends beyond the specified height.

The following example scrolls the window (document body).

```javascript
var scroll = new Scroll(document.body);
scroll.to(0, 500).then(function () {
   //scrolling down 500 pixels has completed!
});

```

### Scroll to an element

```javascript
var myElement = document.body.getElementsByClassName('my-element')[0];
var scroll = new Scroll(document.body);
scroll.toElement(myElement).then(function () {
    // done scrolling to the element
});

```

### Scroll easing

Easing is also supported simply by passing an options object with easing.

```javascript
var scroll = new Scroll(document.body);
scroll.to(0, 200, {easing: 'easeInOutCubic', duration: 500}, function () {
    // scrolled down 200 pixels using the easeInOutCubic easing effect in 500 milliseconds!
});

```

### Detect scroll events

Listen in on native scroll events the same way you would if a user was scrolling with a mouse or touch event.

```javascript
var scroll = new Scroll(document.body);
window.onscroll = function () {
    // scrolling!
}
scroll.to(0, 300); // scroll to trigger event

```

## API

### Methods

[Scroll.constructor(\[containerElement:HTMLElement\])](#scroll-constructor)

Constructor initializes an element to be scrollable. Defaults to `document.body`.

[Scroll.to(x:Number, y:Number, \[options:Object\])](#scroll-to)

Scrolls the `containerElement` by the supplied `x` and `y` coordinates.


[Scroll.toElement(element:HTMLElement, \[options:Object\])](#scroll-to-element)

Scrolls the `containerElement` until it reaches the specified `element`. 


### Options

| Option | Type | Description |
|--------|--------|--------|
| `duration`| Number| The number of milliseconds the scroll will take to complete
| `easing`| String | The easing to use when scrolling



## Development

Run tests:

```
npm install
npm test
```
