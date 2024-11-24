import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceEntity } from './entities/service.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceEntity])],
    controllers: [ServicesController],
    providers: [ServicesService],
})
export class ServicesModule {}
