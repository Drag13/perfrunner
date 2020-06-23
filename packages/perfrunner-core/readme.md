# Perfrunner-core

Runs tests and aggregates the result

## Installation

```cmd
npm i perfrunner-core -D
```

## Usage

```ts
import { profile } from 'perfrunner-core';

(async function () {
    const profilingResult = await profile({
        url: 'https://drag13.io',
        network: { downloadThroughput: 1000, uploadThroughput: 500, latency: 200 },
        output: './generated',
        runs: 5,
        throttlingRate: 4,
        timeout: 60000,
    });

    console.log(JSON.stringify(profilingResult));
});
```

## Tracing

After testing, you can find traces in chrome readable format inside the folder related to the test run (default - generated/<target_friendly_url>). This might be helpful for additional investigation
