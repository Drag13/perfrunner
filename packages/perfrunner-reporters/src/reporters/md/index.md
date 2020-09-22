# Performance report for {{& href}}

{{#pages}}

## Network {{pageName}}

| Time | FCP (ms) | LCP (ms) | DOM Interactive (ms) | Script Duration (ms) | Layout Duration (ms) | Recalculate Style (ms) |
| ---- | -------- | -------- | -------------------- | -------------------- | -------------------- | ---------------------- |
{{#stats}}
|{{& ts}}| {{fcp}} | {{lcp}} | {{domInteractive}} | {{scriptDuration}} | {{layoutDuration}} | {{recalculateStyleDuration}} |
{{/stats}}

{{/pages}}
