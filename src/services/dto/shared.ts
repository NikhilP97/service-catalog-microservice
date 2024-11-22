import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { MetaData, PaginationSearchSort } from '../../types/common.dto';

enum SortByValues {
    name = 'name',
    created_at = 'created_at',
}

export class PagSearchSortForService extends PaginationSearchSort {
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(SortByValues)
    readonly sortBy?: 'name' | 'created_at' = 'name';
}

export class ServiceRequestParams {
    @IsNotEmpty()
    @IsString()
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
}

export class ServiceResponseDto {
    @Expose()
    readonly service_entity: ServiceResponse;
}

export class ServiceResponseListDto {
    @Expose()
    readonly service_entities: ServiceResponse[];

    @Expose()
    readonly meta: MetaData;
}
