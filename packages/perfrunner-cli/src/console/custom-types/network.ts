import { Original, Slow3g, HSPA, HSPA_Plus, FourG } from '../../params/network';

export const Network = (networkType: string | undefined) => {
    switch (networkType) {
        case 'online':
        case 'original':
            return Original;
        case 'slow-3g':
        case 'slow3g':
            return Slow3g;
        case 'hspa':
            return HSPA;
        case 'fast3g':
        case 'fast-3g':
        case 'hspaplus':
            return HSPA_Plus;
        case 'regular4g':
        case 'regular-4g':
            return FourG;
        default:
            throw new Error(`Unknow network setup: ${networkType}`);
    }
};
