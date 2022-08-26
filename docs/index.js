var svgPanZoomContainer = (function (exports) {
    'use strict';

    const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
    const getScaleAndOffset = (container, content) => {
        const matrix = new DOMMatrix(content.style.transform);
        return [matrix.a, container.scrollLeft - matrix.e, container.scrollTop - matrix.f];
    };
    const setScaleAndOffset = (container, content, scale, offsetX, offsetY) => {
        const scrollX = Math.round(Math.max(offsetX, 0));
        const scrollY = Math.round(Math.max(offsetY, 0));
        content.setAttribute('transform', content.style.transform = `matrix(${scale},0,0,${scale},${scrollX - offsetX},${scrollY - offsetY})`);
        content.style.margin = 0;
        container.scrollLeft = scrollX;
        container.scrollTop = scrollY;
        if (container.scrollLeft !== scrollX) {
            content.style.marginRight = `${scrollX}px`;
            container.scrollLeft = scrollX;
        }
        if (container.scrollTop !== scrollY) {
            content.style.marginBottom = `${scrollY}px`;
            container.scrollTop = scrollY;
        }
    };
    const parseOptions = (optionsString) => {
        const options = {};
        if (optionsString) {
            for (const s of optionsString.split(';')) {
                const index = s.indexOf(':');
                options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, $0 => $0[0] + $0[2].toUpperCase())] = s.slice(index + 1).trim();
            }
        }
        return options;
    };
    const findTargetAndParseOptions = (element, attributeName) => {
        const target = element?.closest(`[${attributeName}]`);
        return target instanceof HTMLElement ? [target, parseOptions(target.getAttribute(attributeName))] : [];
    };

    const pan = (container, deltaX, deltaY) => {
        const content = container.firstElementChild;
        const [scale, previousOffsetX, previousOffsetY] = getScaleAndOffset(container, content);
        setScaleAndOffset(container, content, scale, previousOffsetX + deltaX, previousOffsetY + deltaY);
    };

    const panOnDrag = (attributeName, defaultOptions) => {
        addEventListener('mousedown', event => {
            if (event.button !== 0 && event.button !== 2) {
                return;
            }
            const [target, options] = findTargetAndParseOptions(event.target, attributeName);
            if (!target || !options || !isPanButtonPressed(event, options, defaultOptions)) {
                return;
            }
            event.preventDefault();
            let previousClientX = event.clientX;
            let previousClientY = event.clientY;
            const onMouseMove = (event) => {
                pan(target, previousClientX - event.clientX, previousClientY - event.clientY);
                previousClientX = event.clientX;
                previousClientY = event.clientY;
                event.preventDefault();
            };
            const preventDefault = (event) => event.preventDefault();
            const onMouseUp = () => {
                removeEventListener('mouseup', onMouseUp);
                removeEventListener('mousemove', onMouseMove);
                setTimeout(() => removeEventListener('contextmenu', preventDefault));
            };
            addEventListener('mouseup', onMouseUp);
            addEventListener('mousemove', onMouseMove);
            addEventListener('contextmenu', preventDefault);
        });
    };
    const isPanButtonPressed = (event, options, defaultOptions) => (!options.modifier || event.getModifierState(options.modifier)) &&
        event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0);

    const getScale = (container) => getScaleAndOffset(container, container.firstElementChild)[0];
    const setScale = (container, value, options = {}) => {
        const scale = clamp(value, options.minScale || 1, options.maxScale || 10);
        const origin = options.origin;
        const content = container.firstElementChild;
        const [previousScale, previousOffsetX, previousOffsetY] = getScaleAndOffset(container, content);
        if (scale === previousScale) {
            return;
        }
        const offsetScale = scale / previousScale - 1;
        const previousClientRect = content.getBoundingClientRect();
        const centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left;
        const centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top;
        const offsetX = previousOffsetX + offsetScale * centerOffsetX;
        const offsetY = previousOffsetY + offsetScale * centerOffsetY;
        setScaleAndOffset(container, content, scale, offsetX, offsetY);
    };
    const resetScale = (container) => {
        const content = container.firstElementChild;
        content.style.margin = container.scrollLeft = container.scrollTop = 0;
        content.removeAttribute('transform');
        content.style.transform = '';
    };
    const zoom = (container, ratio, options) => setScale(container, getScale(container) * ratio, options);

    const zoomOnWheel = (attributeName, defaultOptions, initializationOptions = {}) => {
        if (!initializationOptions.noEmitStyle) {
            (document.head || document.body || document.documentElement)
                .appendChild(document.createElement('style'))
                .textContent = `[${attributeName}]{overflow:scroll}[${attributeName}]>:first-child{width:100%;height:100%;vertical-align:middle;transform-origin:0 0}`;
        }
        addEventListener('wheel', event => {
            const [target, options] = findTargetAndParseOptions(event.target, attributeName);
            if (target instanceof HTMLElement) {
                const zoomAmount = +options.zoomAmount || defaultOptions.zoomAmount;
                zoom(target, (1 + zoomAmount) ** -event.deltaY, {
                    origin: event,
                    minScale: +options.minScale || defaultOptions.minScale,
                    maxScale: +options.maxScale || defaultOptions.maxScale,
                });
                event.preventDefault();
            }
        }, { passive: false });
        addEventListener('resize', () => {
            const targets = document.querySelectorAll(`[${attributeName}]`);
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];
                if (target instanceof HTMLElement) {
                    const options = parseOptions(target.getAttribute(attributeName));
                    zoom(target, 1, options);
                }
            }
        });
    };

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
