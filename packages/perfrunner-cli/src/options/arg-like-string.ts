import { argsLike } from '../utils';

export const ArgsLikeString = (v: string | undefined) => (v ? `--${argsLike(v)}` : '');
