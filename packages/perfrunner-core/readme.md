# Perfrunner-core

Runs tests and aggregates the result

## Installation

```cmd
npm i perfrunner-core -D
```

## Usage

```ts
import { profile } from 'perfrunner-core';

(async function (){
    const profilingResult = await profile(
        {
            url: 'https://drag13.github.io',
            network: { downloadThroughput: 1000, uploadThroughput: 500, latency: 200 },
            output: './generated',
            runs: 5,
            throttlingRate: 4,
            timeout: 60,
        }
    )

    console.log(JSON.stringify(profilingResult));
});
```
