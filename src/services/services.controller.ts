import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    BadRequestException,
    HttpCode,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import {
    ListServicesReqQueryDto,
    ListServicesResponseDto,
    CreateServiceReqBodyDto,
    CreateServiceResponseDto,
    GetServiceResponseDto,
    UpdateServiceReqParamsDto,
    UpdateServiceReqBodyDto,
    UpdateServiceResponseDto,
    DeleteServiceReqParamsDto,
} from './dto';
import { ServicesService } from './services.service';
import { ServiceRequestParams } from './dto/shared';
import { isEmptyValue } from 'src/utility/validations';

@Controller({
    path: 'services',
    version: '1',
})
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Post()
    async createService(
        @Body() reqBody: CreateServiceReqBodyDto,
    ): Promise<CreateServiceResponseDto> {
        const serviceEntity = await this.servicesService.createService(reqBody);

        const response: CreateServiceResponseDto = {
            service_entity: serviceEntity,
        };

        return plainToInstance(CreateServiceResponseDto, response);
    }

    @Get()
    async findServices(
        @Query() reqQuery?: ListServicesReqQueryDto,
    ): Promise<ListServicesResponseDto> {
        const servicesData = await this.servicesService.getServices(reqQuery);

        const response: ListServicesResponseDto = {
            service_entities: servicesData.services,
            meta: {
                pagination: servicesData.pagination,
            },
        };

        return plainToInstance(ListServicesResponseDto, response);
    }

    @Get(':serviceId')
    async getService(
        @Param() reqParams: ServiceRequestParams,
    ): Promise<GetServiceResponseDto> {
        const serviceEntity =
            await this.servicesService.getServiceById(reqParams);

        const response: GetServiceResponseDto = {
            service_entity: serviceEntity,
        };

        return plainToInstance(GetServiceResponseDto, response);
    }

    @Patch(':serviceId')
    async updateService(
        @Param() reqParams: UpdateServiceReqParamsDto,
        @Body() reqBody: UpdateServiceReqBodyDto,
    ): Promise<UpdateServiceResponseDto> {
        if (isEmptyValue(reqBody)) {
            throw new BadRequestException('Update data cannot be empty');
        }

        const updatedServiceEntity = await this.servicesService.updateService(
            reqParams,
            reqBody,
        );

        const response: UpdateServiceResponseDto = {
            service_entity: updatedServiceEntity,
        };

        return plainToInstance(UpdateServiceResponseDto, response);
    }

    @Delete(':serviceId')
    @HttpCode(204)
    async deleteService(
        @Param() reqParams: DeleteServiceReqParamsDto,
    ): Promise<void> {
        await this.servicesService.deleteService(reqParams);

        return;
    }
}
