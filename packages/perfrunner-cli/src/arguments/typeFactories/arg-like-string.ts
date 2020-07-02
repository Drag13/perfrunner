const argsLike = (v: string) =>
    v
        .split(/(?=[A-Z])/g)
        .join('-')
        .toLowerCase();

export const ArgsLikeString = (v: string | undefined) => (v ? `--${argsLike(v)}` : '');
