/**
 * @fileoverview Global setup configs for the application
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

export function setup(app: INestApplication): void {
    /**
     * Enable global prefix for all registered routes and add versioning
     * Version numbers are handled at the controller and route level
     *
     */
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            forbidNonWhitelisted: true,
            transform: true,
            // disableErrorMessages: true, // mark true in production environments if needed
        }),
    );

    /**
     * This ensures that only the exposed fields are sent back in the response and all other fields are stripped
     * It then adds some top level keys like 'data', 'statusCode', etc. to the top level API response
     */
    app.useGlobalInterceptors(
        new TransformResponseInterceptor(app.get(Reflector), {
            strategy: 'excludeAll',
        }),
    );

    app.useGlobalFilters(new CatchEveryErrorFilter(app.get(HttpAdapterHost)));

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Service Catalog')
        .setDescription('The service catalog API definitions')
        .setVersion('1.0.0')
        .addTag('service-catalog')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);
}
