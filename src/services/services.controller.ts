/**
 * @fileoverview HTTP handles for the version entity
 */
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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ServicesService } from './services.service';
import {
    ServiceDto,
    ServiceListDto,
    ServiceListRequestQuery,
    ServiceListResponseDto,
    ServicePartialRequestBodyDto,
    ServiceRequestBodyDto,
    ServiceRequestParamsDto,
    ServiceResponseDto,
} from './dto/services.dto';
import { isEmptyValue } from 'src/utils';
import { APIErrorResponse } from 'src/types/common.dto';
import {
    APIInternalServerErrorResponse,
    APINotFoundErrorResponse,
    APIUnauthenticatedExceptionResponse,
} from 'src/types/swagger.dto';

@ApiTags('Services')
@ApiBearerAuth()
@ApiBadRequestResponse({
    type: APIErrorResponse,
})
@ApiUnauthorizedResponse({
    type: APIUnauthenticatedExceptionResponse,
})
@ApiInternalServerErrorResponse({
    type: APIInternalServerErrorResponse,
})
@Controller({
    path: 'services',
    version: '1',
})
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @ApiOperation({
        summary: 'Creates a new service',
        description:
            'Creates a new service entity and a corresponding version entity which serves as the default initial version',
    })
    @ApiCreatedResponse({
        type: ServiceResponseDto,
    })
    // Implementation details
    @Post()
    async createService(
        @Body() reqBody: ServiceRequestBodyDto,
    ): Promise<ServiceDto> {
        const serviceEntity = await this.servicesService.createService(reqBody);

        const response: ServiceDto = {
            entity: serviceEntity,
        };

        return plainToInstance(ServiceDto, response);
    }

    @ApiOperation({
        summary: 'Fetches a list of information about services',
        description:
            'Returns information about the services and supports filtering, pagination and sorting',
    })
    @ApiOkResponse({
        type: ServiceListResponseDto,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })
    @ApiQuery({
        name: 'page[size]',
        description: 'The number of items per page for pagination',
        required: false,
        example: 20,
        default: 20,
        type: Number,
    })
    @ApiQuery({
        name: 'page[number]',
        description: 'The page number for pagination',
        required: false,
        example: 1,
        default: 1,
        type: Number,
    })
    // Implementation details
    @Get()
    async findServices(
        @Query() reqQuery?: ServiceListRequestQuery,
    ): Promise<ServiceListDto> {
        const servicesData = await this.servicesService.getServices(reqQuery);

        const response: ServiceListDto = {
            entities: servicesData.services,
            meta: {
                pagination: servicesData.pagination,
            },
        };

        return plainToInstance(ServiceListDto, response);
    }

    @ApiOperation({
        summary: 'Get the information about a particular service',
        description:
            'Returns information about a particular service by the service id',
    })
    @ApiOkResponse({
        type: ServiceResponseDto,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })
    // Implementation details
    @Get(':serviceId')
    async getService(
        @Param() reqParams: ServiceRequestParamsDto,
    ): Promise<ServiceDto> {
        const serviceEntity =
            await this.servicesService.getServiceById(reqParams);

        const response: ServiceDto = {
            entity: serviceEntity,
        };

        return plainToInstance(ServiceDto, response);
    }

    @ApiOperation({
        summary: 'Update the information about a particular service',
        description:
            'Updates the information about a particular service by the service id',
    })
    @ApiOkResponse({
        type: ServiceResponseDto,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })

    // Implementation details
    @Patch(':serviceId')
    async updateService(
        @Param() reqParams: ServiceRequestParamsDto,
        @Body() reqBody: ServicePartialRequestBodyDto,
    ): Promise<ServiceDto> {
        if (isEmptyValue(reqBody)) {
            throw new BadRequestException('Update data cannot be empty');
        }

        const updatedServiceEntity = await this.servicesService.updateService(
            reqParams,
            reqBody,
        );

        const response: ServiceDto = {
            entity: updatedServiceEntity,
        };

        return plainToInstance(ServiceDto, response);
    }

    @ApiOperation({
        summary:
            'Deletes the information about a particular service and related versions',
        description:
            'When a particular service is deleted, all versions related to that service will also be deleted',
    })
    @ApiNoContentResponse({
        description: 'Service deleted successfully',
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })
    // Implementation details
    @Delete(':serviceId')
    @HttpCode(204)
    async deleteService(
        @Param() reqParams: ServiceRequestParamsDto,
    ): Promise<void> {
        await this.servicesService.deleteService(reqParams);

        return;
    }
}
