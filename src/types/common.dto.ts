import { Expose, Type } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
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
