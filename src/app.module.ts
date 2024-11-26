/**
 * @fileoverview Main module for the application to mount
 * All common configs should be authored here
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ServicesModule } from './services/services.module';
import { VersionsModule } from './versions/versions.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard, RolesGuard } from './guards';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [
        ServicesModule,
        VersionsModule,
        AuthModule,
        ConfigModule.forRoot({
            // Required to access the environment variables in other services
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as any,
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT || '5432'),
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DB,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            // NOTE: should be false in production environment
            synchronize: process.env.SYNCHRONIZE_DB === 'true',
            namingStrategy: new SnakeNamingStrategy(),
        }),
    ],
    providers: [
        AuthService, // Needed here since auth guard has a dependency on it
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
