export const latest = <T>(list: T[], by: (v: T) => number) => list.sort((a, b) => by(b) - by(a))[0];

export const latestBy = <T>(list: T[], filter: (el: T) => boolean, by: (v: T) => number) => latest(list.filter(filter), by);
