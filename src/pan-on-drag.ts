import { pan } from './pan'
import { findTargetAndParseOptions } from './utils'

export interface PanOnDragOptions {
  readonly button: 'left' | 'right'
}

export function panOnDrag(attributeName: string, defaultOptions: PanOnDragOptions) {
  let panningContainer: HTMLElement | undefined

  addEventListener('pointerdown', event => {
    if (event.button !== 0 && event.button !== 2) {
      return
    }
    const [target, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (options && isPanButtonPressed(event, options, defaultOptions)) {
      panningContainer = target as HTMLElement
    }
  })

  addEventListener('pointermove', event => {
    if (panningContainer) {
      pan(panningContainer, event.movementX, event.movementY)
      event.preventDefault()
    }
  })

  addEventListener('pointerup', () => {
    panningContainer = undefined
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
