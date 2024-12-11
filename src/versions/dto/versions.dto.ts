/**
 * @fileoverview Data transfer objects (DTO) for the versions entity
 * Contains internal DTOs as well as Swagger DTOs
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import {
    APISuccessResponse,
    EntityResponse,
    ListEntitiesResponse,
    ServiceRequestParamsDto,
} from 'src/types/common.dto';

export class VersionRequestParamsDto extends ServiceRequestParamsDto {
    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @IsNotEmpty()
    @IsString()
    readonly versionId: string;
}

export class VersionRequestBodyDto {
    @ApiProperty({
        description: 'The name of entity',
        example: 'New Version Name',
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'A brief overview about the version',
        example: 'Summary of the version',
    })
    @IsNotEmpty()
    @IsString()
    readonly overview: string;
}

export class VersionPartialReqBodyDto extends PartialType(
    VersionRequestBodyDto,
) {}

export class VersionExposedProperties {
    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @Expose()
    readonly id: string;

    @ApiProperty({
        description: 'The name of entity',
        example: 'New Version Name',
    })
    @Expose()
    readonly name: string;

    @ApiProperty({
        description: 'A brief overview about the version',
        example: 'Summary of the version',
    })
    @Expose()
    readonly overview: string;
}

export class VersionDto extends EntityResponse<VersionExposedProperties> {
    constructor() {
        super(VersionExposedProperties);
    }

    @ApiProperty({
        description: 'The information about the version entity',
        type: VersionExposedProperties,
    })
    entity: VersionExposedProperties;
}

export class VersionResponseDto extends APISuccessResponse<VersionDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: VersionDto,
    })
    data: VersionDto;
}

export class VersionListDto extends ListEntitiesResponse<VersionExposedProperties> {
    constructor() {
        super(VersionExposedProperties);
    }

    @ApiProperty({
        description: 'The list of information about the version entities',
        type: [VersionExposedProperties],
    })
    entities: VersionExposedProperties[];
}

export class VersionListResponseDto extends APISuccessResponse<VersionListDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: [VersionListDto],
    })
    data: VersionListDto;
}
