# Perfrunner-core ![Build Status](https://travis-ci.org/Drag13/perfrunner.svg?branch=master) ![npm](https://img.shields.io/npm/dm/perfrunner-core)

This package was written to simplify performance testing for the web application. It supports:

* Network conditions - downloadThroughput, uploadThroughput, latency
* CPU throttling
* Browser caching and no caching
* Multiple runs against the same URL for better precision
* Chrome arguments
* Storing data between test runs
* Tracing in Chrome readable format for better investigation

## Installation

```cmd
npm i perfrunner-core -D
```

## Usage example

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

After testing, you can find traces in Chrome readable format inside the folder related to the test run. This might be helpful for additional investigation

## Tests

```cmd
npm test
```
