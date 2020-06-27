import { latestBy } from '../../utils';
import { ExtendedPerformanceEntry } from '../types';
import { LARGEST_CONTENTFUL_PAINT } from './events';

export const onlyLatest = (entries: ExtendedPerformanceEntry[]) => {
    const latestLcpEvent = latestBy(
        entries,
        (x) => x.entryType === LARGEST_CONTENTFUL_PAINT,
        (x) => x.renderTime ?? x.loadTime ?? 0
    );

    return [latestLcpEvent];
};
