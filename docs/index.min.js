var svgPanZoomContainer=function(t){"use strict"
function c(t,e,n){t.scrollLeft+=e,t.scrollTop+=n}var M=window.DOMMatrix||window.WebKitCSSMatrix||window.MSCSSMatrix,n=Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector,r=Element.prototype.closest?function(t,e){return t&&t.closest(e)}:function(t,e){for(;t&&!n.call(t,e);)t=t.parentNode instanceof Element?t.parentNode:null
return t}
function i(t){var e={}
if(t)for(var n=0,r=t.split(";");n<r.length;n++){var i=r[n],o=i.indexOf(":")
e[i.slice(0,o).trim().replace(/[a-zA-Z0-9_]-[a-z]/g,function(t){return t[0]+t[2].toUpperCase()})]=i.slice(o+1).trim()}return e}function s(t,e){var n=r(t,"["+e+"]")
return n?[n,i(n.getAttribute(e))]:[]}function e(){}var o=!1
try{var a=Object.defineProperty({},"passive",{get:function(){o=!0}})
addEventListener("t",e,a),removeEventListener("t",e,a)}catch(t){o=!1}function d(t){return t.preventDefault()}var l,u,f=o?{passive:!1}:void 0
function A(t,e,n,r,i,o,a){var l=e+r*o-r,c=n+i*a-i
t.setAttribute("data-scroll-left",l),t.setAttribute("data-scroll-top",c),t.scrollLeft=Math.round(l),t.scrollTop=Math.round(c)}function C(t,e){if(void 0===e&&(e={}),"transform"===e.scalingProperty)return+(t&&t.getAttribute("data-scale")||1)
var n=t.firstElementChild,r=n.getBBox(),i=t.clientWidth,o=t.clientHeight
return i/r.width<o/r.height?n.clientWidth/i:n.clientHeight/o}function m(t,e,n){void 0===n&&(n={})
var r=n.minScale||1,i=n.maxScale||10,o=n.origin,a=t.firstElementChild,l=C(t,n),c=e<r?r:i<e?i:e
if(c!==l||"transform"!==n.scalingProperty){var s=c/l,d=a.getBoundingClientRect(),u=(o&&o.clientX||0)-d.left,f=(o&&o.clientY||0)-d.top,m=+t.getAttribute("data-scroll-left"),v=+t.getAttribute("data-scroll-top")
if(Math.round(m)!==t.scrollLeft&&(m=t.scrollLeft),Math.round(v)!==t.scrollTop&&(v=t.scrollTop),t.setAttribute("data-scale",c),"transform"===n.scalingProperty){var p=getComputedStyle(a),h=p.transformOrigin.split(" ").map(parseFloat),g=new M(p.transform);(g=g.translate.apply(g,h.map(P))).d=g.a===g.d?c:g.d*s,g.a=c,g=g.translate.apply(g,h),a.style.transform=g,a.setAttribute("transform",g),A(t,m,v,u,f,s,s)}else{var E=a.clientWidth,y=a.clientHeight,w=t.clientWidth,S=t.clientHeight,b=a.getBBox(),L=void 0,x=void 0
w/b.width<S/b.height?x=(L=c*w)*b.height/b.width:L=(x=c*S)*b.width/b.height,L=Math.max(L,w*r),x=Math.max(x,S*r),a.style.width=L+"px",a.style.height=x+"px",A(t,m,v,u,f,L/E,x/y)}}}function v(t,e,n){m(t,C(t,n)*e,n)}function P(t){return-t}return addEventListener("mousedown",function(t){if(0===t.button||2===t.button){var e=s(t.target,"data-pan-on-drag"),n=e[0],r=e[1]
if(n&&r&&t.button===("right"===(r.button||"left")?2:0)){t.preventDefault()
var i=t.clientX,o=t.clientY,a=function(t){c(n,i-t.clientX,o-t.clientY),i=t.clientX,o=t.clientY,t.preventDefault()},l=function(){removeEventListener("mouseup",l),removeEventListener("mousemove",a),removeEventListener("contextmenu",d)}
addEventListener("mouseup",l),addEventListener("mousemove",a),addEventListener("contextmenu",d)}}}),l="data-zoom-on-wheel",void 0===u&&(u={}),u.noEmitStyle||((document.head||document.body||document.documentElement).appendChild(document.createElement("style")).textContent="["+l+"]{overflow:scroll}["+l+"]>:first-child{width:100%;height:100%;vertical-align:middle}"),addEventListener("wheel",function(t){var e=s(t.target,l),n=e[0],r=e[1]
if(n instanceof HTMLElement){var i=+r.zoomAmount||.002
v(n,Math.pow(1+i,-t.deltaY),{origin:t,minScale:+r.minScale||1,maxScale:+r.maxScale||10,scalingProperty:r.scalingProperty||"width/height"}),t.preventDefault()}},f),addEventListener("resize",function(){for(var t=document.querySelectorAll("["+l+"]"),e=0;e<t.length;e++){var n=t[e]
if(n instanceof HTMLElement){var r=i(n.getAttribute(l))
v(n,1,r)}}}),t.getScale=C,t.pan=c,t.resetScale=function(t,e){m(t,1,e)},t.setScale=m,t.zoom=v,t}({})
