import { getScaleAndOffset, setScaleAndOffset } from './utils';
export const pan = (container, deltaX, deltaY) => {
    const content = container.firstElementChild;
    const [scale, previousOffsetX, previousOffsetY] = getScaleAndOffset(container, content);
    setScaleAndOffset(container, content, scale, previousOffsetX + deltaX, previousOffsetY + deltaY);
};
