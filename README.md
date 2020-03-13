# svg-pan-zoom-container

A vanilla-js module for adding zoom-on-wheel and pan-on-drag behavior to inline SVG elements.  
Very easy to use and lightweight (1.6kB minified gzipped) with no dependencies.

[Demo](https://luncheon.github.io/svg-pan-zoom-container/)


## Usage

1. Load this module.
2. Diddle the parent element of the inline SVG element:
    * Add `data-zoom-on-wheel` attribute to add zoom-on-wheel behavior.
    * Add `data-pan-on-drag` attribute to add pan-on-drag behavior.
    * Make sure that the container's `height` is not `"auto"`. The container's `height` must not be calculated from its content.

That's it!

This module does not care about the `viewBox` or `preserveAspectRatio`.  
Please set them appropriately.

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.2.7"></script>

<div
  data-zoom-on-wheel
  data-pan-on-drag
  style="height: 80vh;"
>
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</div>
```

[Run on CodePen](https://codepen.io/luncheon/pen/GeOVpw)


## Installation

### via [npm](https://www.npmjs.com/package/svg-pan-zoom-container) (with a module bundler)

```
$ npm i svg-pan-zoom-container
```

```js
import 'svg-pan-zoom-container'
```

### via CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/svg-pan-zoom-container))

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.2.7"></script>
```


## Options

Some options can be specified as `data-zoom-on-wheel` and `data-pan-on-drag` attribute value.  
Option name and value should be separated by colon (:).  
Multiple options should be separated by semicolon (;).

### Example

```html
<div
  data-zoom-on-wheel="zoom-amount: 0.01; max-scale: 20;"
  data-pan-on-drag="button: right;"
  style="height: 80vh;"
>
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</div>
```

[Run on CodePen](https://codepen.io/luncheon/pen/wOPVew)

### Options for `data-zoom-on-wheel`

| Name             | Type                          | Default        | Description                               |
| ---------------- | ----------------------------- | -------------- | ----------------------------------------- |
| zoom-amount      | number                        | 0.002          | Zoom amount per `deltaY` of wheel events. |
| min-scale        | number                        | 1              | Minimum scale.                            |
| max-scale        | number                        | 10             | Maximum scale.                            |
| scaling-property | "transform" \| "width/height" | "width/height" | Property to be modified for scaling.<br>If the `"transform"` is specified, both `transform` attribute and `transform` CSS property are modified (due to browser compatibility).<br>If the `"width/height"` is specified, `width` and `height` CSS properties are modified. |

### Options for `data-pan-on-drag`

| Name   | Type              | Default | Description                  |
| ------ | ----------------- | ------- | ---------------------------- |
| button | "left" \| "right" | "left"  | Mouse button to drag to pan. |


## Observation

### Zoom (scale) observation

This module does not fire any events but set `data-scale` attribute on the container element.  
Therefore, `MutationObserver` can be used to observe the scale as follows:

```javascript
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log('scale:', mutation.target.dataset.scale);
  });
});

observer.observe(document.getElementById('my-svg-container'), {
  attributes: true,
  attributeFilter: ['data-scale'],
});
```

### Pan (scroll) observation

`scroll` event is fired by panning since this module uses `overflow: scroll` style for scrolling.

```javascript
document
  .getElementById('my-svg-container')
  .addEventListener('scroll', function () {
    console.log({ scrollLeft: this.scrollLeft, scrollTop: this.scrollTop });
  });
```


## API

This module provides some functions for scripting to control pan and zoom behavior.  

### API usage

#### When installing via npm

```javascript
import { pan, zoom, getScale, setScale, resetScale } from 'svg-pan-zoom-container';
```

#### When installing via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.2.7"></script>
<script>
  const { pan, zoom, getScale, setScale, resetScale } = svgPanZoomContainer;
</script>
```

### pan(container, deltaX, deltaY)

Pans.  
Currently implemented as follows.

```javascript
// IE11 does not support `Element.prototype.scrollBy`.
container.scrollLeft += deltaX
container.scrollTop += deltaY
```

### getScale(container[, options])

Returns current scale.  
The return value is a 1-based fraction, not a percentage.

### setScale(container, value[, options])

Sets scale.  
The `value` is considered as 1-based fraction, not as percentage.

The `options` can be specified as part of the following object (following values are the default):

```javascript
const options = {
  origin: {
    clientX: 0,
    clientY: 0,
  },
  minScale: 1,
  maxScale: 10,
  scalingProperty: 'width/height',  // or 'transform'
};
```

See [options for data-zoom-on-wheel](#user-content-options-for-data-zoom-on-wheel) for details of `scalingProperty`.

### resetScale(container[, options])

Equivalents to `setScale(container, 1, options)`.

### zoom(container, ratio[, options])

Equivalents to `setScale(container, getScale(container) * ratio, options)`.


## License

[WTFPL](http://www.wtfpl.net)
