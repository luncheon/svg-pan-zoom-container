import { clamp, DomMatrix } from './utils'

export interface ZoomOptions {
  readonly origin?: { clientX: number, clientY: number }
  readonly minScale?: number
  readonly maxScale?: number
  readonly scalingProperty?: 'transform' | 'width/height'
}

export function getScale(container: Element) {
  return +(container && container.getAttribute('data-scale') || 1)
}

export function setScale(container: Element, value: number, options: ZoomOptions = {}) {
  const content = container.firstElementChild as HTMLElement | SVGElement
  const previousScale = options.scalingProperty === 'transform' ? getScale(container) : content.clientWidth / container.clientWidth
  const scale = clamp(value, options.minScale || 1, options.maxScale || 10)
  if (scale === previousScale) {
    return
  }
  const actualRatio = scale / previousScale
  const previousScrollLeft = container.scrollLeft
  const previousScrollTop = container.scrollTop
  const previousClientRect = content.getBoundingClientRect()
  const previousCenterOffsetX = (options.origin && options.origin.clientX || 0) - previousClientRect.left
  const previousCenterOffsetY = (options.origin && options.origin.clientY || 0) - previousClientRect.top

  if (options.scalingProperty === 'transform') {
    const computedStyle = getComputedStyle(content)
    const transformOrigin = computedStyle.transformOrigin!.split(' ').map(parseFloat)
    let matrix = new DomMatrix(computedStyle.transform!)
    matrix = matrix.translate(...transformOrigin.map(minus))
    matrix.d = matrix.a === matrix.d ? scale : matrix.d * actualRatio
    matrix.a = scale
    matrix = matrix.translate(...transformOrigin)
    // for Firefox, Safari
    content.style.transform = matrix as any as string
    // for Chrome
    content.setAttribute('transform', matrix as any as string)
  } else {
    content.style.width = `${scale * container.clientWidth}px`
    content.style.height = `${scale * container.clientHeight}px`
  }

  container.setAttribute('data-scale', scale as any)
  container.scrollLeft = Math.round(previousScrollLeft + previousCenterOffsetX * actualRatio - previousCenterOffsetX)
  container.scrollTop = Math.round(previousScrollTop + previousCenterOffsetY * actualRatio - previousCenterOffsetY)
}

export function resetScale(container: Element, options?: ZoomOptions) {
  setScale(container, 1, options)
}

export function zoom(container: Element, ratio: number, options?: ZoomOptions) {
  setScale(container, getScale(container) * ratio, options)
}

function minus(n: number) {
  return -n
}
