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
    ASC = 'ASC',
    DESC = 'DESC',
}

export class Page {
    @Expose()
    readonly cur_page: number;

    @Expose()
    readonly page_size: number;

    @Expose()
    readonly total_pages: number;

    @Expose()
    readonly total_items: number;
}

export class MetaData {
    @Expose()
    @Type(() => Page)
    readonly pagination: Page;
}

export class PaginationSearchSort {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1, { message: 'page number must be at least 1' })
    readonly 'page[number]'?: number = 1;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly 'page[size]'?: number = 20;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly searchTerm?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(OrderValues)
    readonly order?: 'ASC' | 'DESC' = 'DESC';
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
