import { Expose } from 'class-transformer';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
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
    readonly pagination: Page;
}

export class PaginationSearchSort {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly 'page[number]'?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    readonly 'page[size]'?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly searchTerm?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(OrderValues)
    readonly order?: 'ASC' | 'DESC' = 'ASC';
}
