var svgPanZoomContainer = (function (exports) {
  'use strict';

  var DomMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
  function fitViewBox(svg) {
      var bbox = svg.getBBox();
      svg.setAttribute('viewBox', bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height);
  }
  function reset(svgContainer) {
      var svg = svgContainer.firstElementChild;
      if (!(svg instanceof SVGSVGElement)) {
          throw Error('Element is not a container of a SVG element');
      }
      svg.removeAttribute('transform');
  }
  function pan(svgContainer, deltaX, deltaY) {
      svgContainer.scrollLeft -= deltaX;
      svgContainer.scrollTop -= deltaY;
  }
  function getScale(svgContainer) {
      var svg = svgContainer.firstElementChild;
      if (!(svg instanceof SVGSVGElement)) {
          throw Error('Element is not a container of a SVG element');
      }
      return new DomMatrix(getComputedStyle(svg).transform).a;
  }
  function zoom(svgContainer, ratio, options) {
      if (options === void 0) { options = {}; }
      var svg = svgContainer.firstElementChild;
      if (!(svg instanceof SVGSVGElement)) {
          throw Error('Element is not a container of a SVG element');
      }
      var previousScale = getScale(svgContainer);
      var scale = clamp(previousScale * ratio, options.minScale || 1, options.maxScale || 10);
      var actualRatio = scale / previousScale;
      var previousScrollLeft = svgContainer.scrollLeft + +(svgContainer.getAttribute('data-scroll-left-decimal-part') || 0);
      var previousScrollTop = svgContainer.scrollTop + +(svgContainer.getAttribute('data-scroll-top-decimal-part') || 0);
      var previousClientRect = svg.getBoundingClientRect();
      var previousCenterOffsetX = ((options.centerClientX || 0) - previousClientRect.left);
      var previousCenterOffsetY = ((options.centerClientY || 0) - previousClientRect.top);
      var scrollLeft = previousScrollLeft + previousCenterOffsetX * actualRatio - previousCenterOffsetX;
      var scrollTop = previousScrollTop + previousCenterOffsetY * actualRatio - previousCenterOffsetY;
      var scrollLeftInt = Math.floor(scrollLeft);
      var scrollTopInt = Math.floor(scrollTop);
      svg.setAttribute('transform', "scale(" + scale + ")");
      svg.style.transformOrigin = '0 0';
      svgContainer.scrollLeft = scrollLeftInt;
      svgContainer.scrollTop = scrollTopInt;
      svgContainer.setAttribute('data-scroll-left-decimal-part', (scrollLeft - scrollLeftInt));
      svgContainer.setAttribute('data-scroll-top-decimal-part', (scrollTop - scrollTopInt));
  }
  function clamp(value, min, max) {
      return value < min ? min : value > max ? max : value;
  }

  var Buttons = {
      left: 0,
      right: 2,
  };
  var defaultOptions = {
      panButton: 'left',
      wheelScaleRatio: .002
  };
  function parseOptions(optionsString) {
      if (!optionsString) {
          return defaultOptions;
      }
      var options = {};
      for (var _i = 0, _a = optionsString.split(';'); _i < _a.length; _i++) {
          var s = _a[_i];
          var index = s.indexOf(':');
          options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, function ($0) { return $0[0] + $0[2].toUpperCase(); })] = s.slice(index + 1).trim();
      }
      return {
          panButton: options.panButton === 'right' ? 'right' : 'left',
          wheelScaleRatio: +options.wheelScaleRatio || defaultOptions.wheelScaleRatio,
      };
  }
  function listen(svgContainerAttributeName) {
      (document.head || document.body || document.documentElement)
          .appendChild(document.createElement('style'))
          .textContent = "[" + svgContainerAttributeName + "]{overflow:scroll}[" + svgContainerAttributeName + "]";
      var panningContainer;
      addEventListener('pointerdown', function (event) {
          if (event.button !== 0 && event.button !== 2) {
              return;
          }
          var svgContainer = findTargetElement(event.target);
          if (!svgContainer) {
              return;
          }
          var options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName));
          if (event.button === Buttons[options.panButton]) {
              panningContainer = svgContainer;
          }
      });
      addEventListener('pointermove', function (event) {
          if (panningContainer) {
              pan(panningContainer, event.movementX, event.movementY);
          }
      });
      addEventListener('pointerup', function (event) {
          panningContainer = undefined;
      });
      addEventListener('wheel', function (event) {
          var svgContainer = findTargetElement(event.target);
          if (svgContainer) {
              var options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName));
              zoom(svgContainer, 1 + event.deltaY * options.wheelScaleRatio, { centerClientX: event.clientX, centerClientY: event.clientY });
              event.preventDefault();
          }
      });
      addEventListener('contextmenu', function (event) {
          var svgContainer = findTargetElement(event.target);
          if (svgContainer) {
              var options = parseOptions(svgContainer.getAttribute(svgContainerAttributeName));
              if (options.panButton === 'right') {
                  event.preventDefault();
              }
          }
      });
      function findTargetElement(element) {
          while (element && !element.hasAttribute(svgContainerAttributeName)) {
              element = element.parentElement;
          }
          return element;
      }
  }

  listen('data-svg-pan-zoom-container');

  exports.fitViewBox = fitViewBox;
  exports.reset = reset;
  exports.pan = pan;
  exports.getScale = getScale;
  exports.zoom = zoom;

  return exports;

}({}));
