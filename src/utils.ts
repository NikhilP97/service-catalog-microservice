/**
 * @fileoverview Common utility function used across the application
 */

/**
 * Fetches the env variable to check if authentication is enabled or not
 * @returns True if env variable set to true else false
 */
export function isAuthEnabled(): boolean {
    const enableAuthEnv: string = process.env.ENABLE_AUTH || 'false';

    return enableAuthEnv.toLowerCase() === 'true';
}

/**
 * Checks if a given variable is empty or not
 * Checks for null, undefined, empty string, empty object, empty array
 * @param value Any type of variable
 * @returns True if variable is empty else false
 */
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
