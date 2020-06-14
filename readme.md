# Perfrunner

## Key Features

## Options

|Command | Alias | Description | Default value | IsRequired |
| - | - | - | - | - |
| --url | - | Url to profile | **This option is required** | Required |
| --runs | -R | Number of runs you want to be performed| ```3``` | Optional |
| --network | - | Network setup: <```no-throttling```/```regular-4g```/```fast-3g```/```slow-3g```> | ```fast-3g``` | Optional
| --cache | -C | Using browser cahce | ```false``` | Optional
| --throttling | -T | CPU slowdown multiplier | ```2``` | Optional |
| --test-name | - | | ```undefined``` | Optional |
| --comment | - | Provide additional information about test. May be used from reporter | ```undefined``` | Optional
| --purge | - | Remove old data before the test run | ```false``` | Optional
| --report-only | - |Skips profiling session and only generates report| ```false``` | Optional |
| --wait-for | W | Specify selector or time in miliseconds to wait | ```undefined``` | Optional
| --timeout |  - | Set timeout for the single test run in miliseconds | ```60_000``` | Optional
| --no-headless | - | Disables headless mode |  ```false``` | Optional |
| --chrome-args | - | Additional arguments to pass to the browser instance. Should be passed using camelCase style like: ```"noSandbox"``` | ```undefined``` | Optional |
| --ignore-default-args | - | Ignore defaultArgs for launching Chromium | ```false``` | Optional |


## Installation

## Reporters

Supported reporters:

* basic - renders basic metrics (FCP, DCL, Size, etc)
* toJson - saves all data to json
* toCsv - saves all data to csv

## Basic

Generates output as HTML file. Includes:
* Performance Entreis Chart (DOM Content Loaded, First Paint, First Contentful Paint, DOM Interactive)
* Default Performance Metrics Chart - Layout Duration, Recalculation Style Duration, Script Duration, Task duration
* Resource Size Chart (JS, CSS ,IMG, Fonts, XHR)
* Performance Marks Chart - shows performance marks from application

Example:

This is default reporter so you don't need to name it

```cmd
perfrunner-cli drag13@github.io
```

You also can specify exact charts you want to see:

```cmd
perfrunner-cli drag13@github.io --reporter basic entries marks metrics size
```

### toJson

Generates output as json file

Example:

```cmd
perfrunner-cli drag13@github.io --report toJson
```

## toCsv

Generates output as CSV file

```cmd
perfrunner-cli drag13@github.io --report toCsv
```

## Thank You

* [raharrison](https://github.com/raharrison) for inspiration and examples