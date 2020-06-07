import { argsLike } from '../utils/args-like';

export const ArgsLikeString = (v: string | undefined) => v ? `--${argsLike(v)}` : '';