import { panOnDrag } from './pan-on-drag'
import { zoomOnWheel } from './zoom-on-wheel'

export * from './pan'
export * from './zoom'

panOnDrag(
  'data-pan-on-drag',
  {
    button: 'left',
  },
)

zoomOnWheel(
  'data-zoom-on-wheel',
  {
    minScale: 1,
    maxScale: 10,
    zoomAmount: .002,
    scalingProperty: 'width/height',
  },
)
