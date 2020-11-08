import { NetworkSetup } from 'perfrunner-core';
import {
    DEFAULT_NUMBER_RUNS,
    DEFAULT_OUTPUT_FOLDER,
    DEFAULT_REPORTER,
    DEFAULT_THROTTLING_RATE,
    DEFAULT_TIMEOUT,
    FourG,
    HSPA,
    HSPA_Plus,
    Original,
    Slow3g,
} from '../../config';

export type PageSetup = {
    url: string;
    waitFor: number | string;
    onAfterPageLoadedScript: string;
};

type Network = NetworkSetup & { disabled: boolean };

export type JsonConfig = {
    cache: boolean[];
    ignoreDefaultArgs: boolean;
    network: Network[];
    noHeadless: boolean;
    output: string;
    reportOnly: boolean;
    reporter: string[];
    runs: number;
    throttling: number;
    timeout: number;
    page: PageSetup[];
    testName: string | undefined;
    logLevel: string | undefined;
    chromeArgs: string[] | undefined;
    executablePath: string | undefined;
};

export const defaultJsonConfig: JsonConfig = {
    cache: [false],
    chromeArgs: undefined,
    executablePath: undefined,
    ignoreDefaultArgs: false,
    logLevel: undefined,
    network: [
        { ...Original, disabled: false },
        { ...HSPA_Plus, disabled: false },
        { ...Slow3g, disabled: true },
        { ...HSPA, disabled: true },
        { ...FourG, disabled: true },
    ],
    noHeadless: false,
    output: DEFAULT_OUTPUT_FOLDER,
    reportOnly: false,
    reporter: [DEFAULT_REPORTER],
    runs: DEFAULT_NUMBER_RUNS,
    throttling: DEFAULT_THROTTLING_RATE,
    timeout: DEFAULT_TIMEOUT,
    testName: undefined,
    page: [],
};
