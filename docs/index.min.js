var svgPanZoomContainer=function(e){"use strict"
var n=window.DOMMatrix||window.WebKitCSSMatrix||window.MSCSSMatrix
function c(e,t){return[(t=new n(t.style.transform)).a,e.scrollLeft-t.e,e.scrollTop-t.f]}function s(e,t,n,r,o){var i=Math.round(Math.max(r,0)),l=Math.round(Math.max(o,0))
t.setAttribute("transform",t.style.transform="matrix("+n+",0,0,"+n+","+(i-r)+","+(l-o)+")"),t.style.margin=0,e.scrollLeft=i,e.scrollTop=l,e.scrollLeft!==i&&(t.style.marginRight=i+"px",e.scrollLeft=i),e.scrollTop!==l&&(t.style.marginBottom=l+"px",e.scrollTop=l)}var r=Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.msMatchesSelector,o=Element.prototype.closest?function(e,t){return e&&e.closest(t)}:function(e,t){for(;e&&!r.call(e,t);)e=e.parentNode instanceof Element?e.parentNode:null
return e}
function i(e){var t={}
if(e)for(var n=0,r=e.split(";");n<r.length;n++){var o=r[n],i=o.indexOf(":")
t[o.slice(0,i).trim().replace(/[a-zA-Z0-9_]-[a-z]/g,function(e){return e[0]+e[2].toUpperCase()})]=o.slice(i+1).trim()}return t}function u(e,t){return(e=o(e,"["+t+"]"))instanceof HTMLElement?[e,i(e.getAttribute(t))]:[]}function t(){}var l=!1
try{var a=Object.defineProperty({},"passive",{get:function(){l=!0}})
addEventListener("t",t,a),removeEventListener("t",t,a)}catch(e){l=!1}var m,f,d,v=l?{passive:!1}:void 0
function p(e,t,n){var r=e.firstElementChild,o=c(e,r)
s(e,r,o[0],o[1]+t,o[2]+n)}function E(e){return e.preventDefault()}function h(e){return c(e,e.firstElementChild)[0]}function g(e,t,n){var r=(a=t,i=(n=void 0===n?{}:n).minScale||1,l=n.maxScale||10,a<i?i:l<a?l:a),o=n.origin,i=c(e,t=e.firstElementChild),l=i[0],a=i[1],n=i[2]
r!==l&&(i=r/l-1,l=t.getBoundingClientRect(),s(e,t,r,a+i*((o&&o.clientX||0)-l.left),n+i*((o&&o.clientY||0)-l.top)))}function L(e,t,n){g(e,h(e)*t,n)}return m={button:"left"},addEventListener("mousedown",function(e){var t,n,r,o,i,l,a
0!==e.button&&2!==e.button||(n=u(e.target,"data-pan-on-drag"),t=n[0],r=n[1],t&&r&&(n=r,r=m,e.button===("right"===(n.button||r.button)?2:0))&&(e.preventDefault(),o=e.clientX,i=e.clientY,l=function(e){p(t,o-e.clientX,i-e.clientY),o=e.clientX,i=e.clientY,e.preventDefault()},a=function(){removeEventListener("mouseup",a),removeEventListener("mousemove",l),removeEventListener("contextmenu",E)},addEventListener("mouseup",a),addEventListener("mousemove",l),addEventListener("contextmenu",E)))}),f="data-zoom-on-wheel",(d=void 0===d?{}:d).noEmitStyle||((document.head||document.body||document.documentElement).appendChild(document.createElement("style")).textContent="["+f+"]{overflow:scroll}["+f+"]>:first-child{width:100%;height:100%;vertical-align:middle;transform-origin:0 0}"),addEventListener("wheel",function(e){var t=u(e.target,f),n=t[0],r=t[1]
n instanceof HTMLElement&&(t=+r.zoomAmount||.002,L(n,Math.pow(1+t,-e.deltaY),{origin:e,minScale:+r.minScale||1,maxScale:+r.maxScale||10}),e.preventDefault())},v),addEventListener("resize",function(){for(var e=document.querySelectorAll("["+f+"]"),t=0;t<e.length;t++){var n,r=e[t]
r instanceof HTMLElement&&(n=i(r.getAttribute(f)),L(r,1,n))}}),e.getScale=h,e.pan=p,e.resetScale=function(e){var t=e.firstElementChild
t.style.margin=e.scrollLeft=e.scrollTop=0,t.removeAttribute("transform"),t.style.transform=""},e.setScale=g,e.zoom=L,Object.defineProperty(e,"__esModule",{value:!0}),e}({})
