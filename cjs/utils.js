"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTargetAndParseOptions = exports.parseOptions = exports.setScaleAndOffset = exports.getScaleAndOffset = exports.clamp = void 0;
const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
exports.clamp = clamp;
const getScaleAndOffset = (container, content) => {
    const matrix = new DOMMatrix(content.style.transform);
    return [matrix.a, container.scrollLeft - matrix.e, container.scrollTop - matrix.f];
};
exports.getScaleAndOffset = getScaleAndOffset;
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
exports.setScaleAndOffset = setScaleAndOffset;
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
exports.parseOptions = parseOptions;
const findTargetAndParseOptions = (element, attributeName) => {
    const target = element?.closest(`[${attributeName}]`);
    return target instanceof HTMLElement ? [target, (0, exports.parseOptions)(target.getAttribute(attributeName))] : [];
};
exports.findTargetAndParseOptions = findTargetAndParseOptions;
