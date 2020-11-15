import { IReporter } from 'perfrunner-reporters';
import { loadExternalModule } from '../utils';

async function loadExternalReporter(path: string): Promise<IReporter> {
    return await loadExternalModule(path);
}

async function loadReporterFromReporters(path: string): Promise<IReporter> {
    const module = (await import('perfrunner-reporters')) as { [key: string]: unknown };
    const reporter = module[path] as IReporter;
    const exists = typeof reporter != null;

    if (!exists) {
        throw new Error(`Reporter: "${path}" doesn't exists in perfrunner-reporters package`);
    }

    const isFormed = typeof reporter.generateReport === 'function';

    if (!isFormed) {
        throw new Error(`Reporter: "${path}" doesn't contain generateReport function`);
    }

    return reporter;
}

export async function loadReporter(path: string) {
    const isExternal = path.endsWith('.js');

    return isExternal ? await loadExternalReporter(path) : await loadReporterFromReporters(path);
}
