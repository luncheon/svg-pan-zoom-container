var svgPanZoomContainer = (function (exports) {
    'use strict';

    function pan(container, deltaX, deltaY) {
        container.scrollLeft += deltaX;
        container.scrollTop += deltaY;
    }

    var DomMatrix = window.DOMMatrix || window.WebKitCSSMatrix || window.MSCSSMatrix;
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

    function moveScrollPosition(container, previousScrollLeft, previousScrollTop, centerOffsetX, centerOffsetY, widthRatio, heightRatio) {
        var scrollLeft = previousScrollLeft + centerOffsetX * widthRatio - centerOffsetX;
        var scrollTop = previousScrollTop + centerOffsetY * heightRatio - centerOffsetY;
        container.setAttribute('data-scroll-left', scrollLeft);
        container.setAttribute('data-scroll-top', scrollTop);
        container.scrollLeft = Math.round(scrollLeft);
        container.scrollTop = Math.round(scrollTop);
    }
    function getScale(container, options) {
        if (options === void 0) { options = {}; }
        if (options.scalingProperty === 'transform') {
            return +(container && container.getAttribute('data-scale') || 1);
        }
        else {
            var content = container.firstElementChild;
            var bbox = content.getBBox();
            var containerWidth = container.clientWidth;
            var containerHeight = container.clientHeight;
            return containerWidth / bbox.width < containerHeight / bbox.height ? content.clientWidth / containerWidth : content.clientHeight / containerHeight;
        }
    }
    function setScale(container, value, options) {
        if (options === void 0) { options = {}; }
        var minScale = options.minScale || 1;
        var maxScale = options.maxScale || 10;
        var origin = options.origin;
        var content = container.firstElementChild;
        var previousScale = getScale(container, options);
        var scale = clamp(value, minScale, maxScale);
        if (scale === previousScale && options.scalingProperty === 'transform') {
            return;
        }
        var actualRatio = scale / previousScale;
        var previousClientRect = content.getBoundingClientRect();
        var centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left;
        var centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top;
        var previousScrollLeft = +container.getAttribute('data-scroll-left');
        var previousScrollTop = +container.getAttribute('data-scroll-top');
        Math.round(previousScrollLeft) !== container.scrollLeft && (previousScrollLeft = container.scrollLeft);
        Math.round(previousScrollTop) !== container.scrollTop && (previousScrollTop = container.scrollTop);
        container.setAttribute('data-scale', scale);
        if (options.scalingProperty === 'transform') {
            var computedStyle = getComputedStyle(content);
            var transformOrigin = computedStyle.transformOrigin.split(' ').map(parseFloat);
            var matrix = new DomMatrix(computedStyle.transform);
            matrix = matrix.translate.apply(matrix, transformOrigin.map(minus));
            matrix.d = matrix.a === matrix.d ? scale : matrix.d * actualRatio;
            matrix.a = scale;
            matrix = matrix.translate.apply(matrix, transformOrigin);
            content.style.transform = matrix;
            content.setAttribute('transform', matrix);
            moveScrollPosition(container, previousScrollLeft, previousScrollTop, centerOffsetX, centerOffsetY, actualRatio, actualRatio);
        }
        else {
            var previousWidth = content.clientWidth;
            var previousHeight = content.clientHeight;
            var containerWidth = container.clientWidth;
            var containerHeight = container.clientHeight;
            var bbox = content.getBBox();
            var width = void 0;
            var height = void 0;
            if (containerWidth / bbox.width < containerHeight / bbox.height) {
                width = scale * containerWidth;
                height = width * bbox.height / bbox.width;
            }
            else {
                height = scale * containerHeight;
                width = height * bbox.width / bbox.height;
            }
            width = Math.max(width, containerWidth * minScale);
            height = Math.max(height, containerHeight * minScale);
            content.style.width = width + "px";
            content.style.height = height + "px";
            moveScrollPosition(container, previousScrollLeft, previousScrollTop, centerOffsetX, centerOffsetY, width / previousWidth, height / previousHeight);
        }
    }
    function resetScale(container, options) {
        setScale(container, 1, options);
    }
    function zoom(container, ratio, options) {
        setScale(container, getScale(container, options) * ratio, options);
    }
    function minus(n) {
        return -n;
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
                    scalingProperty: options.scalingProperty || defaultOptions.scalingProperty,
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
        scalingProperty: 'width/height',
    });

    exports.getScale = getScale;
    exports.pan = pan;
    exports.resetScale = resetScale;
    exports.setScale = setScale;
    exports.zoom = zoom;

    return exports;

}({}));
