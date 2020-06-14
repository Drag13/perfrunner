import { existsSync } from "fs";
import { IReporter } from "perfrunner-reporters";

async function loadExternalReporter(path: string): Promise<IReporter> {
    const isFileExists = existsSync(path);
    if (!isFileExists) {
        throw new Error(`'External reporter not found in: ${path}`)
    }

    const module = await import(path);
    const isFunction = typeof module !== 'function'

    if (!isFunction) {
        throw new Error('External reporter found, but it is not a function')
    }

    return module as IReporter;
}

async function loadReporterFromReporters(path: string): Promise<IReporter> {
    const module = await import('perfrunner-reporters') as { [key: string]: unknown };
    const reporter = module[path];
    const exists = typeof reporter === 'function';

    if (!exists) {
        throw new Error(`Reporter: "${path}" doesn't exists in perfrunner-reporters package`);
    }

    return reporter as IReporter;
}

async function loader(path: string) {
    const isExternal = path.endsWith('.js');

    return isExternal ? await loadExternalReporter(path) : await loadReporterFromReporters(path);
}

export { loader };