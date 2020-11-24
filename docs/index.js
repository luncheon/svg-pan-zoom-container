var svgPanZoomContainer = (function (exports) {
    'use strict';

    function pan(container, deltaX, deltaY) {
        container.scrollLeft += deltaX;
        container.scrollTop += deltaY;
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

    var preventDefault = function (event) { return event.preventDefault(); };
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
            var onMouseUp = function () {
                removeEventListener('mouseup', onMouseUp);
                removeEventListener('mousemove', onMouseMove);
                removeEventListener('contextmenu', preventDefault);
            };
            addEventListener('mouseup', onMouseUp);
            addEventListener('mousemove', onMouseMove);
            addEventListener('contextmenu', preventDefault);
        });
    }
    function isPanButtonPressed(event, options, defaultOptions) {
        return event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0);
    }

    function getScale(container) {
        var content = container.firstElementChild;
        var bbox = content.getBBox();
        var _a = container.getBoundingClientRect(), containerWidth = _a.width, containerHeight = _a.height;
        var _b = content.getBoundingClientRect(), width = _b.width, height = _b.height;
        return containerWidth / bbox.width < containerHeight / bbox.height ? width / containerWidth : height / containerHeight;
    }
    function setScale(container, value, options) {
        if (options === void 0) { options = {}; }
        var minScale = options.minScale || 1;
        var maxScale = options.maxScale || 10;
        var origin = options.origin;
        var content = container.firstElementChild;
        var previousScale = getScale(container);
        var scale = clamp(value, minScale, maxScale);
        if (scale === previousScale) {
            return;
        }
        var previousClientRect = content.getBoundingClientRect();
        var centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left;
        var centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top;
        var previousScrollLeft = container.scrollLeft - (parseFloat(content.style.marginLeft) || 0);
        var previousScrollTop = container.scrollTop - (parseFloat(content.style.marginTop) || 0);
        container.setAttribute('data-scale', scale);
        var containerRect = container.getBoundingClientRect();
        var width;
        var height;
        {
            var bbox = content.getBBox();
            if (containerRect.width / bbox.width < containerRect.height / bbox.height) {
                width = scale * containerRect.width;
                height = width * bbox.height / bbox.width;
            }
            else {
                height = scale * containerRect.height;
                width = height * bbox.width / bbox.height;
            }
        }
        width = Math.max(width, containerRect.width * minScale);
        height = Math.max(height, containerRect.height * minScale);
        content.style.width = width + "px";
        content.style.height = height + "px";
        content.style.margin = '0';
        var contentRect = content.getBoundingClientRect();
        var scrollLeft = previousScrollLeft + centerOffsetX * width / previousClientRect.width - centerOffsetX;
        if (scrollLeft < 0) {
            content.style.marginLeft = -scrollLeft + "px";
            container.scrollLeft = 0;
        }
        else {
            content.style.marginRight = containerRect.right - contentRect.right + scrollLeft + "px";
            container.scrollLeft = Math.round(scrollLeft);
            content.style.marginLeft = container.scrollLeft - scrollLeft + "px";
        }
        var scrollTop = previousScrollTop + centerOffsetY * height / previousClientRect.height - centerOffsetY;
        if (scrollTop < 0) {
            content.style.marginTop = -scrollTop + "px";
            container.scrollTop = 0;
        }
        else {
            content.style.marginBottom = containerRect.bottom - contentRect.bottom + scrollTop + "px";
            container.scrollTop = Math.round(scrollTop);
            content.style.marginTop = container.scrollTop - scrollTop + "px";
        }
    }
    function resetScale(container) {
        var content = container.firstElementChild;
        container.scrollLeft = container.scrollTop = 0;
        content.style.width = content.style.height = content.style.margin = '';
        container.setAttribute('data-scale', 1);
    }
    function zoom(container, ratio, options) {
        setScale(container, getScale(container) * ratio, options);
    }

    function zoomOnWheel(attributeName, defaultOptions, initializationOptions) {
        if (initializationOptions === void 0) { initializationOptions = {}; }
        if (!initializationOptions.noEmitStyle) {
            (document.head || document.body || document.documentElement)
                .appendChild(document.createElement('style'))
                .textContent = "[" + attributeName + "]{overflow:scroll}[" + attributeName + "]>:first-child{width:100%;height:100%;vertical-align:middle}";
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

    return exports;

}({}));
