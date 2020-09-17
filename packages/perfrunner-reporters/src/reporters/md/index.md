{{& href}}

{{#pages}}

## {{pageName}}

| FCP (ms) | LCP (ms) | DOM Interactive (ms) | Script Duration (ms) | Layout Duration (ms) | Recalculate Style (ms) |
| -------- | -------- | -------------------- | -------------------- | -------------------- | ----------------- |
{{#stats}}
| {{fcp}} | {{lcp}} | {{domInteractive}} | {{scriptDuration}} | {{layoutDuration}} | {{recalculateStyleDuration}} |
{{/stats}}

{{/pages}}
