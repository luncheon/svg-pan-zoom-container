import { clamp } from './utils'

declare global {
  interface Element {
    setAttribute(qualifiedName: string, value: string | number): void
  }
}

export interface ZoomOptions {
  readonly origin?: { clientX: number, clientY: number }
  readonly minScale?: number
  readonly maxScale?: number
}

export function getScale(container: HTMLElement) {
  const content = container.firstElementChild as SVGSVGElement
  const bbox = content.getBBox()
  const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
  const { width, height } = content.getBoundingClientRect()
  return containerWidth / bbox.width < containerHeight / bbox.height ? width / containerWidth : height / containerHeight
}

export function setScale(container: HTMLElement, value: number, options: ZoomOptions = {}) {
  const minScale = options.minScale || 1
  const maxScale = options.maxScale || 10
  const origin = options.origin
  const content = container.firstElementChild as SVGSVGElement
  const previousScale = getScale(container)
  const scale = clamp(value, minScale, maxScale)
  if (scale === previousScale) {
    return
  }
  const previousClientRect = content.getBoundingClientRect()
  const centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left
  const centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top
  const previousScrollLeft = container.scrollLeft - (parseFloat(content.style.marginLeft) || 0)
  const previousScrollTop = container.scrollTop - (parseFloat(content.style.marginTop) || 0)
  container.setAttribute('data-scale', scale)

  const containerRect = container.getBoundingClientRect()
  let width: number
  let height: number
  {
    const bbox = content.getBBox()
    if (containerRect.width / bbox.width < containerRect.height / bbox.height) {
      width = scale * containerRect.width
      height = width * bbox.height / bbox.width
    } else {
      height = scale * containerRect.height
      width = height * bbox.width / bbox.height
    }
  }
  width = Math.max(width, containerRect.width * minScale)
  height = Math.max(height, containerRect.height * minScale)
  content.style.width = `${width}px`
  content.style.height = `${height}px`

  content.style.margin = '0'
  const contentRect = content.getBoundingClientRect()
  const scrollLeft = previousScrollLeft + centerOffsetX * width / previousClientRect.width - centerOffsetX
  if (scrollLeft < 0) {
    content.style.marginLeft = `${-scrollLeft}px`
    container.scrollLeft = 0
  } else {
    content.style.marginRight = `${containerRect.right - contentRect.right + scrollLeft}px`
    container.scrollLeft = Math.round(scrollLeft)
    content.style.marginLeft = `${container.scrollLeft - scrollLeft}px`
  }

  const scrollTop = previousScrollTop + centerOffsetY * height / previousClientRect.height - centerOffsetY
  if (scrollTop < 0) {
    content.style.marginTop = `${-scrollTop}px`
    container.scrollTop = 0
  } else {
    content.style.marginBottom = `${containerRect.bottom - contentRect.bottom + scrollTop}px`
    container.scrollTop = Math.round(scrollTop)
    content.style.marginTop = `${container.scrollTop - scrollTop}px`
  }
}

export function resetScale(container: HTMLElement) {
  const content = container.firstElementChild as SVGSVGElement
  container.scrollLeft = container.scrollTop = 0
  content.style.width = content.style.height = content.style.margin = ''
  container.setAttribute('data-scale', 1)
}

export function zoom(container: HTMLElement, ratio: number, options?: ZoomOptions) {
  setScale(container, getScale(container) * ratio, options)
}
