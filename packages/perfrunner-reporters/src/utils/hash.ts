export const hash = (text: string) => {
    let hash = 0;
    let chr: number;

    for (let i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }

    return hash.toString(16);
};
