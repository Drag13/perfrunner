export const PFormat = {
    toMs: (v: number) => v == null || isNaN(v) ? `` : `${Math.round(v)} ms`
};

const colors = ['#375E97', '#FB6542', '#FFBB00', `#3f681C`,  `#000000`];

export const PColor = {
    transparent: 'rgba(0, 0, 0, 0.0)',
    pick(i: number) {
        const index = i % colors.length;
        return colors[index];
    }
};