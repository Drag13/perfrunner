# Perfrunner-reporters

Process result of the performance test

Supported reporters:

-   [html](#html) - renders basic metrics into HTML (FCP, DCL, Size, etc)
-   [MD](#md) - generates simple markdown report with First Contentful Paint and Largest Contentful Paint, DOM Interactive and some other metrics
-   [json](#json) - saves all data to json
-   [csv](#csv) - saves all data to csv

## HTML

Generates output as an HTML file. Includes:

-   Performance Entries Chart (DOM Content Loaded, First Paint, First Contentful Paint, Largest Contentful Paint, DOM Interactive)
-   Default Performance Metrics Chart - Layout Duration, Recalculation Style Duration, Script Duration, Task duration
-   Resource Size Chart (JS, CSS ,IMG, Fonts, XHR)
-   Performance Marks Chart - shows performance marks from application

## MD

Generate simple markdown report, that includes:

-   Performance events - First Contentful Paint and Largest Contentful Paint
-   Performance metrics DOM Interactive, Script Duration, Layout Duration, Recalculate Style metrics.

## JSON

Generates output as raw JSON file

## CSV

Generates output as CSV file
