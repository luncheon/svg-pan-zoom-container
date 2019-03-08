const DomMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix

export function fitViewBox(svg: SVGSVGElement) {
  const bbox = svg.getBBox()
  svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
}

export function reset(svgContainer: Element) {
  const svg = svgContainer.firstElementChild
  if (!(svg instanceof SVGSVGElement)) {
    throw Error('Element is not a container of a SVG element')
  }
  svg.removeAttribute('transform')
}

export function pan(svgContainer: Element, deltaX: number, deltaY: number) {
  svgContainer.scrollLeft -= deltaX
  svgContainer.scrollTop -= deltaY
}

export interface ZoomOptions {
  centerClientX?: number
  centerClientY?: number
  minScale?: number
  maxScale?: number
}

export function getScale(svgContainer: Element) {
  const svg = svgContainer.firstElementChild
  if (!(svg instanceof SVGSVGElement)) {
    throw Error('Element is not a container of a SVG element')
  }
  return new DomMatrix(getComputedStyle(svg).transform!).a
}

export function zoom(svgContainer: Element, ratio: number, options: ZoomOptions = {}) {
  const svg = svgContainer.firstElementChild
  if (!(svg instanceof SVGSVGElement)) {
    throw Error('Element is not a container of a SVG element')
  }
  const previousScale = getScale(svgContainer)
  const scale = clamp(previousScale * ratio, options.minScale || 1, options.maxScale || 10)
  const actualRatio = scale / previousScale

  const previousScrollLeft = svgContainer.scrollLeft + +(svgContainer.getAttribute('data-scroll-left-decimal-part') || 0)
  const previousScrollTop = svgContainer.scrollTop + +(svgContainer.getAttribute('data-scroll-top-decimal-part') || 0)
  const previousClientRect = svg.getBoundingClientRect()
  const previousCenterOffsetX = ((options.centerClientX || 0) - previousClientRect.left)
  const previousCenterOffsetY = ((options.centerClientY || 0) - previousClientRect.top)
  const scrollLeft = previousScrollLeft + previousCenterOffsetX * actualRatio - previousCenterOffsetX
  const scrollTop = previousScrollTop + previousCenterOffsetY * actualRatio - previousCenterOffsetY
  const scrollLeftInt = Math.floor(scrollLeft)
  const scrollTopInt = Math.floor(scrollTop)

  svg.setAttribute('transform', `scale(${scale})`)
  svg.style.transformOrigin = '0 0'
  svgContainer.scrollLeft = scrollLeftInt
  svgContainer.scrollTop = scrollTopInt
  svgContainer.setAttribute('data-scroll-left-decimal-part', (scrollLeft - scrollLeftInt) as any)
  svgContainer.setAttribute('data-scroll-top-decimal-part', (scrollTop - scrollTopInt) as any)
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}
