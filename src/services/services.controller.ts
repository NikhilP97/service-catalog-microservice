import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import {
    ListServicesResponseDto,
    ListServicesRequestDto,
    CreateServiceRequestDto,
    CreateServiceResponseDto,
    GetServiceRequestDto,
    GetServiceResponseDto,
    UpdateServiceRequestParamsDto,
    UpdateServiceRequestBodyDto,
    UpdateServiceResponseDto,
    DeleteServiceRequestDto,
} from './dto';

// private readonly servicesService: ServicesService
// import { ServicesService } from './services.service';

@Controller({
    path: 'services',
    version: '1',
})
export class ServicesController {
    constructor() {}

    @Post()
    async createService(
        @Body() createServiceReqDto: CreateServiceRequestDto,
    ): Promise<CreateServiceResponseDto> {
        // if (isEmpty(newServiceEntity)) {
        //     throw new NotFoundException('Service not found');
        // }

        return plainToInstance(CreateServiceResponseDto, {
            service_entity: {
                ...createServiceReqDto,
                service_id: '1',
            },
        });
    }

    @Get()
    async findServices(
        @Query() query?: ListServicesRequestDto,
    ): Promise<ListServicesResponseDto> {
        // if (isEmpty(serviceEntities)) {
        //     throw new NotFoundException('No Services found');
        // }

        return plainToInstance(ListServicesResponseDto, {
            service_entities: [
                {
                    name: 'New Service',
                    description: 'New Service Description',
                    service_id: '1',
                },
            ],
            meta: {
                pagination: {
                    cur_page: 1,
                    page_size: 1,
                    total_pages: 1,
                    total_items: 1,
                },
            },
        });
    }

    @Get(':serviceId')
    async getService(
        @Param() params: GetServiceRequestDto,
    ): Promise<GetServiceResponseDto> {
        // if (isEmpty(serviceEntity)) {
        //     throw new NotFoundException('Service not found');
        // }

        return plainToInstance(GetServiceResponseDto, {
            service_entity: {
                name: 'New Service',
                description: 'New Service Description',
                service_id: params.serviceId,
            },
        });
    }

    @Patch(':serviceId')
    async updateService(
        @Param() params: UpdateServiceRequestParamsDto,
        @Body() updateServiceReqBodyDto: UpdateServiceRequestBodyDto,
    ): Promise<UpdateServiceResponseDto> {
        // if (isEmpty(serviceEntity)) {
        //     throw new NotFoundException('Service not found');
        // }

        return plainToInstance(UpdateServiceResponseDto, {
            service_entity: {
                ...updateServiceReqBodyDto,
                service_id: params.serviceId,
            },
        });
    }

    @Delete(':serviceId')
    async deleteService(
        @Param() params: DeleteServiceRequestDto,
    ): Promise<void> {
        // if (isEmpty(serviceEntity)) {
        //     throw new NotFoundException('Service not found');
        // }
        return;
    }
}
