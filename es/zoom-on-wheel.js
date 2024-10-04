import { zoom } from './zoom';
import { findTargetAndParseOptions, parseOptions } from './utils';
export const zoomOnWheel = (attributeName, defaultOptions, initializationOptions = {}) => {
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
