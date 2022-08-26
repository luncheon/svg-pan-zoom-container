import { clamp, getScaleAndOffset, setScaleAndOffset } from './utils'

export interface ZoomOptions {
  readonly origin?: {
    readonly clientX: number
    readonly clientY: number
  }
  readonly minScale?: number
  readonly maxScale?: number
}

export const getScale = (container: HTMLElement) => getScaleAndOffset(container, container.firstElementChild as SVGSVGElement)[0]

export const setScale = (container: HTMLElement, value: number, options: ZoomOptions = {}) => {
  const scale = clamp(value, options.minScale || 1, options.maxScale || 10)
  const origin = options.origin
  const content = container.firstElementChild as SVGSVGElement
  const [previousScale, previousOffsetX, previousOffsetY] = getScaleAndOffset(container, content)
  if (scale === previousScale) {
    return
  }
  const offsetScale = scale / previousScale - 1
  const previousClientRect = content.getBoundingClientRect()
  const centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left
  const centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top
  const offsetX = previousOffsetX + offsetScale * centerOffsetX
  const offsetY = previousOffsetY + offsetScale * centerOffsetY
  setScaleAndOffset(container, content, scale, offsetX, offsetY)
}

export const resetScale = (container: HTMLElement) => {
  const content = container.firstElementChild as SVGSVGElement
  content.style.margin = container.scrollLeft = container.scrollTop = 0 as number & string
  content.removeAttribute('transform')
  content.style.transform = ''
}

export const zoom = (container: HTMLElement, ratio: number, options?: ZoomOptions) => setScale(container, getScale(container) * ratio, options)
