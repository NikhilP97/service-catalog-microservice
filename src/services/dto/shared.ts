import { ApiProperty } from '@nestjs/swagger';
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
    PaginationSearchSort,
} from 'src/types/common.dto';

enum SortByValues {
    name = 'name',
    created_at = 'created_at',
}

export class PagSearchSortForService extends PaginationSearchSort {
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

export class ServiceRequestParams {
    @ApiProperty({
        description: 'The unique ID for the entity',
        example: '0e4bdfc0-bae7-43c0-bd67-a95f2ef2b4f2',
    })
    @IsNotEmpty()
    @IsUUID()
    readonly serviceId: string;
}

export class ServiceRequestBody {
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

export class ServiceResponse {
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

export class ServiceResponseDto extends EntityResponse<ServiceResponse> {
    constructor() {
        super(ServiceResponse);
    }

    @ApiProperty({
        description: 'The information about the service entity',
        type: ServiceResponse,
    })
    entity: ServiceResponse;
}

export class APIServiceResponse extends APISuccessResponse<ServiceResponseDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: ServiceResponseDto,
    })
    data: ServiceResponseDto;
}

export class ServiceResponseListDto extends ListEntitiesResponse<ServiceResponse> {
    constructor() {
        super(ServiceResponse);
    }

    @ApiProperty({
        description: 'The list of information about the service entities',
        type: [ServiceResponse],
    })
    entities: ServiceResponse[];
}

export class APIServiceListResponse extends APISuccessResponse<ServiceResponseListDto> {
    @ApiProperty({
        description:
            'The base level data key that contains information about the API',
        type: [ServiceResponseListDto],
    })
    data: ServiceResponseListDto;
}
