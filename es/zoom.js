import { clamp, getScaleAndOffset, setScaleAndOffset } from './utils';
export const getScale = (container) => getScaleAndOffset(container, container.firstElementChild)[0];
export const setScale = (container, value, options = {}) => {
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
export const resetScale = (container) => {
    const content = container.firstElementChild;
    content.style.margin = container.scrollLeft = container.scrollTop = 0;
    content.removeAttribute('transform');
    content.style.transform = '';
};
export const zoom = (container, ratio, options) => setScale(container, getScale(container) * ratio, options);
