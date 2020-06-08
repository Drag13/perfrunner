// [https://github.com/ChromeDevTools/devtools-frontend/blob/80c102878fd97a7a696572054007d40560dcdd21/front_end/sdk/NetworkManager.js#L252-L274](Credits goes here)
// [https://stackoverflow.com/questions/48367042/in-chrome-dev-tools-what-is-the-speed-of-each-preset-option-for-network-throttl](Credits goes here)

import { NetworkSetup } from 'perfrunner-core/profiler/perf-options';


export const NoThrottlingConditions: NetworkSetup = {
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0
};

export const FourG: NetworkSetup = {
    downloadThroughput: 4 * 1024 * 1024,
    uploadThroughput: 3 * 1024 * 1024,
    latency: 20,
};

export const Fast3g: NetworkSetup = {
    downloadThroughput: 1.6 * 1024 * 1024 / 8 * .9,
    uploadThroughput: 750 * 1024 / 8 * .9,
    latency: 150 * 3.75,
};

export const Slow3g: NetworkSetup = {
    downloadThroughput: 500 * 1024 / 8 * .8,
    uploadThroughput: 500 * 1024 / 8 * .8,
    latency: 400 * 5,
};

export const NetworkCondtionFactory = (networkType: string | undefined) => {
    switch (networkType) {
        case 'no-throttling': return NoThrottlingConditions
        case 'slow-3g': return Slow3g;
        case 'regular-4g': return FourG;
        default: return Fast3g;
    }
};
