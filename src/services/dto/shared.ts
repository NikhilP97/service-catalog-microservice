import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import {
    EntityResponse,
    ListEntitiesResponse,
    PaginationSearchSort,
} from 'src/types/common.dto';

enum SortByValues {
    name = 'name',
    created_at = 'created_at',
}

export class PagSearchSortForService extends PaginationSearchSort {
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(SortByValues)
    readonly sortBy?: 'name' | 'created_at' = 'created_at';
}

export class ServiceRequestParams {
    @IsNotEmpty()
    @IsUUID()
    readonly serviceId: string;
}

export class ServiceRequestBody {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}

export class ServiceResponse {
    @Expose()
    readonly name: string;

    @Expose()
    readonly description: string;

    @Expose()
    readonly id: string;

    @Expose()
    readonly no_of_versions: number;
}

export class ServiceResponseDto extends EntityResponse<ServiceResponse> {
    constructor() {
        super(ServiceResponse);
    }
}

export class ServiceResponseListDto extends ListEntitiesResponse<ServiceResponse> {
    constructor() {
        super(ServiceResponse);
    }
}
