var svgPanZoomContainer=function(t){"use strict"
function c(t,e,n){t.scrollLeft+=e,t.scrollTop+=n}var M=window.DOMMatrix||window.WebKitCSSMatrix||window.MSCSSMatrix
var n=Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector,r=Element.prototype.closest?function(t,e){return t&&t.closest(e)}:function(t,e){for(;t&&!n.call(t,e);)t=t.parentNode instanceof Element?t.parentNode:null
return t}
function o(t){var e={}
if(t)for(var n=0,r=t.split(";");n<r.length;n++){var o=r[n],i=o.indexOf(":")
e[o.slice(0,i).trim().replace(/[a-zA-Z0-9_]-[a-z]/g,function(t){return t[0]+t[2].toUpperCase()})]=o.slice(i+1).trim()}return e}function s(t,e){var n=r(t,"["+e+"]")
return n?[n,o(n.getAttribute(e))]:[]}function e(){}var i=!1
try{var a=Object.defineProperty({},"passive",{get:function(){i=!0}})
addEventListener("t",e,a),removeEventListener("t",e,a)}catch(t){i=!1}function u(t){return t.preventDefault()}var d,f,l,m,v,p=i?{passive:!1}:void 0
function A(t,e,n,r,o,i,a){var l=e+r*i-r,c=n+o*a-o
t.setAttribute("data-scroll-left",l),t.setAttribute("data-scroll-top",c),t.scrollLeft=Math.round(l),t.scrollTop=Math.round(c)}function C(t,e){if(void 0===e&&(e={}),"transform"===e.scalingProperty)return+(t&&t.getAttribute("data-scale")||1)
var n=t.firstElementChild,r=n.getBBox(),o=t.offsetWidth,i=t.offsetHeight
return o/r.width<i/r.height?n.clientWidth/o:n.clientHeight/i}function h(t,e,n){void 0===n&&(n={})
var r=n.minScale||1,o=n.maxScale||10,i=n.origin,a=t.firstElementChild,l=C(t,n),c=function(t,e,n){return t<e?e:n<t?n:t}(e,r,o)
if(c!==l||"transform"!==n.scalingProperty){var s=c/l,u=a.getBoundingClientRect(),d=(i&&i.clientX||0)-u.left,f=(i&&i.clientY||0)-u.top,m=+t.getAttribute("data-scroll-left"),v=+t.getAttribute("data-scroll-top")
if(Math.round(m)!==t.scrollLeft&&(m=t.scrollLeft),Math.round(v)!==t.scrollTop&&(v=t.scrollTop),t.setAttribute("data-scale",c),"transform"===n.scalingProperty){var p=getComputedStyle(a),h=p.transformOrigin.split(" ").map(parseFloat),g=new M(p.transform);(g=g.translate.apply(g,h.map(P))).d=g.a===g.d?c:g.d*s,g.a=c,g=g.translate.apply(g,h),a.style.transform=g,a.setAttribute("transform",g),A(t,m,v,d,f,s,s)}else{var y=a.clientWidth,E=a.clientHeight,S=t.offsetWidth,w=t.offsetHeight,b=a.getBBox(),x=void 0,L=void 0
S/b.width<w/b.height?L=(x=c*S)*b.height/b.width:x=(L=c*w)*b.width/b.height,x=Math.max(x,S*r),L=Math.max(L,w*r),a.style.width=x+"px",a.style.height=L+"px",A(t,m,v,d,f,x/y,L/E)}}}function g(t,e,n){h(t,C(t,n)*e,n)}function P(t){return-t}return d="data-pan-on-drag",f={button:"left"},addEventListener("mousedown",function(t){if(0===t.button||2===t.button){var e=s(t.target,d),n=e[0],r=e[1]
if(n&&r&&function(t,e,n){return t.button===("right"===(e.button||n.button)?2:0)}(t,r,f)){t.preventDefault()
var o=t.clientX,i=t.clientY,a=function(t){c(n,o-t.clientX,i-t.clientY),o=t.clientX,i=t.clientY,t.preventDefault()},l=function(){removeEventListener("mouseup",l),removeEventListener("mousemove",a),removeEventListener("contextmenu",u)}
addEventListener("mouseup",l),addEventListener("mousemove",a),addEventListener("contextmenu",u)}}}),l="data-zoom-on-wheel",m={minScale:1,maxScale:10,zoomAmount:.002,scalingProperty:"width/height"},void 0===v&&(v={}),v.noEmitStyle||((document.head||document.body||document.documentElement).appendChild(document.createElement("style")).textContent="["+l+"]{overflow:scroll}["+l+"]>:first-child{width:100%;height:100%;vertical-align:middle;}"),addEventListener("wheel",function(t){var e=s(t.target,l),n=e[0],r=e[1]
if(n instanceof HTMLElement){var o=+r.zoomAmount||m.zoomAmount
g(n,Math.pow(1+o,-t.deltaY),{origin:t,minScale:+r.minScale||m.minScale,maxScale:+r.maxScale||m.maxScale,scalingProperty:r.scalingProperty||m.scalingProperty}),t.preventDefault()}},p),addEventListener("resize",function(){for(var t=document.querySelectorAll("["+l+"]"),e=0;e<t.length;e++){var n=t[e]
if(n instanceof HTMLElement){var r=o(n.getAttribute(l))
g(n,1,r)}}}),t.getScale=C,t.pan=c,t.resetScale=function(t,e){h(t,1,e)},t.setScale=h,t.zoom=g,t}({})
