import { pan, zoom } from './core'

const Buttons = {
  left: 0,
  right: 2,
}

interface PanZoomResetOptions {
  readonly panButton: 'left' | 'right'
  readonly wheelScaleRatio: number
}

const defaultOptions: PanZoomResetOptions = {
  panButton: 'left',
  wheelScaleRatio: .002
}

function parseOptions(optionsString: string | undefined | null): PanZoomResetOptions {
  if (!optionsString) {
    return defaultOptions
  }
  const options: Record<string, string> = {}
  for (const s of optionsString.split(';')) {
    const index = s.indexOf(':')
    options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, $0 => $0[0] + $0[2].toUpperCase())] = s.slice(index + 1).trim()
  }
  return {
    panButton: options.panButton === 'right' ? 'right' : 'left',
    wheelScaleRatio: +options.wheelScaleRatio || defaultOptions.wheelScaleRatio,
  }
}

export function listen(svgContainerAttributeName: string) {
  (document.head || document.body || document.documentElement)
    .appendChild(document.createElement('style'))
    .textContent = `[${svgContainerAttributeName}]{overflow:scroll}[${svgContainerAttributeName}]`

  let panningContainer: HTMLElement | undefined

  addEventListener('pointerdown', event => {
    if (event.button !== 0 && event.button !== 2) {
      return
    }
    const svgContainer = findTargetElement(event.target as Element)
    if (!svgContainer) {
      return
    }
    const options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName))
    if (event.button === Buttons[options.panButton]) {
      panningContainer = svgContainer as HTMLElement
    }
  })

  addEventListener('pointermove', event => {
    if (panningContainer) {
      pan(panningContainer, event.movementX, event.movementY)
    }
  })

  addEventListener('pointerup', event => {
    panningContainer = undefined
  })

  addEventListener('wheel', event => {
    const svgContainer = findTargetElement(event.target as Element)
    if (svgContainer) {
      const options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName))
      zoom(svgContainer, 1 + event.deltaY * options.wheelScaleRatio, { centerClientX: event.clientX, centerClientY: event.clientY })
      event.preventDefault()
    }
  })

  addEventListener('contextmenu', event => {
    const svgContainer = findTargetElement(event.target as Element)
    if (svgContainer) {
      const options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName))
      if (options.panButton === 'right') {
        event.preventDefault()
      }
    }
  })

  function findTargetElement(element: Element | null): Element | null {
    while (element && !element.hasAttribute(svgContainerAttributeName)) {
      element = element.parentElement
    }
    return element
  }
}
