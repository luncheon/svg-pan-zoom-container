# svg-pan-zoom-container

A vanilla-js module for adding zoom-on-wheel and pan-on-drag behavior to inline SVG elements.

[Demo](https://luncheon.github.io/svg-pan-zoom-container/)

## Usage

1. Load this module.
2. Add `data-zoom-on-wheel` attribute and `data-pan-on-drag` attribute to the parent element of the inline SVG element.

That's it!

This module does not care about the `viewBox` or `preserveAspectRatio`.  
Please set them appropriately.

```html
<div
  data-zoom-on-wheel
  data-pan-on-drag
>
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</div>
```



## Installation

Coming soon...

<!--
### via [npm](https://www.npmjs.com/package/svg-pan-zoom-container) (with a module bundler)

```
$ npm i svg-pan-zoom-container
```

```js
import 'svg-pan-zoom-container'
```

### via CDN ([jsDelivr](https://www.jsdelivr.com/package/npm/svg-pan-zoom-container))

```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom-container@0.1.0"></script>
```
-->

## Options

Some options can be specified as `data-zoom-on-wheel` and `data-pan-on-drag` attribute value.  
Option name and value should be separated by colon.  
Multiple options should be separated by semicolon.

### Example

```html
<div
  data-zoom-on-wheel="zoom-amount: 0.01; max-scale: 20;"
  data-pan-on-drag="button: right"
>
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</div>
```

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


## License

[WTFPL](http://www.wtfpl.net)
