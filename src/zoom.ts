import { clamp, DomMatrix } from './utils'

export interface ZoomOptions {
  readonly origin?: { clientX: number, clientY: number }
  readonly minScale?: number
  readonly maxScale?: number
  readonly scalingProperty?: 'transform' | 'width/height'
}

function moveScrollPosition(
  container: Element,
  previousScrollLeft: number,
  previousScrollTop: number,
  centerOffsetX: number,
  centerOffsetY: number,
  widthRatio: number,
  heightRatio: number,
) {
  const scrollLeft = previousScrollLeft + centerOffsetX * widthRatio - centerOffsetX
  const scrollTop = previousScrollTop + centerOffsetY * heightRatio - centerOffsetY
  container.setAttribute('data-scroll-left', scrollLeft as any as string)
  container.setAttribute('data-scroll-top', scrollTop as any as string)
  container.scrollLeft = Math.round(scrollLeft)
  container.scrollTop = Math.round(scrollTop)
}

export function getScale(container: HTMLElement, options: ZoomOptions = {}) {
  if (options.scalingProperty === 'transform') {
    return +(container && container.getAttribute('data-scale') || 1)
  } else {
    const content = container.firstElementChild as SVGSVGElement
    const bbox = content.getBBox()
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    return containerWidth / bbox.width < containerHeight / bbox.height ? content.clientWidth / containerWidth : content.clientHeight / containerHeight
  }
}

export function setScale(container: HTMLElement, value: number, options: ZoomOptions = {}) {
  const minScale = options.minScale || 1
  const maxScale = options.maxScale || 10
  const origin = options.origin
  const content = container.firstElementChild as SVGSVGElement
  const previousScale = getScale(container, options)
  const scale = clamp(value, minScale, maxScale)
  if (scale === previousScale && options.scalingProperty === 'transform') {
    return
  }
  const actualRatio = scale / previousScale
  const previousClientRect = content.getBoundingClientRect()
  const centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left
  const centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top
  let previousScrollLeft = +container.getAttribute('data-scroll-left')!
  let previousScrollTop = +container.getAttribute('data-scroll-top')!
  Math.round(previousScrollLeft) !== container.scrollLeft && (previousScrollLeft = container.scrollLeft)
  Math.round(previousScrollTop) !== container.scrollTop && (previousScrollTop = container.scrollTop)
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
    moveScrollPosition(container, previousScrollLeft, previousScrollTop, centerOffsetX, centerOffsetY, actualRatio, actualRatio)
  } else {
    const previousWidth = content.clientWidth
    const previousHeight = content.clientHeight
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const bbox = content.getBBox()
    let width: number
    let height: number
    if (containerWidth / bbox.width < containerHeight / bbox.height) {
      width = scale * containerWidth
      height = width * bbox.height / bbox.width
    } else {
      height = scale * containerHeight
      width = height * bbox.width / bbox.height
    }
    width = Math.max(width, containerWidth * minScale)
    height = Math.max(height, containerHeight * minScale)
    content.style.width = `${width}px`
    content.style.height = `${height}px`
    moveScrollPosition(container, previousScrollLeft, previousScrollTop, centerOffsetX, centerOffsetY, width / previousWidth, height / previousHeight)
  }
}

export function resetScale(container: HTMLElement, options?: ZoomOptions) {
  setScale(container, 1, options)
}

export function zoom(container: HTMLElement, ratio: number, options?: ZoomOptions) {
  setScale(container, getScale(container, options) * ratio, options)
}

function minus(n: number) {
  return -n
}
