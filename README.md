![build](https://img.shields.io/travis/markcellus/scroll-js)
![npm](https://img.shields.io/npm/v/scroll-js)
![node](https://img.shields.io/node/v/scroll-js)
![minified](https://img.shields.io/bundlephobia/min/scroll-js)
![downloads](https://img.shields.io/npm/dm/scroll-js)
![license](https://img.shields.io/npm/l/scroll-js)

# Scroll

A light-weight library that will allow you to scroll any html element using native javascript.
In addition to providing extra scrolling features, this library also aims to be a polyfill for the [scrollTo](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll)
and [scrollIntoView](https://drafts.csswg.org/cssom-view/#dom-element-scrollintoview) APIs and allows you to scroll
using animations that are based loosely on the
[`scrollOptions` of the DOM specification](https://drafts.csswg.org/cssom-view/#dictdef-scrolloptions).
Manipulates native scroll properties so that native events fire appropriately and uses browser's animation frames for
fast and smooth rendering.

## Why use this over other scroll libraries and plugins?

Many other scroller libraries use absolutely positioning, css animations, transitions and other types of workarounds directly on
the `window.document`, `<html>`, `<body>` and other elements to "fake" a scrolling effect in order to get the scroller to behave.

While this is clever, desktop and mobile devices (mobile mainly), heavily depend on the natural scroll events of these
elements to do helpful things for the user.
Like hiding the location url bar as you scroll down the window of the document (on mobile browsers), for instance. Or
[pausing heavy processes](http://developer.telerik.com/featured/scroll-event-change-ios-8-big-deal/), until
the user is done performing a task as to not interrupt them, or adding inertia or natural momentum when scrolling. So
it's increasingly important that the scroll logic added to these elements is done in a way that
lends nicely to these use cases, which is what this library does.

## Benefits

-   pure, native javascript
-   returns [Promises](https://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects) so you can do things when scrolling completes (`async`/`await` is supported)
-   no css transitions, animations or absolute positioning hacks
-   manually scroll to any portion of a page and detect when done
-   safe to use on the `document.body` element
-   supports scroll options from CSS DOM specification
-   battery-friendly -- uses minimal amount of CPU power (no processing on inactive tabs, and hidden elements!)
-   fast and smooth rendering (no choppiness)
-   does not hijack native browser functionality (i.e. inertia scrolling, momentum defaults)
-   native "onscroll" events can still be used ([window.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/window.onscroll) and
    [Element.onscroll](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onscroll))
-   Both non-AMD and AMD compatible

## Installation

You can install the library as a npm module by running the following command:

```
npm i scroll-js
```

Alternatively, you can simply download one of the distribution files (un-minified or minified version) in the [/dist](/dist) folder and reference them directly in your html file.

```html
<script src="node_modules/scroll-js/dist/scroll.js"></script>
```

## Usage

```js
import { scrollTo } from 'scroll-js';

scrollTo(window, { top: 500 }).then(function () {
    // window has scrolled 500 pixels down the page
});
```

In addition to the samples below, you can find more in the [examples](/examples) folder.

### Scrolling an element

You can manually scroll any element on a page and optionally detect when done. Just make sure the element you want to scroll has:

1. A specified `height` css property.
1. css `overflow` property that is set to `hidden`.
1. Content that extends beyond the specified height.

The following example scrolls the window (document body).

```javascript
import { scrollTo } from 'scroll-js';
scrollTo(document.body, { top: 500 }).then(function () {
    //scrolling down 500 pixels has completed!
});
```

### Scroll to an element

```javascript
import { scrollIntoView } from 'scroll-js';
var myElement = document.body.getElementsByClassName('my-element')[0];
scrollIntoView(myElement, document.body, { behavior: 'smooth' }).then(
    function () {
        // done scrolling document's body to show myElement
    }
);
```

### Scroll easing

You can scroll with easing using the [`behavior` option of the scrollTo specification](https://drafts.csswg.org/cssom-view/#enumdef-scrollbehavior).

```javascript
import { scrollTo } from 'scroll-js';
scrollTo(document.body, { top: 600, behavior: 'smooth' }).then(function () {
    // scrolled down 600 pixels smoothly
});
```

Easing is also supported simply by passing the `easing` option with an easing string that can be found in the
[src/scroll.ts file](/src/scroll.ts#L1).

```javascript
import { scrollTo } from 'scroll-js';
scrollTo(document.body, { top: 200, easing: 'ease-in-out' }).then(function () {
    // scrolled down 200 pixels, easing on beginning and end
});
```

Note that even though `easing` option is supported by this package,
it is not guaranteed that it will be supported by the specification.

### Detect scroll events

Listen in on native scroll events the same way you would if a user was scrolling with a mouse or touch event.

```javascript
import { scrollTo } from 'scroll-js';
window.addEventListener('scroll', function () {
    // scrolling!
});
scrollTo(document.body, { top: 300 }); // scroll to trigger event
```

## API Documentation

### scrollTo(element, options)

| Option    | Type              | Description                                                                                      |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `element` | `HTMLElement`     | The element to scroll                                                                            |
| `options` | `ScrollToOptions` | A set of scroll options (see writeup below) (i.e. `{behavior: 'smooth', top: '20', left: '0''}`) |

#### scrollTo Options

The `scrollTo` method allows a set of options which are synonymous with the
[ScrollToOptions](https://drafts.csswg.org/cssom-view/#dictdef-scrolltooptions) of the CSS specification,
but some additional ones are provided by this library until supported natively.

| Option     | Type   | Description                                                                                                                                                                                                                                                                                              |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `behavior` | String | The type of [scroll behavior](https://drafts.csswg.org/cssom-view/#enumdef-scrollbehavior) which can be set to `auto` or `smooth`. This is the recommended option since this is already natively supported. **If this is set, all other options are ignored**.                                           |
| `duration` | Number | The number of milliseconds the scroll will take to complete                                                                                                                                                                                                                                              |
| `easing`   | String | The easing to use when scrolling. Only keyword values of the [animation-timing-function](https://drafts.csswg.org/css-animations/#animation-timing-function) are supported. But passing function values will eventually be supported also (ie. `cubic-bezier(0.1, 0.7, 1.0, 0.1)`, `steps(4, end)`, etc) |

### scrollIntoView(element, [scroller], [options])

| Option     | Type                    | Description                                                                                                                      |
| ---------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `element`  | `HTMLElement`           | The element to scroll into the viewport                                                                                          |
| `scroller` | `HTMLElement`           | The element to be scrolled (defaults to `document.body`)                                                                         |
| `options`  | `ScrollIntoViewOptions` | A set of scroll options to scroll the element into view (see writeup below) (i.e. `{behavior: 'smooth', top: '20', left: '0''}`) |

#### scrollIntoView Options

A set of [ScrollIntoViewOptions](https://drafts.csswg.org/cssom-view/#dictdef-scrollintoviewoptions) can be passed to the `scrollIntoView` method.

| Option     | Type   | Description                                                                                                                                            |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `behavior` | String | The type of [scroll behavior](https://drafts.csswg.org/cssom-view/#enumdef-scrollbehavior) which can be set to `auto` or `smooth`. Defaults to `auto`. |

## Examples

Code samples showing how to use this package can be found in the [examples](examples) folder. To run them, pull down this project
and

```bash
npm start
```

Which will make the examples available at http://localhost:9383/examples/.

## Development

Run tests:

```
npm install
npm test
```
