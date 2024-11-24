import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';
import { VersionsModule } from './versions/versions.module';

// TODO: Remove app controller and service
@Module({
    imports: [
        ConfigModule.forRoot(),
        ServicesModule,
        VersionsModule,
        // NOTE: Does not work if defined outside. CHORE: Debug further
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as any,
            host: process.env.PG_HOST,
            port: parseInt(process.env.PG_PORT || '5432'),
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DB,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // NOTE: disable in production TODO: Use env variable
            namingStrategy: new SnakeNamingStrategy(),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
