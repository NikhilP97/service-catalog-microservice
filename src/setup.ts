/**
 * @fileoverview Global setup configs for the application
 * Includes registering global prefix, interceptors, guards, filters, pipes, etc.
 */

import {
    ClassSerializerInterceptor,
    INestApplication,
    VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector), {
            strategy: 'excludeAll',
        }),
    );
}
