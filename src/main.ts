/**
 * @fileoverview This is the main entry point of the application
 */
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setup } from './setup';
import { PORT } from './constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    setup(app);
    await app.listen(PORT);
}

bootstrap();
