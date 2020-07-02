import { argsLike } from '../../utils/string';

export const ArgsLikeString = (v: string | undefined) => (v ? `--${argsLike(v)}` : '');
