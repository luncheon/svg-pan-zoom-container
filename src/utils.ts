export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

const closest: (element: Element | null, selector: string) => Element | null =
  Element.prototype.closest
  ? (element, selector) => element && element.closest(selector)
  : (element, selector) => {
    while (element && !element.matches(selector)) {
      element = element.parentElement
    }
    return element
  }

function parseOptions(optionsString: string | undefined | null): Record<string, string> {
  const options: Record<string, string> = {}
  if (optionsString) {
    for (const s of optionsString.split(';')) {
      const index = s.indexOf(':')
      options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, $0 => $0[0] + $0[2].toUpperCase())] = s.slice(index + 1).trim()
    }
  }
  return options
}

export function findTargetAndParseOptions(element: Element | null, attributeName: string): [Element, Record<string, string>] | [] {
  const target = closest(element, `[${attributeName}]`)
  return target ? [target, parseOptions(target.getAttribute(attributeName))] : []
}
