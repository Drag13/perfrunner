export const CONFIG_NOT_EXISTS = `Perfrunner config not exists. Use --init command to generate the config file`;
export const CONFIG_SHOULD_NOT_OVERRIDEN = `Config already exists, operation not permitted to keep your settings safe. If you want to recreate config - delete it manually first`;
export const URL_IS_EMPTY = `Please provide non-empty url`;
export const CONFIG_URL_DEPRECATED = `Using URL property in config is deprecated. Please use property page instead`;

export const error = (err: string) => new Error(err);
