export const StringOrNumber = (v: string | undefined) => (v != null ? (parseInt(v).toString() === v ? parseInt(v) : v) : '');
