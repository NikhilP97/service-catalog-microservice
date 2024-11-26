/**
 * @fileoverview Global setup and configs for the application
 * Includes registering global prefix, interceptors, guards, filters, pipes, etc.
 */
import {
    INestApplication,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { CatchEveryErrorFilter } from './filters/exception.filter';
import {
    DEVELOPMENT_URL,
    GLOBAL_ROUTE_PREFIX,
    SWAGGER_DOCS_ENDPOINT,
} from './constants';

export function setup(app: INestApplication): void {
    const appReflector = app.get(Reflector);

    /**
     * Enable CORs and whitelist development URL that the Swagger UI will access
     */
    app.enableCors({ origin: DEVELOPMENT_URL });

    /**
     * Enable global prefix for all registered routes and add versioning
     * Version numbers are handled at the controller and route level
     */
    app.setGlobalPrefix(GLOBAL_ROUTE_PREFIX);
    app.enableVersioning({
        type: VersioningType.URI,
    });

    /**
     * Enable incoming request query, params and body sanitization
     * Enable transforming string encoded values to their native types like integer, boolean, etc.
     * If incoming request does not conform to specification, request is rejected with BadException error
     */
    app.useGlobalPipes(
        new ValidationPipe({
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    /**
     * Ensures that only the exposed fields are sent back in the response and all other fields are stripped
     * Also adds some top level keys like 'data', 'statusCode', etc. to the top level API response to ensure
     * backward compatibility and avoid breaking changes for subsequent future versions
     */
    app.useGlobalInterceptors(
        new TransformResponseInterceptor(appReflector, {
            strategy: 'excludeAll',
        }),
    );

    /**
     * Adds a global filter that catches all errors and acts as the exception layer
     * Transforms error into the required DTO and send back to the client
     * Also logs the error in specific cases
     */
    app.useGlobalFilters(new CatchEveryErrorFilter(app.get(HttpAdapterHost)));

    /**
     * Enable swagger API documentation for all endpoints
     */
    const config = new DocumentBuilder()
        .setTitle('Service Catalog')
        .setDescription(
            'Details of the service catalog API definitions and schemas',
        )
        .setVersion('1.0.0')
        .addTag(
            'Services',
            'Handles CRUD operations for the Services Entity and CRUD operations for Versions that are related to a particular service entity ',
        )
        .addTag(
            'Auth',
            'Handles JWT token generation and exposes endpoints to test authentication and RBAC authorization',
        )
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            in: 'header',
        })
        .addServer(DEVELOPMENT_URL)
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_DOCS_ENDPOINT, app, documentFactory);
}
