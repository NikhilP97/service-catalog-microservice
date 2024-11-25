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
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
import {
    APIServiceListResponse,
    APIServiceResponse,
    ServiceRequestParams,
} from './dto/shared';
import { isEmptyValue } from 'src/utility/validations';
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
        type: APIServiceResponse,
    })

    // Function definition
    @Post()
    async createService(
        @Body() reqBody: CreateServiceReqBodyDto,
    ): Promise<CreateServiceResponseDto> {
        const serviceEntity = await this.servicesService.createService(reqBody);

        const response: CreateServiceResponseDto = {
            entity: serviceEntity,
        };

        return plainToInstance(CreateServiceResponseDto, response);
    }

    @ApiOperation({
        summary: 'Fetches a list of information about services',
        description:
            'Returns information about the services and supports filtering, pagination and sorting',
    })
    @ApiOkResponse({
        type: APIServiceListResponse,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })

    // Function definition
    @Get()
    async findServices(
        @Query() reqQuery?: ListServicesReqQueryDto,
    ): Promise<ListServicesResponseDto> {
        const servicesData = await this.servicesService.getServices(reqQuery);

        const response: ListServicesResponseDto = {
            entities: servicesData.services,
            meta: {
                pagination: servicesData.pagination,
            },
        };

        return plainToInstance(ListServicesResponseDto, response);
    }

    @ApiOperation({
        summary: 'Get the information about a particular service',
        description:
            'Returns information about a particular service by the service id',
    })
    @ApiOkResponse({
        type: APIServiceResponse,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })

    // Function definition
    @Get(':serviceId')
    async getService(
        @Param() reqParams: ServiceRequestParams,
    ): Promise<GetServiceResponseDto> {
        const serviceEntity =
            await this.servicesService.getServiceById(reqParams);

        const response: GetServiceResponseDto = {
            entity: serviceEntity,
        };

        return plainToInstance(GetServiceResponseDto, response);
    }

    @ApiOperation({
        summary: 'Update the information about a particular service',
        description:
            'Updates the information about a particular service by the service id',
    })
    @ApiOkResponse({
        type: APIServiceResponse,
    })
    @ApiNotFoundResponse({
        type: APINotFoundErrorResponse,
    })

    // Function definition
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
            entity: updatedServiceEntity,
        };

        return plainToInstance(UpdateServiceResponseDto, response);
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

    // Function definition
    @Delete(':serviceId')
    @HttpCode(204)
    async deleteService(
        @Param() reqParams: DeleteServiceReqParamsDto,
    ): Promise<void> {
        await this.servicesService.deleteService(reqParams);

        return;
    }
}
