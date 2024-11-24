import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ServiceRequestParams } from 'src/services/dto/shared';

export class VersionRequestParams extends ServiceRequestParams {
    @IsNotEmpty()
    @IsString()
    readonly versionId: string;
}

export class VersionRequestBody {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly overview: string;
}

export class ServiceDetailsForVersionEntity {
    @Expose()
    readonly service_id: string;
}

export class VersionResponse {
    @Expose()
    readonly version_id: string;

    @Expose()
    readonly name: string;

    @Expose()
    readonly overview: string;
}

export class VersionResponseDto {
    @Expose()
    @ValidateNested()
    @Type(() => VersionResponse)
    readonly version_entity: VersionResponse;
}

export class VersionResponseListDto {
    @Expose()
    @ValidateNested()
    @Type(() => VersionResponse)
    readonly version_entities: VersionResponse[];
}
