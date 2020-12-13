# Perfrunner [![Build Status](https://travis-ci.org/Drag13/perfrunner.svg?branch=master)](https://travis-ci.org/Drag13/perfrunner) ![npm](https://img.shields.io/npm/dw/perfrunner)

## Why

When we do performance testing or trying to improve application performance, we need reliable, repeatable data. We also need to track progress to understand how changes affect the performance application. And this task is not that easy especially when we are talking about testing against different conditions - bad network, poor CPU, etc. This package was called to remove this complexity and allow you to work on things that maters - your application.

Perfrunner is the performance testing tool for websites and web applications. It gives you the possibility to test the site against different network conditions. It tracks the progress and visualizes it with charts to make things clearer. And if you want to go deeper, it already saves the traces of each run to get you the whole information you need. It's fully customizable and supports reporting into HTML, JSON, CSV, or even your own reporter.

Tracks:

-   First Contentful Paint
-   Largest Contentful Paint
-   Layout duration time
-   Script duration time
-   Resources size (js, css, img, fonts)
-   And much more!

## Why not just taking LightHouse

**Lighthouse** is an awesome tool when you want to see the **current performance state**.

**Perfrunner** should be used when you want to see the **progress** or **difference** between performance changes. It also exposes some technical metrics like time spent in layout rendering, style recalculations, and some more.

## Perfrunner example: Angular vs React vs Vue

This is a simple comparison of the three default builds for the Angular/React/Vue applications (no gzip), just to demonstrate how Perfrunner works and looks.

![perfrunner-example](./packages/perfrunner-cli/docs/default-html-reporter-example-angular-react-vue.PNG)

## Features

-   Simple UI to track performance changes
-   Various metrics (FCP, LCP, resources size, etc.)
-   Various output - HTML, JSON, CSV
-   Good precision with automated multiple reruns
-   Traces for further investigation
-   Supports multiple network conditions - slow3g, fast3g, 4g
-   Test your app with or without cache

## How to start

### Run the performance test

```cmd
npx perfrunner https://drag13.io/
```

Change something and run it again to check the difference

### With the network setup

```cmd
npx perfrunner https://drag13.io/ --network slow3g
```

### With network and throttling

```cmd
npx perfrunner https://drag13.io/ --network slow3g -T 4
```

### With network, throttling, and cache

```cmd
npx perfrunner https://drag13.io/ --network slow3g -T 4 --cache
```

### Generate json instead of HTML

```
npx perfrunner https://drag13.io/ --reporter json
```

For other commands check [perfrunner-cli](./packages/perfrunner-cli)

## Config file

Perfrunner supports config file. To use config file, run `--init` command first:

```cmd
npx perfrunner --init drag13.io
```

And run Perfrunner once more time without arguments

```cmd
npx perfrunner
```

Perfrunner will use `perfrunner.json` configuration file instead of input from the console. With a config file, you can use multiple URL and adjust network setup.

## Related packages

-   [perfrunner-cli](./packages/perfrunner-cli) - command line interface for the perfrunner
-   [perfrunner-core](./packages/perfrunner-core) - runs tests and aggregate result
-   [perfrunner-reporters](./packages/perfrunner-reporters) - process result

## Credits

-   [raharrison](https://github.com/raharrison) for inspiration and examples

## License

[MIT](./LICENSE)
