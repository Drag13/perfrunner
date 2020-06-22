import { ResourceSizeChart } from './size.chart';
import { ExtendedPerformanceEntry } from 'perfrunner-core/dist/profiler/browser';
import { isNullOrNaN } from '../../../utils';

export class ResourceSizeBeforeFCPChart extends ResourceSizeChart {
    readonly name = 'size-fcp';
    readonly title = 'Resource Size Befor FCP';

    filter(rawData: ExtendedPerformanceEntry[]) {
        const entries = super.filter(rawData);

        const firstPaintEvent =
            rawData.find((x) => x.name === 'first-contentful-paint') ?? rawData.find((x) => x.name === 'first-paint');
        const fpeTime = firstPaintEvent?.startTime ?? Number.POSITIVE_INFINITY;

        return entries.filter((x) => !isNullOrNaN(x.responseEnd) && x.responseEnd < fpeTime);
    }
}
