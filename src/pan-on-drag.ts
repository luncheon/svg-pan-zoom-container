import { pan } from './pan'
import { findTargetAndParseOptions } from './utils'

export interface PanOnDragOptions {
  readonly button: 'left' | 'right'
}

export function panOnDrag(attributeName: string, defaultOptions: PanOnDragOptions) {
  let panningContainer: HTMLElement | undefined
  let clientX: number | undefined
  let clientY: number | undefined

  addEventListener('mousedown', event => {
    if (event.button !== 0 && event.button !== 2) {
      return
    }
    const [target, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (options && isPanButtonPressed(event, options, defaultOptions)) {
      panningContainer = target as HTMLElement
      clientX = event.clientX
      clientY = event.clientY
      event.preventDefault()
    }
  })

  addEventListener('mousemove', event => {
    if (panningContainer && typeof clientX === 'number' && typeof clientY === 'number') {
      pan(panningContainer, event.clientX - clientX, event.clientY - clientY)
      clientX = event.clientX
      clientY = event.clientY
      event.preventDefault()
    }
  })

  addEventListener('mouseup', () => {
    panningContainer = clientX = clientY = undefined
  })

  addEventListener('contextmenu', event => {
    const [, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (options && isPanButtonPressed(event, options, defaultOptions)) {
      event.preventDefault()
    }
  })
}

function isPanButtonPressed(event: MouseEvent, options: Record<string, string>, defaultOptions: PanOnDragOptions) {
  return event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0)
}
