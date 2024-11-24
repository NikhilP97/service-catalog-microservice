export function isEmptyValue(value: any): boolean {
    return (
        // null or undefined
        value == null ||
        // has length and it's zero
        (value.hasOwnProperty('length') && value.length === 0) ||
        // is an Object and has no keys
        Object.keys(value).length === 0
    );
}
