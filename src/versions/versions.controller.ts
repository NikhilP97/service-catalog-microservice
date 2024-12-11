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

import {
    APIConflictExceptionResponse,
    APIInternalServerErrorResponse,
    APINotFoundErrorResponse,
    APIUnauthenticatedExceptionResponse,
} from 'src/types/swagger.dto';
import {
    APIErrorResponse,
    ServiceRequestParamsDto,
} from 'src/types/common.dto';
import { VersionsService } from './versions.service';

import {
    VersionPartialReqBodyDto,
    VersionRequestBodyDto,
    VersionRequestParamsDto,
    VersionDto,
    VersionListDto,
    VersionResponseDto,
    VersionListResponseDto,
} from './dto/versions.dto';

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
    @ApiCreatedResponse({ type: VersionResponseDto })
    // Implementation details
    @Post()
    async createVersion(
        @Param() reqParams: ServiceRequestParamsDto,
        @Body() reqBody: VersionRequestBodyDto,
    ): Promise<VersionDto> {
        const versionEntity = await this.versionsService.createVersion(
            reqParams,
            reqBody,
        );

        const response: VersionDto = {
            entity: versionEntity,
        };

        return plainToInstance(VersionDto, response);
    }

    @ApiOperation({
        summary:
            'Fetches a list of information about all the versions related to a particular service',
        description:
            'Returns information about the services. Currently does not support filtering, pagination and sorting',
    })
    @ApiOkResponse({ type: VersionListResponseDto })
    // Implementation details
    @Get()
    async findAllVersions(
        @Param() reqParams: ServiceRequestParamsDto,
    ): Promise<VersionListDto> {
        const versionEntities =
            await this.versionsService.getVersionsByServiceId(reqParams);

        const response: VersionListDto = {
            entities: versionEntities,
        };

        return plainToInstance(VersionListDto, response);
    }

    @ApiOperation({
        summary: 'Get the information about a particular version',
        description:
            'Returns information about a particular version by the version id. Uses service id to check if version is associated with a service',
    })
    @ApiOkResponse({ type: VersionResponseDto })
    // Implementation details
    @Get(':versionId')
    async findOneVersion(
        @Param() reqParams: VersionRequestParamsDto,
    ): Promise<VersionDto> {
        const versionEntity =
            await this.versionsService.getVersionById(reqParams);

        const response: VersionDto = {
            entity: versionEntity,
        };

        return plainToInstance(VersionDto, response);
    }

    @ApiOperation({
        summary: 'Update the information about a particular version',
        description:
            'Updates the information about a particular version by the service id.  Uses service id to check if version is associated with a service',
    })
    @ApiOkResponse({ type: VersionResponseDto })
    // Implementation details
    @Patch(':versionId')
    async updateVersion(
        @Param() reqParams: VersionRequestParamsDto,
        @Body() reqBody: VersionPartialReqBodyDto,
    ): Promise<VersionDto> {
        const versionEntity = await this.versionsService.updateVersion(
            reqParams,
            reqBody,
        );

        const response: VersionDto = {
            entity: versionEntity,
        };

        return plainToInstance(VersionDto, response);
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
    // Implementation details
    @Delete(':versionId')
    @HttpCode(204)
    async deleteVersion(
        @Param() reqParams: VersionRequestParamsDto,
    ): Promise<void> {
        await this.versionsService.deleteVersion(reqParams);

        return;
    }
}
