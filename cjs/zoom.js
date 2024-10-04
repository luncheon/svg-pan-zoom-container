"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoom = exports.resetScale = exports.setScale = exports.getScale = void 0;
const utils_1 = require("./utils");
const getScale = (container) => (0, utils_1.getScaleAndOffset)(container, container.firstElementChild)[0];
exports.getScale = getScale;
const setScale = (container, value, options = {}) => {
    const scale = (0, utils_1.clamp)(value, options.minScale || 1, options.maxScale || 10);
    const origin = options.origin;
    const content = container.firstElementChild;
    const [previousScale, previousOffsetX, previousOffsetY] = (0, utils_1.getScaleAndOffset)(container, content);
    if (scale === previousScale) {
        return;
    }
    const offsetScale = scale / previousScale - 1;
    const previousClientRect = content.getBoundingClientRect();
    const centerOffsetX = (origin && origin.clientX || 0) - previousClientRect.left;
    const centerOffsetY = (origin && origin.clientY || 0) - previousClientRect.top;
    const offsetX = previousOffsetX + offsetScale * centerOffsetX;
    const offsetY = previousOffsetY + offsetScale * centerOffsetY;
    (0, utils_1.setScaleAndOffset)(container, content, scale, offsetX, offsetY);
};
exports.setScale = setScale;
const resetScale = (container) => {
    const content = container.firstElementChild;
    content.style.margin = container.scrollLeft = container.scrollTop = 0;
    content.removeAttribute('transform');
    content.style.transform = '';
};
exports.resetScale = resetScale;
const zoom = (container, ratio, options) => (0, exports.setScale)(container, (0, exports.getScale)(container) * ratio, options);
exports.zoom = zoom;
