import { Expose, Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

import { MetaData, PaginationSearchSort } from '../../types/common.dto';

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
    readonly service_id: string;

    @Expose()
    readonly no_of_versions: number;
}

export class ServiceResponseDto {
    @Expose()
    @ValidateNested()
    @Type(() => ServiceResponse)
    readonly service_entity: ServiceResponse;
}

export class ServiceResponseListDto {
    @Expose()
    @ValidateNested()
    @Type(() => ServiceResponse)
    readonly service_entities: ServiceResponse[];

    @Expose()
    @ValidateNested()
    @Type(() => MetaData)
    readonly meta: MetaData;
}
