import { zoom } from './zoom'
import { findTargetAndParseOptions } from './utils'

export interface ZoomOnWheelOptions {
  readonly minScale: number
  readonly maxScale: number
  readonly wheelScaleRatio: number
}

export function zoomOnWheel(attributeName: string, defaultOptions: ZoomOnWheelOptions) {
  (document.head || document.body || document.documentElement)
    .appendChild(document.createElement('style'))
    .textContent = `[${attributeName}]{overflow:scroll}[${attributeName}]>:first-child{width:100%;height:100%;vertical-align:middle;}`

  addEventListener('wheel', event => {
    const [target, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (target) {
      const wheelScaleRatio = options && +options.wheelScaleRatio || defaultOptions.wheelScaleRatio
      zoom(target, 1 + event.deltaY * wheelScaleRatio, {
        centerClientX: event.clientX,
        centerClientY: event.clientY,
        minScale: options && +options.minScale || defaultOptions.minScale,
        maxScale: options && +options.maxScale || defaultOptions.maxScale,
      })
      event.preventDefault()
    }
  })
}
