export const clamp = (value: number, min: number, max: number): number => value < min ? min : value > max ? max : value

export const getScaleAndOffset = (container: Element, content: HTMLElement | SVGElement): [number, number, number] => {
  const matrix = new DOMMatrix(content.style.transform)
  return [matrix.a, container.scrollLeft - matrix.e, container.scrollTop - matrix.f]
}

export const setScaleAndOffset = (container: Element, content: HTMLElement | SVGElement, scale: number, offsetX: number, offsetY: number) => {
  const scrollX = Math.round(Math.max(offsetX, 0))
  const scrollY = Math.round(Math.max(offsetY, 0))

  // setAttribute for Chrome, style.transform for Firefox and Safari
  content.setAttribute('transform', content.style.transform = `matrix(${scale},0,0,${scale},${scrollX - offsetX},${scrollY - offsetY})`)
  content.style.margin = 0 as number & string
  container.scrollLeft = scrollX
  container.scrollTop = scrollY
  if (container.scrollLeft !== scrollX) {
    content.style.marginRight = `${scrollX}px`
    container.scrollLeft = scrollX
  }
  if (container.scrollTop !== scrollY) {
    content.style.marginBottom = `${scrollY}px`
    container.scrollTop = scrollY
  }
}

export const parseOptions = (optionsString: string | undefined | null): Record<string, string> => {
  const options: Record<string, string> = {}
  if (optionsString) {
    for (const s of optionsString.split(';')) {
      const index = s.indexOf(':')
      options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, $0 => $0[0] + $0[2].toUpperCase())] = s.slice(index + 1).trim()
    }
  }
  return options
}

export const findTargetAndParseOptions = (element: Element | null, attributeName: string): [HTMLElement, Record<string, string>] | [] => {
  const target = element?.closest(`[${attributeName}]`)
  return target instanceof HTMLElement ? [target, parseOptions(target.getAttribute(attributeName))] : []
}
