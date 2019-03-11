declare interface Window {
  DOMMatrix: typeof DOMMatrix
  WebKitCSSMatrix: typeof DOMMatrix
  MSCSSMatrix: typeof DOMMatrix
}

declare interface Element {
  msMatchesSelector: typeof Element.prototype.matches
}
