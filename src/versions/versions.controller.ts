import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
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

import { VersionsService } from './versions.service';
import {
    CreateVersionReqBodyDto,
    CreateVersionReqParamsDto,
    CreateVersionResponseDto,
    ListVersionsReqParamsDto,
    ListVersionsResponseDto,
    GetVersionReqParamsDto,
    GetVersionResponseDto,
    UpdateVersionReqBodyDto,
    UpdateVersionReqParamsDto,
    UpdateVersionResponseDto,
    DeleteVersionReqParamsDto,
} from './dto';
import { APIErrorResponse } from 'src/types/common.dto';
import { APIVersionListResponse, APIVersionResponse } from './dto/shared';
import {
    APIConflictExceptionResponse,
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
@ApiNotFoundResponse({
    type: APINotFoundErrorResponse,
})
@ApiInternalServerErrorResponse({
    type: APIInternalServerErrorResponse,
})
@Controller({
    path: 'services/:serviceId/versions',
    version: '1',
})
export class VersionsController {
    constructor(private readonly versionsService: VersionsService) {}

    @ApiOperation({
        summary: 'Creates a new version for a particular service',
        description: 'Creates a new version for a particular service',
    })
    @ApiCreatedResponse({
        type: APIVersionResponse,
    })

    // Function definition
    @Post()
    async createVersion(
        @Param() reqParams: CreateVersionReqParamsDto,
        @Body() reqBody: CreateVersionReqBodyDto,
    ): Promise<CreateVersionResponseDto> {
        const versionEntity = await this.versionsService.createVersion(
            reqParams,
            reqBody,
        );

        const response: CreateVersionResponseDto = {
            entity: versionEntity,
        };

        return plainToInstance(CreateVersionResponseDto, response);
    }

    @ApiOperation({
        summary:
            'Fetches a list of information about all the versions related to a particular service',
        description:
            'Returns information about the services. Currently does not support filtering, pagination and sorting',
    })
    @ApiOkResponse({
        type: APIVersionListResponse,
    })

    // Function definition
    @Get()
    async findAllVersions(
        @Param() reqParams: ListVersionsReqParamsDto,
    ): Promise<ListVersionsResponseDto> {
        const versionEntities =
            await this.versionsService.getVersionsByServiceId(reqParams);

        const response: ListVersionsResponseDto = {
            entities: versionEntities,
        };

        return plainToInstance(ListVersionsResponseDto, response);
    }

    @ApiOperation({
        summary: 'Get the information about a particular version',
        description:
            'Returns information about a particular version by the version id. Uses service id to check if version is associated with a service',
    })
    @ApiOkResponse({
        type: APIVersionResponse,
    })

    // Function definition
    @Get(':versionId')
    async findOneVersion(
        @Param() reqParams: GetVersionReqParamsDto,
    ): Promise<GetVersionResponseDto> {
        const versionEntity =
            await this.versionsService.getVersionById(reqParams);

        const response: GetVersionResponseDto = {
            entity: versionEntity,
        };

        return plainToInstance(GetVersionResponseDto, response);
    }

    @ApiOperation({
        summary: 'Update the information about a particular version',
        description:
            'Updates the information about a particular version by the service id.  Uses service id to check if version is associated with a service',
    })
    @ApiOkResponse({
        type: APIVersionResponse,
    })

    // Function definition
    @Patch(':versionId')
    async updateVersion(
        @Param() reqParams: UpdateVersionReqParamsDto,
        @Body() reqBody: UpdateVersionReqBodyDto,
    ): Promise<UpdateVersionResponseDto> {
        const versionEntity = await this.versionsService.updateVersion(
            reqParams,
            reqBody,
        );

        const response: UpdateVersionResponseDto = {
            entity: versionEntity,
        };

        return plainToInstance(UpdateVersionResponseDto, response);
    }

    @ApiOperation({
        summary: 'Deletes the information about a particular version',
        description:
            'It will not delete if the version you are trying to delete is the only version associated with the service',
    })
    @ApiNoContentResponse({
        description: 'Version deleted successfully',
    })
    @ApiConflictResponse({
        type: APIConflictExceptionResponse,
    })

    // Function definition
    @Delete(':versionId')
    @HttpCode(204)
    async deleteVersion(
        @Param() reqParams: DeleteVersionReqParamsDto,
    ): Promise<void> {
        await this.versionsService.deleteVersion(reqParams);

        return;
    }
}
