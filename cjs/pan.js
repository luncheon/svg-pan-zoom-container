"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pan = void 0;
const utils_1 = require("./utils");
const pan = (container, deltaX, deltaY) => {
    const content = container.firstElementChild;
    const [scale, previousOffsetX, previousOffsetY] = (0, utils_1.getScaleAndOffset)(container, content);
    (0, utils_1.setScaleAndOffset)(container, content, scale, previousOffsetX + deltaX, previousOffsetY + deltaY);
};
exports.pan = pan;
