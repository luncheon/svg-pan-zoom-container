var svgPanZoomContainer = (function (exports) {
    'use strict';

    var DomMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
    function clamp(value, min, max) {
        return value < min ? min : value > max ? max : value;
    }
    function getScaleAndOffset(container, content) {
        var matrix = new DomMatrix(content.style.transform);
        return [matrix.a, container.scrollLeft - matrix.e, container.scrollTop - matrix.f];
    }
    function setScaleAndOffset(container, content, scale, offsetX, offsetY) {
        var scrollX = Math.round(Math.max(offsetX, 0));
        var scrollY = Math.round(Math.max(offsetY, 0));
        content.setAttribute('transform', content.style.transform = "matrix(" + scale + ",0,0," + scale + "," + (scrollX - offsetX) + "," + (scrollY - offsetY) + ")");
        content.style.margin = 0;
        container.scrollLeft = scrollX;
        container.scrollTop = scrollY;
        if (container.scrollLeft !== scrollX) {
            content.style.marginRight = scrollX + "px";
            container.scrollLeft = scrollX;
        }
        if (container.scrollTop !== scrollY) {
            content.style.marginBottom = scrollY + "px";
            container.scrollTop = scrollY;
        }
    }
    var matches = Element.prototype.matches ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.msMatchesSelector;
    var closest = !!Element.prototype.closest
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
        return target instanceof HTMLElement ? [target, parseOptions(target.getAttribute(attributeName))] : [];
    }
    function noop() { }
    var passiveSupported = false;
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        addEventListener('t', noop, options);
        removeEventListener('t', noop, options);
    }
    catch (err) {
        passiveSupported = false;
    }
    var nonPassive = passiveSupported ? { passive: false } : undefined;

    function pan(container, deltaX, deltaY) {
        var content = container.firstElementChild;
        var _a = getScaleAndOffset(container, content), scale = _a[0], previousOffsetX = _a[1], previousOffsetY = _a[2];
        setScaleAndOffset(container, content, scale, previousOffsetX + deltaX, previousOffsetY + deltaY);
    }

    function panOnDrag(attributeName, defaultOptions) {
        addEventListener('mousedown', function (event) {
            if (event.button !== 0 && event.button !== 2) {
                return;
            }
            var _a = findTargetAndParseOptions(event.target, attributeName), target = _a[0], options = _a[1];
            if (!target || !options || !isPanButtonPressed(event, options, defaultOptions)) {
                return;
            }
            event.preventDefault();
            var previousClientX = event.clientX;
            var previousClientY = event.clientY;
            var onMouseMove = function (event) {
                pan(target, previousClientX - event.clientX, previousClientY - event.clientY);
                previousClientX = event.clientX;
                previousClientY = event.clientY;
                event.preventDefault();
            };
            var preventDefault = function (event) { return event.preventDefault(); };
            var onMouseUp = function () {
                removeEventListener('mouseup', onMouseUp);
                removeEventListener('mousemove', onMouseMove);
                setTimeout(function () { return removeEventListener('contextmenu', preventDefault); });
            };
            addEventListener('mouseup', onMouseUp);
            addEventListener('mousemove', onMouseMove);
            addEventListener('contextmenu', preventDefault);
        });
    }
    function isPanButtonPressed(event, options, defaultOptions) {
        return ((!options.modifier || event.getModifierState(options.modifier)) &&
            event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0));
    }

    function getScale(container) {
        return getScaleAndOffset(container, container.firstElementChild)[0];
    }
    function setScale(container, value, options) {
        if (options === void 0) { options = {}; }
        var scale = clamp(value, options.minScale || 1, options.maxScale || 10);
        var origin = options.origin;
        var content = container.firstElementChild;
        var _a = getScaleAndOffset(container, content), previousScale = _a[0], previousOffsetX = _a[1], previousOffsetY = _a[2];
        if (scale === previousScale) {
            return;
        }
        var offsetScale = scale / previousScale - 1;
        var previousClientRect = content.getBoundingClientRect();
        var centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left;
        var centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top;
        var offsetX = previousOffsetX + offsetScale * centerOffsetX;
        var offsetY = previousOffsetY + offsetScale * centerOffsetY;
        setScaleAndOffset(container, content, scale, offsetX, offsetY);
    }
    function resetScale(container) {
        var content = container.firstElementChild;
        content.style.margin = container.scrollLeft = container.scrollTop = 0;
        content.removeAttribute('transform');
        content.style.transform = '';
    }
    function zoom(container, ratio, options) {
        setScale(container, getScale(container) * ratio, options);
    }

    function zoomOnWheel(attributeName, defaultOptions, initializationOptions) {
        if (initializationOptions === void 0) { initializationOptions = {}; }
        if (!initializationOptions.noEmitStyle) {
            (document.head || document.body || document.documentElement)
                .appendChild(document.createElement('style'))
                .textContent = "[" + attributeName + "]{overflow:scroll}[" + attributeName + "]>:first-child{width:100%;height:100%;vertical-align:middle;transform-origin:0 0}";
        }
        addEventListener('wheel', function (event) {
            var _a = findTargetAndParseOptions(event.target, attributeName), target = _a[0], options = _a[1];
            if (target instanceof HTMLElement) {
                var zoomAmount = +options.zoomAmount || defaultOptions.zoomAmount;
                zoom(target, Math.pow((1 + zoomAmount), -event.deltaY), {
                    origin: event,
                    minScale: +options.minScale || defaultOptions.minScale,
                    maxScale: +options.maxScale || defaultOptions.maxScale,
                });
                event.preventDefault();
            }
        }, nonPassive);
        addEventListener('resize', function () {
            var targets = document.querySelectorAll("[" + attributeName + "]");
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                if (target instanceof HTMLElement) {
                    var options = parseOptions(target.getAttribute(attributeName));
                    zoom(target, 1, options);
                }
            }
        });
    }

    panOnDrag('data-pan-on-drag', {
        button: 'left',
    });
    zoomOnWheel('data-zoom-on-wheel', {
        minScale: 1,
        maxScale: 10,
        zoomAmount: .002,
    });

    exports.getScale = getScale;
    exports.pan = pan;
    exports.resetScale = resetScale;
    exports.setScale = setScale;
    exports.zoom = zoom;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
