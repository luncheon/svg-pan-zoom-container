import { clamp, DomMatrix } from './utils'

export interface ZoomOptions {
  centerClientX?: number
  centerClientY?: number
  minScale?: number
  maxScale?: number
}

export function getScale(container: Element) {
  return +(container && container.firstElementChild && new DomMatrix(getComputedStyle(container.firstElementChild).transform!).a || 1)
}

export function setScale(container: Element, value: number, options: ZoomOptions = {}) {
  const content = container.firstElementChild as HTMLElement | SVGElement
  const computedStyle = getComputedStyle(content)
  const transformOrigin = computedStyle.transformOrigin!.split(' ').map(parseFloat)
  const matrix = new DomMatrix(computedStyle.transform!)
  const previousScale = matrix.a
  const scale = clamp(value, options.minScale || 1, options.maxScale || 10)
  if (scale === previousScale) {
    return
  }
  const actualRatio = scale / previousScale
  const previousScrollLeft = container.scrollLeft
  const previousScrollTop = container.scrollTop
  const previousClientRect = content.getBoundingClientRect()
  const previousCenterOffsetX = (options.centerClientX || 0) - previousClientRect.left
  const previousCenterOffsetY = (options.centerClientY || 0) - previousClientRect.top

  matrix.translateSelf(...transformOrigin.map(minus))
  matrix.d = matrix.a === matrix.d ? scale : matrix.d * actualRatio
  matrix.a = scale
  matrix.translateSelf(...transformOrigin)

  // for Firefox, Safari
  content.style.transform = matrix as any as string
  // for Chrome
  content.setAttribute('transform', matrix as any as string)

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
