import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceEntity } from 'src/services/entities/service.entity';
import { VersionsService } from './versions.service';
import { VersionsController } from './versions.controller';
import { VersionsEntity } from './entities/version.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VersionsEntity, ServiceEntity])],
    controllers: [VersionsController],
    providers: [VersionsService],
})
export class VersionsModule {}
