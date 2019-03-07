export interface SvgPanZoomSelectOptions {
  readonly minScale: number
  readonly maxScale: number
  readonly onChange: (svgPanZoomSelect: SvgPanZoomSelect) => any
  readonly onSelect: (svgPanZoomSelect: SvgPanZoomSelect) => any
}

export default function svgPanZoomSelect(svg: SVGSVGElement, options: Partial<SvgPanZoomSelectOptions>) {
  return new SvgPanZoomSelect(svg, options)
}

class SvgPanZoomSelect {
  private _selectStartedPoint: { clientX: number, clientY: number } | undefined
  private _panning = false
  private _offsetX = 0
  private _offsetY = 0
  private _scale = 1

  get svg() { return this._svg }
  get offsetX() { return this._offsetX }
  get offsetY() { return this._offsetY }
  get scale() { return this._scale }
  get minScale() { return this._options.minScale || .01 }
  get maxScale() { return this._options.maxScale || 100 }

  constructor(private _svg: SVGSVGElement, private _options: Partial<SvgPanZoomSelectOptions>) {
    _svg.addEventListener('pointerdown', this._onPointerDown)
    addEventListener('pointerup', this._onPointerUp, true)
    addEventListener('pointermove', this._onPointerMove)
    _svg.addEventListener('wheel', this._onWheel)
    _svg.addEventListener('contextmenu', this._onContextMenu)
    const bbox = _svg.getBBox()
    _svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)
  }

  reset() {
    this._offsetX = 0
    this._offsetY = 0
    this._scale = 1
    this._redraw()
  }

  pan(deltaX?: number, deltaY?: number) {
    deltaX && (this._offsetX += deltaX)
    deltaY && (this._offsetY += deltaY)
    const limitX = this.svg.clientWidth * this.scale
    const limitY = this.svg.clientHeight * this.scale
    this._offsetX = limit(this._offsetX, -limitX, limitX)
    this._offsetY = limit(this._offsetY, -limitY, limitY)
    this._redraw()
  }

  zoom(deltaScale: number, centerX: number, centerY: number) {
    const scale = limit(this._scale * deltaScale, this.minScale, this.maxScale)
    deltaScale = scale / this._scale
    this._scale = scale
    const centerOffsetX = centerX - this.svg.clientWidth / 2
    const centerOffsetY = centerY - this.svg.clientHeight / 2
    this._offsetX = (this._offsetX + centerOffsetX) * deltaScale - centerOffsetX
    this._offsetY = (this._offsetY + centerOffsetY) * deltaScale - centerOffsetY
    this._redraw()
  }

  selectIntersection(area: ClientRect) {
  }

  private _redraw() {
    this._options.onChange && this._options.onChange(this)
    this.svg.style.transform = `matrix(${this._scale},0,0,${this._scale},${-this._offsetX},${-this._offsetY})`
  }

  private _onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) {
      event.preventDefault()
      this._selectStartedPoint = { clientX: event.clientX, clientY: event.clientY }
    } else if (event.button === 2) {
      event.preventDefault()
      this._panning = true
    }
  }

  private _onPointerMove = (event: PointerEvent) => {
    if (this._panning) {
      this.pan(-event.movementX, -event.movementY)
    }
    if (this._selectStartedPoint) {
      const rect = new DOMRect()
      rect.x = Math.min(this._selectStartedPoint.clientX, event.clientX)
      rect.y = Math.min(this._selectStartedPoint.clientY, event.clientY)
      rect.width = Math.abs(this._selectStartedPoint.clientX - event.clientX)
      rect.height = Math.abs(this._selectStartedPoint.clientY - event.clientY)
      this.selectIntersection(rect)
    }
  }

  private _onPointerUp = (event: PointerEvent) => {
    this._onPointerMove(event)
    this._panning = false
    this._selectStartedPoint = undefined
  }

  private _onWheel = (event: WheelEvent) => {
    event.preventDefault()
    this.zoom(1 + event.deltaY * .005, event.clientX, event.clientY)
  }

  private _onContextMenu = (event: Event) => {
    event.preventDefault()
  }
}

function limit(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value
}
