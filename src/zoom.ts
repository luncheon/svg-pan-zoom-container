import { clamp } from './utils'

export interface ZoomOptions {
  centerClientX?: number
  centerClientY?: number
  minScale?: number
  maxScale?: number
}

export function getScale(container: Element) {
  return +(container && container.getAttribute('data-scale') || 1)
}

export function setScale(container: Element, value: number, options: ZoomOptions = {}) {
  const content = container.firstElementChild as HTMLElement | SVGElement
  const previousScale = getScale(container)
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

  content.style.width = content.style.height = `${scale * 100}%`
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
