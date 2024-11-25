import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { ServiceRequestParams } from 'src/services/dto/shared';
import {
    APISuccessResponse,
    EntityResponse,
    ListEntitiesResponse,
} from 'src/types/common.dto';

export class VersionRequestParams extends ServiceRequestParams {
    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @IsNotEmpty()
    @IsString()
    readonly versionId: string;
}

export class VersionRequestBody {
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

export class VersionResponse {
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

export class VersionResponseDto extends EntityResponse<VersionResponse> {
    constructor() {
        super(VersionResponse);
    }

    @ApiProperty({
        description: 'The information about the version entity',
        type: VersionResponse,
    })
    entity: VersionResponse;
}

export class APIVersionResponse extends APISuccessResponse<VersionResponse> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: VersionResponseDto,
    })
    data: VersionResponse;
}

export class VersionResponseListDto extends ListEntitiesResponse<VersionResponse> {
    constructor() {
        super(VersionResponse);
    }

    @ApiProperty({
        description: 'The list of information about the version entities',
        type: [VersionResponse],
    })
    entities: VersionResponse[];
}

export class APIVersionListResponse extends APISuccessResponse<VersionResponseListDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: [VersionResponseListDto],
    })
    data: VersionResponseListDto;
}
