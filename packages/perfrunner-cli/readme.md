# Perfrunner-CLI [![Build Status](https://travis-ci.org/Drag13/perfrunner.svg?branch=master)](https://travis-ci.org/Drag13/perfrunner)

Command-line-interface for the [perfrunner](https://github.com/Drag13/perfrunner/tree/development/packages/perfrunner-core) - an automated tool for tracking performance for the web app and site.

## Example

![default-html-reporter-example-angular-react-vue](https://raw.githubusercontent.com/Drag13/perfrunner/master/packages/perfrunner-cli/docs/default-html-reporter-example-angular-react-vue.PNG)

## Installation

To save it into your project:

```cmd
npm i perfrunner -D
```

For one-time usage:

```cmd
npx perfrunner https://drag13.io
```

## Options

|Command | Alias | Description | Default value | IsRequired |
| - | - | - | - | - |
| --cache | -C | Using browser cahce | ```false``` | Optional
| --chrome-args | - | Additional arguments to pass to the browser instance. Should be passed using camelCase style like: ```"noSandbox"``` | ```undefined``` | Optional |
| --comment | - | Provide additional information about test. May be used from reporter | ```undefined``` | Optional
| --ignore-default-args | - | Ignore defaultArgs for launching Chromium | ```false``` | Optional |
| --log-level| - | Setup log level: <```verbose```> | ```undefined``` | Optional |
| --network | - | Network setup: <```online```/```regular-4g```/```fast-3g```/```hspa```/```slow-3g```> | ```fast-3g``` | Optional
| --no-headless | - | Disables headless mode |  ```false``` | Optional |
| --purge | - | Remove old data before the test run | ```false``` | Optional
| --reporter | - | Specify reporter | ```html``` | Optional |
| --report-only | - |Skips profiling session and only generates report| ```false``` | Optional |
| --runs | -R | Number of runs you want to be performed| ```3``` | Optional |
| --test-name | - | | ```undefined``` | Optional |
| --throttling | -T | CPU slowdown multiplier | ```2``` | Optional |
| --timeout |  - | Set timeout for the single test run in miliseconds | ```60_000``` | Optional
| --url | - | Url to profile | - | Required |
| --wait-for | W | Specify selector or time in miliseconds to wait | ```undefined``` | Optional

## Reporters

Supported reporters:

* [html](#html) - renders basic metrics into HTML (FCP, DCL, Size, etc)
* [json](#json) - saves all data to json
* [csv](#csv) - saves all data to csv
* [custom](#custom) - you can specify your own custom reporter

## HTML

Generates output as an HTML file. Includes:
* Performance Entries Chart (DOM Content Loaded, First Paint, First Contentful Paint, DOM Interactive)
* Default Performance Metrics Chart - Layout Duration, Recalculation Style Duration, Script Duration, Task duration
* Resource Size Chart (JS, CSS ,IMG, Fonts, XHR)
* Performance Marks Chart - shows performance marks from application

Example:

This is default reporter so you don't need to name it

```cmd
npx perfrunner drag13@github.io
```

### JSON

Generates output as JSON file

Example:

```cmd
npx perfrunner drag13@github.io --reporter json
```

## CSV

Generates output as CSV file

```cmd
npx perfrunner drag13@github.io --reporter csv
```

## Custom

You also can use your own custom reporter

```cmd
npx perfrunner https://drag13.io --reporter my-custom-reporter.js
```

where reporter should looks like:

```js
module.exports = (outputFolder, data, args) => console.log(outputFolder, JSON.stringify(data), args);
```

## Troubleshooting

Internally, perfrunner uses [puppeteer](https://github.com/puppeteer/puppeteer), so please check [this](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md) page for troubleshooting.
Perfrunner supports passing chromeArgs and ignoreDefaults flags for better control from your side:

```cmd
npx perfrunner https://drag13.io --ignore-default-args --chrome-args noSandbox
```

You also can use Perfrunner without headless mode

```cmd
npx perfrunner https://drag13.io --no-headless
```

## What next

For the next updates, please check the [project](https://github.com/Drag13/perfrunner/projects/1). It's not very well described but might give you an idea of what is planned.