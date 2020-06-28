export const orderByAscending = <T>(list: T[], by: (v: T) => number) => list.sort((a, b) => by(b) - by(a));
