export function pan(scrollable: Element, deltaX: number, deltaY: number) {
  scrollable.scrollLeft -= deltaX
  scrollable.scrollTop -= deltaY
}
