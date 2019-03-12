export function pan(container: Element, deltaX: number, deltaY: number) {
  container.scrollLeft += deltaX
  container.scrollTop += deltaY
}
