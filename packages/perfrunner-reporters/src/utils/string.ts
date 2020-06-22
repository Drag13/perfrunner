export const isNullOrEmpty = (nullableString: String | undefined) =>
    nullableString == null || nullableString.trim() === '' ? true : false;
