/**
 * @fileoverview Common DTOs used by different services and controllers
 */
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

enum OrderValues {
    asc = 'ASC',
    desc = 'DESC',
}

export class Page {
    @ApiProperty({
        description: 'The current page of the requested for the entity',
    })
    @Expose()
    readonly cur_page: number;

    @ApiProperty({
        description: 'The number of items returned in API response',
    })
    @Expose()
    readonly page_size: number;

    @ApiProperty({
        description: 'The total pages for the particular entity',
    })
    @Expose()
    readonly total_pages: number;

    @ApiProperty({
        description:
            'The total items present in the DB for the particular entity',
    })
    @Expose()
    readonly total_items: number;
}

export class MetaData {
    @ApiProperty({
        description: 'The meta information returned by the API response',
    })
    @Expose()
    @Type(() => Page)
    readonly pagination: Page;
}

class PageQuery {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: 'page number must be at least 1' })
    @Type(() => Number)
    readonly number?: number = 1;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: 'page size must be at least 1' })
    @Type(() => Number)
    readonly size?: number = 20;
}

export class PaginationSearchSort {
    @ApiHideProperty()
    @Type(() => PageQuery)
    @ValidateNested()
    readonly page: PageQuery;

    @ApiProperty({
        description:
            'The search string to filter and search items. For this service, the API searches on the name and description fields',
        default: '',
        example: '',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly searchTerm?: string;

    @ApiProperty({
        description: 'The order by which the results should be sorted',
        enum: OrderValues,
        default: OrderValues.desc,
        example: OrderValues.desc,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(OrderValues)
    readonly order?: OrderValues = OrderValues.desc;
}

export class EntityResponse<DataObject> {
    @Expose()
    @ValidateNested()
    /**
     * Use a generic placeholder function for the @Type decorator used by the class-transformer library
     * This passes the correct type at runtime declared in the child class generic
     * Implementing it this way keeps code DRY since API responses will always have a key 'entity' but
     * the structure within it will keep changing based on the API.
     * The other option would be define multiple Dtos, all having the same key 'entity' in them
     * Adding a new key at this level will be easy for future API updates
     */
    @Type((options) => options?.newObject?.dataObjectType)
    readonly entity: DataObject;

    // Constructor to pass type metadata
    constructor(dataObjectType: new () => DataObject) {
        Object.defineProperty(this, 'dataObjectType', {
            value: dataObjectType,
            enumerable: false,
        });
    }
}

export class ListEntitiesResponse<DataObject> {
    @Expose()
    @ValidateNested()
    /**
     * Use a generic placeholder function for the @Type decorator used by the class-transformer library
     * This passes the correct type at runtime declared in the child class generic
     * Implementing it this way keeps code DRY since API responses will always have a key 'entity' but
     * the structure within it will keep changing based on the API.
     * The other option would be define multiple Dtos, all having the same key 'entity' in them
     * Adding a new key at this level will be easy for future API updates
     */
    @Type((options) => options?.newObject?.dataObjectType)
    readonly entities: DataObject[];

    @Expose()
    @ValidateNested()
    @IsOptional()
    @Type(() => MetaData)
    readonly meta?: MetaData;

    // Constructor to pass type metadata
    constructor(dataObjectType: new () => DataObject) {
        Object.defineProperty(this, 'dataObjectType', {
            value: dataObjectType,
            enumerable: false,
        });
    }
}

export class APISuccessResponse<DataObject> {
    //  @ApiProperty decorator is applied in child classes
    data: DataObject;

    @ApiProperty({
        description: 'http status code',
    })
    status_code: number;
}

export class APIErrorResponse {
    @ApiProperty({
        description: 'http status code',
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Human readable message of the error',
        example: 'Error in input fields',
    })
    title: string;

    @ApiProperty({
        description: 'Type of the http exception',
        example: 'BadRequestException',
    })
    type: string;

    @ApiProperty({
        description: 'Details about the error',
        example: '["username must be contain only letter and numbers"]',
    })
    details?: undefined | string[];
}
