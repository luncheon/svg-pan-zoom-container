# svg-pan-zoom-container

[![BundlePhobia](https://badgen.net/bundlephobia/minzip/svg-pan-zoom-container)](https://bundlephobia.com/result?p=svg-pan-zoom-container)
[![License: WTFPL](https://badgen.net/npm/license/svg-pan-zoom-container)](http://www.wtfpl.net)
[![npm](https://img.shields.io/npm/dm/svg-pan-zoom-container.svg?style=popout-square&label=npm&colorB=orange)](https://www.npmjs.com/package/svg-pan-zoom-container)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/svg-pan-zoom-container/badge?style=rounded)](https://www.jsdelivr.com/package/npm/svg-pan-zoom-container)

A vanilla-js module for adding zoom-on-wheel and pan-on-drag behavior to inline SVG elements.  
No need to write scripts. Just markup.

[Demo](https://luncheon.github.io/svg-pan-zoom-container/index.html)


## Usage

1. Load this module.
2. Diddle the parent element of the inline SVG element:
    * Add `data-zoom-on-wheel` attribute to add zoom-on-wheel behavior.
    * Add `data-pan-on-drag` attribute to add pan-on-drag behavior.
    * Make sure that the container's `height` is not `"auto"`. The container's `height` must not be calculated from its content.

That's it!

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.6.1"></script>

<div
  data-zoom-on-wheel
  data-pan-on-drag
  style="height: 80vh;"
>
  <svg viewBox="0 0 100 100">
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
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.6.1"></script>
```


## Options

Some options can be specified as `data-zoom-on-wheel` and `data-pan-on-drag` attribute value.  
Option name and value should be separated by colon (:).  
Multiple options should be separated by semicolon (;).

### Example

```html
<div
  data-zoom-on-wheel="zoom-amount: 0.01; min-scale: 0.3; max-scale: 20;"
  data-pan-on-drag="button: right;"
  style="height: 80vh;"
>
  <svg viewBox="0 0 100 100">
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

### Options for `data-pan-on-drag`

| Name    | Type                                          | Default | Description                                         |
| ------- | --------------------------------------------- | ------- | --------------------------------------------------- |
| button  | "left" \| "right"                             | "left"  | Mouse button to drag to pan.                        |
| modifier| "" \| "Alt" \| "Control" \| "Meta" \| "Shift" | ""      | Drag to pan only when this modifier key is pressed. |


## Observation

Observe the `transform` attribute of the SVG element using `MutationObserver`.

```javascript
const container = document.getElementById('my-svg-container')

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log('scale:', getScale(container));
  });
});

observer.observe(container.firstElementChild, {
  attributes: true,
  attributeFilter: ['transform'],
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
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.6.1"></script>
<script>
  const { pan, zoom, getScale, setScale, resetScale } = svgPanZoomContainer;
</script>
```

### pan(container, deltaX, deltaY)

Pans.

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
};
```

### resetScale(container)

Resets scale and scroll position.

### zoom(container, ratio[, options])

Equivalents to `setScale(container, getScale(container) * ratio, options)`.


## License

[WTFPL](http://www.wtfpl.net)
