# CHANGELOG

## v.0.13.1-alpha.0

-   Bumped puppeteer to 7.1.0
-   Bumped is-svg

### Breaking changes

-   Folder with report now will include protocol, any dots will be replaced with \_\_ to avoid confusion for https://drag13.io/index.html

### Fixed bugs

[test](https://drag13.io)

-   See: [when using http/https protocol, the generated results overwrite each other](https://github.com/Drag13/perfrunner/issues/105)

### Improvments

## v.0.11.0

### Breaking changes

-   Config file was changed to support individual setup for the page. **Property url is no longer supported**, please use property page for that:

```json
 "page": [{"url": "http://drag13.io"}]
```

-   `IReporter` interface was changed to **return string** as a result. Saving the result is out of scope for reporters for now.

### Features

-   Added possibility to run scripts after page was loaded

### Improvments

-   Updated logs
