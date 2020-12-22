import { clamp } from './utils'
import { getScale } from './zoom'

const calculateMargin = (previousMargin: number, delta: number, containerSize: number, contentSize: number) =>
  clamp(previousMargin - delta, 0, Math.max(previousMargin, containerSize - contentSize)) + 'px'

export function pan(container: HTMLElement, deltaX: number, deltaY: number) {
  const scale = getScale(container)
  if (scale < 1) {
    const content = container.firstElementChild as SVGSVGElement
    const containerRect = container.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const previousMarginRight = parseFloat(content.style.marginRight) || 0
    const previousMarginBottom = parseFloat(content.style.marginBottom) || 0
    content.style.marginLeft = calculateMargin(parseFloat(content.style.marginLeft) || 0, deltaX, containerRect.width, contentRect.width)
    content.style.marginRight = previousMarginRight ? clamp(previousMarginRight + deltaX, 0, previousMarginRight) + 'px' : '0'
    content.style.marginTop = calculateMargin(parseFloat(content.style.marginTop) || 0, deltaY, containerRect.height, contentRect.height)
    content.style.marginBottom = previousMarginBottom ? clamp(previousMarginBottom + deltaY, 0, previousMarginBottom) + 'px' : '0'
  } else {
    container.scrollLeft += deltaX
    container.scrollTop += deltaY
  }
}
