import { getScaleAndOffset, setScaleAndOffset } from './utils'

export const pan = (container: HTMLElement, deltaX: number, deltaY: number) => {
  const content = container.firstElementChild as SVGSVGElement
  const [scale, previousOffsetX, previousOffsetY] = getScaleAndOffset(container, content)
  setScaleAndOffset(container, content, scale, previousOffsetX + deltaX, previousOffsetY + deltaY)
}
