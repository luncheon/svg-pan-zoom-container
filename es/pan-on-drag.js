import { pan } from './pan';
import { findTargetAndParseOptions } from './utils';
export const panOnDrag = (attributeName, defaultOptions) => {
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
