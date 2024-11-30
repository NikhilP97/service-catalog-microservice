/**
 * @fileoverview Defines the global constants for the application
 */
export const PORT = process.env.PORT ?? 3000;
export const DEVELOPMENT_URL = `http://localhost:${PORT}`;
export const GLOBAL_ROUTE_PREFIX = 'api';
export const SWAGGER_DOCS_ENDPOINT = 'api-docs';
export enum DefinedRoles {
    User = 'user',
    Admin = 'admin',
}
