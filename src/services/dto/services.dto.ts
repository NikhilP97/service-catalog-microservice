/**
 * @fileoverview Data transfer objects (DTO) for the services entity
 * Contains internal DTOs as well as Swagger DTOs
 */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import {
    APISuccessResponse,
    EntityResponse,
    ListEntitiesResponse,
    Page,
    PaginationSearchSort,
} from 'src/types/common.dto';
import { ServiceEntity } from '../entities/service.entity';

enum SortByValues {
    name = 'name',
    created_at = 'created_at',
}

export class ServiceEntitiesWithPagination {
    services: ServiceEntity[];

    pagination: Page;
}

export class ServiceListRequestQuery extends PaginationSearchSort {
    @ApiProperty({
        description: 'The field by which the data should be sorted',
        enum: SortByValues,
        required: false,
        example: SortByValues.created_at,
        default: SortByValues.created_at,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(SortByValues)
    readonly sortBy?: SortByValues = SortByValues.created_at;
}

export class ServiceRequestParamsDto {
    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @IsNotEmpty()
    @IsUUID()
    readonly serviceId: string;
}

export class ServiceRequestBodyDto {
    @ApiProperty({
        description: 'The name of entity',
        example: 'New Service Name',
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'The description of entity',
        example: 'Description of the service',
    })
    @IsNotEmpty()
    @IsString()
    readonly description: string;
}

export class ServicePartialRequestBodyDto extends PartialType(
    ServiceRequestBodyDto,
) {}

export class ServiceExposedProperties {
    @ApiProperty({
        description: 'The name of entity',
        example: 'New Service Name',
    })
    @Expose()
    readonly name: string;

    @ApiProperty({
        description: 'The description of entity',
        example: 'Description of the service',
    })
    @Expose()
    readonly description: string;

    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @Expose()
    readonly id: string;

    @ApiProperty({
        description: 'The no of versions the entity has',
        example: 3,
    })
    @Expose()
    readonly no_of_versions: number;
}

export class ServiceDto extends EntityResponse<ServiceExposedProperties> {
    constructor() {
        super(ServiceExposedProperties);
    }

    @ApiProperty({
        description: 'The information about the service entity',
        type: ServiceExposedProperties,
    })
    entity: ServiceExposedProperties;
}

export class ServiceResponseDto extends APISuccessResponse<ServiceDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: ServiceDto,
    })
    data: ServiceDto;
}

export class ServiceListDto extends ListEntitiesResponse<ServiceExposedProperties> {
    constructor() {
        super(ServiceExposedProperties);
    }

    @ApiProperty({
        description: 'The list of information about the service entities',
        type: [ServiceExposedProperties],
    })
    entities: ServiceExposedProperties[];
}

export class ServiceListResponseDto extends APISuccessResponse<ServiceListDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: [ServiceListDto],
    })
    data: ServiceListDto;
}
