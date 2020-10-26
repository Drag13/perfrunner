import { IPerformanceResult } from 'perfrunner-core';
import { runTestSeries } from '../shared/run-series';
import { JsonConfig } from './json-config';
import { mapConfigToPerfOptions } from './map-config-params';

export async function runTestsFromConsole(config: JsonConfig): Promise<IPerformanceResult> {
    return await runTestSeries(config, mapConfigToPerfOptions);
}
