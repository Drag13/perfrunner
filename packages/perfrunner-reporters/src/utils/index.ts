import { TRANSPARENT, color } from './colors';
import { toBytes, toMs } from './format';
import { init0, splitBy, initWithEmptyString, groupBy } from './array';
import { readFileAsync } from './fs';
import { defined, isNullOrEmpty, isNullOrNaN } from './misc';
import { ResourceType, getResourceType } from './res';
import { hash } from './hash';
import { exclude } from './object';
import { createElement } from './dom';
import {
    getFCP,
    getFP,
    getLCP,
    getDomInteractive,
    getScriptDuration,
    getLayoutDuration,
    getRecalculateStyleDuration,
    getNavigationEvent,
} from './eventExtractor';

export { TRANSPARENT, color };
export { toMs, toBytes };
export { init0, splitBy, initWithEmptyString, groupBy };
export { readFileAsync };
export { defined, isNullOrEmpty, isNullOrNaN };
export { ResourceType, getResourceType };
export { hash };
export { exclude };
export { createElement };
export {
    getFCP,
    getFP,
    getLCP,
    getDomInteractive,
    getScriptDuration,
    getLayoutDuration,
    getRecalculateStyleDuration,
    getNavigationEvent,
};
