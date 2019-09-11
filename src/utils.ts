export const DomMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

const matches =
  Element.prototype.matches ||
  Element.prototype.webkitMatchesSelector ||
  Element.prototype.msMatchesSelector

const closest: (element: Element | null, selector: string) => Element | null =
  Element.prototype.closest
  ? (element, selector) => element && element.closest(selector)
  : (element, selector) => {
    while (element && !matches.call(element, selector)) {
      element = element.parentNode instanceof Element ? element.parentNode : null
    }
    return element
  }

export function parseOptions(optionsString: string | undefined | null): Record<string, string> {
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

function noop() {}

let passiveSupported = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    get() {
      passiveSupported = true;
    }
  })

  addEventListener('t', noop, options);
  removeEventListener('t', noop, options);
} catch(err) {
  passiveSupported = false;
}

export const nonPassive: AddEventListenerOptions | undefined = passiveSupported ? { passive: false } : undefined;
