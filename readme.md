# Perfrunner

## Purpose

## Options

|Command | Alias | Description | Default value | IsRequired |
| - | - | - | - | - |
| --url | - | Url to profile | **This option is required** | Required |
| --runs | - | Number of runs you want to be performed| ```3``` | Optional |
| --network | - | Network setup: ```no-throttling```, ```regular-4g```, ```slow-3g```, ```fast-3g``` | ```fast-3g``` | Optional
| --cache | - | If use cache set, run will be done after caching page resources | ```false``` | Optional
| --throttling | -T | CPU slowdown multiplier | ```2``` | Optional |
| --test-name | - | | ```undefined``` | Optional |
| --comment | - | Provide additional information about test. May be used from reporter | ```undefined``` | Optional
| --output | - | Specify folder to output | ```generated``` | Optional
| --purge | - | Remove old data before the test run | ```false``` | Optional
| --report-only | - |Skips profiling session and only generates report| ```false``` | Optional |
| --wait-for | - | Specify selector or time in miliseconds to wait | ```undefined``` | Optional
| --timeout |  - | Set timeout for the single test run in miliseconds | ```60_000``` | Optional
| --no-headless | - | Disables headless mode |  ```false``` | Optional |
| --chrome-args | - | Additional arguments to pass to the browser instance. Should be passed using camelCase style like: ```"noSandbox"``` | ```undefined``` | Optional |
| --ignore-default-args | - | Ignore defaultArgs for launching Chromium | ```false``` | Optional |


## Installation

## Reporters

## Thank You

