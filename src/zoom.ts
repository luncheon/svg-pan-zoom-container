import { clamp, DomMatrix } from './utils'

export interface ZoomOptions {
  readonly origin?: { clientX: number, clientY: number }
  readonly minScale?: number
  readonly maxScale?: number
  readonly scalingProperty?: 'transform' | 'width/height'
}

export function getScale(container: Element, options: ZoomOptions = {}) {
  if (options.scalingProperty === 'transform') {
    return +(container && container.getAttribute('data-scale') || 1)
  } else {
    const content = container.firstElementChild as SVGSVGElement
    const bbox = content.getBBox()
    return container.clientWidth / bbox.width < container.clientHeight / bbox.height ? content.clientWidth / container.clientWidth : content.clientHeight / container.clientHeight
  }
}

export function setScale(container: Element, value: number, options: ZoomOptions = {}) {
  const minScale = options.minScale || 1
  const maxScale = options.maxScale || 10
  const origin = options.origin
  const content = container.firstElementChild as SVGSVGElement
  const previousScale = getScale(container, options)
  const scale = clamp(value, minScale, maxScale)
  if (scale === previousScale) {
    return
  }
  const actualRatio = scale / previousScale
  const previousScrollLeft = container.scrollLeft
  const previousScrollTop = container.scrollTop
  const previousClientRect = content.getBoundingClientRect()
  const previousCenterOffsetX = (origin && origin.clientX || 0) - previousClientRect.left
  const previousCenterOffsetY = (origin && origin.clientY || 0) - previousClientRect.top
  container.setAttribute('data-scale', scale as any as string)

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
    container.scrollLeft = Math.round(previousScrollLeft + previousCenterOffsetX * actualRatio - previousCenterOffsetX)
    container.scrollTop = Math.round(previousScrollTop + previousCenterOffsetY * actualRatio - previousCenterOffsetY)
  } else {
    const previousWidth = content.clientWidth
    const previousHeight = content.clientHeight
    const bbox = content.getBBox()
    let width: number
    let height: number
    if (container.clientWidth / bbox.width < container.clientHeight / bbox.height) {
      width = scale * container.clientWidth
      height = scale * container.clientWidth * bbox.height / bbox.width
    } else {
      width = scale * container.clientHeight * bbox.width / bbox.height
      height = scale * container.clientHeight
    }
    width = Math.max(width, container.clientWidth * minScale)
    height = Math.max(height, container.clientHeight * minScale)
    content.style.width = `${width}px`
    content.style.height = `${height}px`
    container.scrollLeft = Math.round(previousScrollLeft + previousCenterOffsetX * width / previousWidth - previousCenterOffsetX)
    container.scrollTop = Math.round(previousScrollTop + previousCenterOffsetY * height / previousHeight - previousCenterOffsetY)
  }
}

export function resetScale(container: Element, options?: ZoomOptions) {
  setScale(container, 1, options)
}

export function zoom(container: Element, ratio: number, options?: ZoomOptions) {
  setScale(container, getScale(container, options) * ratio, options)
}

function minus(n: number) {
  return -n
}
