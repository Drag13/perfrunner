export const orderByDescending = <T>(list: T[], by: (v: T) => number) => list.sort((a, b) => by(b) - by(a));
