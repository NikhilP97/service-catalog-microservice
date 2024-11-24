import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { ServiceRequestParams } from 'src/services/dto/shared';
import { EntityResponse, ListEntitiesResponse } from 'src/types/common.dto';

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

export class VersionResponse {
    @Expose()
    readonly id: string;

    @Expose()
    readonly name: string;

    @Expose()
    readonly overview: string;
}

export class VersionResponseDto extends EntityResponse<VersionResponse> {
    constructor() {
        super(VersionResponse);
    }
}

export class VersionResponseListDto extends ListEntitiesResponse<VersionResponse> {
    constructor() {
        super(VersionResponse);
    }
}
