"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomOnWheel = void 0;
const zoom_1 = require("./zoom");
const utils_1 = require("./utils");
const zoomOnWheel = (attributeName, defaultOptions, initializationOptions = {}) => {
    if (!initializationOptions.noEmitStyle) {
        (document.head || document.body || document.documentElement)
            .appendChild(document.createElement('style'))
            .textContent = `[${attributeName}]{overflow:scroll}[${attributeName}]>:first-child{width:100%;height:100%;vertical-align:middle;transform-origin:0 0}`;
    }
    addEventListener('wheel', event => {
        const [target, options] = (0, utils_1.findTargetAndParseOptions)(event.target, attributeName);
        if (target instanceof HTMLElement) {
            const zoomAmount = +options.zoomAmount || defaultOptions.zoomAmount;
            (0, zoom_1.zoom)(target, (1 + zoomAmount) ** -event.deltaY, {
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
                const options = (0, utils_1.parseOptions)(target.getAttribute(attributeName));
                (0, zoom_1.zoom)(target, 1, options);
            }
        }
    });
};
exports.zoomOnWheel = zoomOnWheel;
