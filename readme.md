# Perfrunner [![Build Status](https://travis-ci.org/Drag13/perfrunner.svg?branch=master)](https://travis-ci.org/Drag13/perfrunner) ![npm](https://img.shields.io/npm/dw/perfrunner)

## Why

Helps you to track the performance your web application and compare different solutions.

## Performance comparison: Angular vs React vs Vue

This is a simple comparison of the three default builds for the Angular/React/Vue applications (no gzip), just to demonstrate how perfrunner works and looks.

![default-html-reporter-example-angular-react-vue.PNG](./packages/perfrunner-cli/docs/default-html-reporter-example-angular-react-vue.PNG)

## Features

* Simple UI to track performance changes
* Various output - html, json, csv
* Good precision with automated multiple reruns
* Saving all traces for further investigation
* Supports multiple network conditions - slow3g, fast3g, 4g
* Test your app with or without cache

## How to start

### Run the performance test

```cmd
npx perfrunner https://drag13.io/
```

Change something and run it again to check the difference

### With the network setup

```cmd
npx perfrunner https://drag13.io/ --network slow-3g
```

### With network and throttling

```cmd
npx perfrunner https://drag13.io/ --network slow-3g -T 4
```

### With network, throttling, and cache

```cmd
npx perfrunner https://drag13.io/ --network slow-3g -T 4 --cache
```

### Generate json instead of HTML

```
npx perfrunner https://drag13.io/ --reporter json
```

For other commands check [perfrunner-cli](./packages/perfrunner-cli)

## What next

* [Support test suite](https://github.com/Drag13/perfrunner/issues/37)
* [Support CI](https://github.com/Drag13/perfrunner/issues/38)


## Related packages

* [perfrunner-cli](./packages/perfrunner-cli) - command line interface for the perfrunner
* [perfrunner-core](./packages/perfrunner-core) - runs tests and aggregate result
* [perfrunner-reporters](./packages/perfrunner-reporters) - process result

## Credits

* [raharrison](https://github.com/raharrison) for inspiration and examples

## License

[MIT](./LICENSE)