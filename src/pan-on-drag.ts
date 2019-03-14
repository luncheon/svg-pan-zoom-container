import { pan } from './pan'
import { findTargetAndParseOptions } from './utils'

export interface PanOnDragOptions {
  readonly button: 'left' | 'right'
}

const preventDefault = (event: Event) => event.preventDefault()

export function panOnDrag(attributeName: string, defaultOptions: PanOnDragOptions) {
  addEventListener('mousedown', event => {
    if (event.button !== 0 && event.button !== 2) {
      return
    }
    const [target, options] = findTargetAndParseOptions(event.target as Element, attributeName)
    if (!target || !options || !isPanButtonPressed(event, options, defaultOptions)) {
      return
    }
    event.preventDefault()

    let previousClientX = event.clientX
    let previousClientY = event.clientY

    const onMouseMove = (event: MouseEvent) => {
      pan(
        target,
        previousClientX - event.clientX,
        previousClientY - event.clientY,
      )
      previousClientX = event.clientX
      previousClientY = event.clientY
      event.preventDefault()
    }

    const onMouseUp = () => {
      removeEventListener('mouseup', onMouseUp)
      removeEventListener('mousemove', onMouseMove)
      removeEventListener('contextmenu', preventDefault)
    }

    addEventListener('mouseup', onMouseUp)
    addEventListener('mousemove', onMouseMove)
    addEventListener('contextmenu', preventDefault)
  })
}

function isPanButtonPressed(event: MouseEvent, options: Record<string, string>, defaultOptions: PanOnDragOptions) {
  return event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0)
}
