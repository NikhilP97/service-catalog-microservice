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

@Controller({
    path: 'services/:serviceId/versions',
    version: '1',
})
export class VersionsController {
    constructor(private readonly versionsService: VersionsService) {}

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
            version_entity: versionEntity,
        };

        return plainToInstance(CreateVersionResponseDto, response);
    }

    @Get()
    async findAllVersions(
        @Param() reqParams: ListVersionsReqParamsDto,
    ): Promise<ListVersionsResponseDto> {
        const versionEntities =
            await this.versionsService.getVersionsByServiceId(reqParams);

        const response: ListVersionsResponseDto = {
            version_entities: versionEntities,
        };

        return plainToInstance(ListVersionsResponseDto, response);
    }

    @Get(':versionId')
    async findOneVersion(
        @Param() reqParams: GetVersionReqParamsDto,
    ): Promise<GetVersionResponseDto> {
        const versionEntity =
            await this.versionsService.getVersionById(reqParams);

        const response: GetVersionResponseDto = {
            version_entity: versionEntity,
        };

        return plainToInstance(GetVersionResponseDto, response);
    }

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
            version_entity: versionEntity,
        };

        return plainToInstance(UpdateVersionResponseDto, response);
    }

    @Delete(':versionId')
    @HttpCode(204)
    async deleteVersion(
        @Param() reqParams: DeleteVersionReqParamsDto,
    ): Promise<void> {
        await this.versionsService.deleteVersion(reqParams);

        return;
    }
}
