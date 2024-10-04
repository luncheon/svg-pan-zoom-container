"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.panOnDrag = void 0;
const pan_1 = require("./pan");
const utils_1 = require("./utils");
const panOnDrag = (attributeName, defaultOptions) => {
    addEventListener('mousedown', event => {
        if (event.button !== 0 && event.button !== 2) {
            return;
        }
        const [target, options] = (0, utils_1.findTargetAndParseOptions)(event.target, attributeName);
        if (!target || !options || !isPanButtonPressed(event, options, defaultOptions)) {
            return;
        }
        event.preventDefault();
        let previousClientX = event.clientX;
        let previousClientY = event.clientY;
        const onMouseMove = (event) => {
            (0, pan_1.pan)(target, previousClientX - event.clientX, previousClientY - event.clientY);
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
exports.panOnDrag = panOnDrag;
const isPanButtonPressed = (event, options, defaultOptions) => (!options.modifier || event.getModifierState(options.modifier)) &&
    event.button === ((options.button || defaultOptions.button) === 'right' ? 2 : 0);
