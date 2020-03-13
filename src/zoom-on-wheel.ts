import { zoom, ZoomOptions } from './zoom'
import { findTargetAndParseOptions, nonPassive, parseOptions } from './utils'

export interface ZoomOnWheelOptions extends ZoomOptions {
  readonly zoomAmount: number
}

export function zoomOnWheel(attributeName: string, defaultOptions: ZoomOnWheelOptions, initializationOptions: { readonly noEmitStyle?: boolean } = {}) {
  if (!initializationOptions.noEmitStyle) {
    (document.head || document.body || document.documentElement)
      .appendChild(document.createElement('style'))
      .textContent = `[${attributeName}]{overflow:scroll}[${attributeName}]>:first-child{width:100%;height:100%;vertical-align:middle}`
  }

  addEventListener('wheel', event => {
    const [target, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (target instanceof HTMLElement) {
      const zoomAmount = +options!.zoomAmount || defaultOptions.zoomAmount
      zoom(target, (1 + zoomAmount) ** -event.deltaY, {
        origin: event,
        minScale: +options!.minScale || defaultOptions.minScale,
        maxScale: +options!.maxScale || defaultOptions.maxScale,
        scalingProperty: options!.scalingProperty as ZoomOptions['scalingProperty'] || defaultOptions.scalingProperty,
      })
      event.preventDefault()
    }
  }, nonPassive)

  addEventListener('resize', () => {
    const targets = document.querySelectorAll(`[${attributeName}]`)
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      if (target instanceof HTMLElement) {
        const options = parseOptions(target.getAttribute(attributeName))
        zoom(target, 1, options)
      }
    }
  })
}
