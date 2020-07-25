import { EntriesChartReporter } from './entries.chart';
import { MarksChartReporter } from './marks.chart';
import { ResourceSizeChart } from './size.chart';
import { MetricsChartReporter } from './metrics.chart';
import { ResourceSizeBeforeFCPChart } from './size-fcp.chart';

const entries = new EntriesChartReporter();
const marks = new MarksChartReporter();
const metrics = new MetricsChartReporter();
const resources = new ResourceSizeChart();
const resourcesBeforeFcp = new ResourceSizeBeforeFCPChart();

export const getReporterRegistry = () => {
    return {
        [entries.name]: entries,
        [marks.name]: marks,
        [resources.name]: resources,
        [metrics.name]: metrics,
        [resourcesBeforeFcp.name]: resourcesBeforeFcp,
    };
};

export const defaultReporterNames = [marks.name, entries.name, metrics.name, resourcesBeforeFcp.name, resources.name];
