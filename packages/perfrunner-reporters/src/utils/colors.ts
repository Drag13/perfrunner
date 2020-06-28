const colors = ['#375E97', '#FB6542', '#FFBB00', `#3f681C`, '#6f42c1', `#000000`];

export const TRANSPARENT = 'rgba(0, 0, 0, 0.0)';

export const color = (i: number) => colors[i % colors.length];
