import { ResourceSizeChart } from './size.chart';
import { ExtendedPerformanceEntry } from 'perfrunner-core';
import { getFCP, getFP, isNullOrNaN } from '../../../utils';

export class ResourceSizeBeforeFCPChart extends ResourceSizeChart {
    readonly name: string = 'size-fcp';
    readonly title = 'Resource Size Befor FCP';

    filter(rawData: ExtendedPerformanceEntry[]) {
        const fpeTime = (getFCP(rawData) || getFP(rawData)) ?? Number.POSITIVE_INFINITY;
        const entries = super.filter(rawData);

        return entries.filter((x) => !isNullOrNaN(x.responseEnd) && x.responseEnd < fpeTime);
    }
}
