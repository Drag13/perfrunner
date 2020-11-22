# CHANGELOG

## v.0.11.0

### Breaking changes

* Config file was changed to support individual setup for the page. **Property url is no longer supported**, please use property page for that:

```json
 "page": [{"url": "http://drag13.io"}]
```

* `IReporter` interface was changed to **return string** as a result. Saving the result is out of scope for reporters for now.

### Features

-   Added possibility to run scripts after page was loaded

### Improvments

-   Updated logs
