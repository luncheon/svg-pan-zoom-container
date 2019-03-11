var svgPanZoomContainer = (function (exports) {
  'use strict';

  function pan(scrollable, deltaX, deltaY) {
      scrollable.scrollLeft -= deltaX;
      scrollable.scrollTop -= deltaY;
  }

  function clamp(value, min, max) {
      return value < min ? min : value > max ? max : value;
  }
  var matches = Element.prototype.matches ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.msMatchesSelector;
  var closest = Element.prototype.closest
      ? function (element, selector) { return element && element.closest(selector); }
      : function (element, selector) {
          while (element && !matches.call(element, selector)) {
              element = element.parentNode instanceof Element ? element.parentNode : null;
          }
          return element;
      };
  function parseOptions(optionsString) {
      var options = {};
      if (optionsString) {
          for (var _i = 0, _a = optionsString.split(';'); _i < _a.length; _i++) {
              var s = _a[_i];
              var index = s.indexOf(':');
              options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, function ($0) { return $0[0] + $0[2].toUpperCase(); })] = s.slice(index + 1).trim();
          }
      }
      return options;
  }
  function findTargetAndParseOptions(element, attributeName) {
      var target = closest(element, "[" + attributeName + "]");
      return target ? [target, parseOptions(target.getAttribute(attributeName))] : [];
  }

  function panOnDrag(attributeName, defaultOptions) {
      var panningContainer;
      var clientX;
      var clientY;
      addEventListener('pointerdown', function (event) {
          if (event.button !== 0 && event.button !== 2) {
              return;
          }
          var _a = findTargetAndParseOptions(event.target, attributeName), target = _a[0], options = _a[1];
          if (options && isPanButtonPressed(event, options, defaultOptions)) {
              panningContainer = target;
              clientX = event.clientX;
              clientY = event.clientY;
              event.preventDefault();
          }
      });
      addEventListener('pointermove', function (event) {
          if (panningContainer && typeof clientX === 'number' && typeof clientY === 'number') {
              pan(panningContainer, event.clientX - clientX, event.clientY - clientY);
              clientX = event.clientX;
              clientY = event.clientY;
              event.preventDefault();
          }
      });
      addEventListener('pointerup', function () {
          panningContainer = clientX = clientY = undefined;
      });
      addEventListener('contextmenu', function (event) {
          var _a = findTargetAndParseOptions(event.target, attributeName), options = _a[1];
          if (options && isPanButtonPressed(event, options, defaultOptions)) {
              event.preventDefault();
          }
      });
  }
  function isPanButtonPressed(event, options, defaultOptions) {
      return event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0);
  }

  function getScale(container) {
      return +(container && container.getAttribute('data-scale') || 1);
  }
  function setScale(container, value, options) {
      if (options === void 0) { options = {}; }
      var content = container.firstElementChild;
      var previousScale = getScale(container);
      var scale = clamp(value, options.minScale || 1, options.maxScale || 10);
      if (scale === previousScale) {
          return;
      }
      var actualRatio = scale / previousScale;
      var previousScrollLeft = container.scrollLeft;
      var previousScrollTop = container.scrollTop;
      var previousClientRect = content.getBoundingClientRect();
      var previousCenterOffsetX = (options.centerClientX || 0) - previousClientRect.left;
      var previousCenterOffsetY = (options.centerClientY || 0) - previousClientRect.top;
      content.style.width = content.style.height = scale * 100 + "%";
      container.setAttribute('data-scale', scale);
      container.scrollLeft = Math.round(previousScrollLeft + previousCenterOffsetX * actualRatio - previousCenterOffsetX);
      container.scrollTop = Math.round(previousScrollTop + previousCenterOffsetY * actualRatio - previousCenterOffsetY);
  }
  function resetScale(container, options) {
      setScale(container, 1, options);
  }
  function zoom(container, ratio, options) {
      setScale(container, getScale(container) * ratio, options);
  }

  function zoomOnWheel(attributeName, defaultOptions) {
      (document.head || document.body || document.documentElement)
          .appendChild(document.createElement('style'))
          .textContent = "[" + attributeName + "]{overflow:scroll}[" + attributeName + "]>:first-child{width:100%;height:100%;vertical-align:middle;}";
      addEventListener('wheel', function (event) {
          var _a = findTargetAndParseOptions(event.target, attributeName), target = _a[0], options = _a[1];
          if (target) {
              var wheelScaleRatio = options && +options.wheelScaleRatio || defaultOptions.wheelScaleRatio;
              zoom(target, 1 + event.deltaY * wheelScaleRatio, {
                  centerClientX: event.clientX,
                  centerClientY: event.clientY,
                  minScale: options && +options.minScale || defaultOptions.minScale,
                  maxScale: options && +options.maxScale || defaultOptions.maxScale,
              });
              event.preventDefault();
          }
      });
  }

  panOnDrag('data-pan-on-drag', {
      button: 'left',
  });
  zoomOnWheel('data-zoom-on-wheel', {
      minScale: 1,
      maxScale: 10,
      wheelScaleRatio: .002,
  });

  exports.pan = pan;
  exports.getScale = getScale;
  exports.setScale = setScale;
  exports.resetScale = resetScale;
  exports.zoom = zoom;

  return exports;

}({}));
