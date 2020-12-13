import { argsLike } from '../utils';

export const toCmdDefinitions = <T>(options: T) => Object.entries(options).map(([k, v]) => ({ ...v, name: argsLike(k) }));
