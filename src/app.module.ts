import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from './services/services.module';

// TODO: Remove app controller and service
@Module({
    imports: [ServicesModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
