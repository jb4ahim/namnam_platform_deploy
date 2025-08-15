import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { API_CONSTANTS } from '../constants';

export class PaginationQueryDto {
  @ApiProperty({
    example: 1, 
    description: 'Page number (1-based)',
    minimum: 1,
    default: API_CONSTANTS.DEFAULT_PAGE
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = API_CONSTANTS.DEFAULT_PAGE;

  @ApiProperty({ 
    example: 20, 
    description: 'Number of items per page',
    minimum: API_CONSTANTS.MIN_PAGE_SIZE,
    maximum: API_CONSTANTS.MAX_PAGE_SIZE,
    default: API_CONSTANTS.DEFAULT_PAGE_SIZE
  })
  @Type(() => Number)
  @IsInt()
  @Min(API_CONSTANTS.MIN_PAGE_SIZE)
  @Max(API_CONSTANTS.MAX_PAGE_SIZE)
  @IsOptional()
  pageSize?: number = API_CONSTANTS.DEFAULT_PAGE_SIZE;

  @ApiProperty({
    example: 'createdAt',
    description: 'Field to sort by',
    required: false
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({
    example: 'ASC',
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: API_CONSTANTS.DEFAULT_SORT_ORDER
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = API_CONSTANTS.DEFAULT_SORT_ORDER;
}

export class PaginatedResultDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items: T[];

  @ApiProperty({ example: 100, description: 'Total number of items' })
  totalCount: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 20, description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ example: 5, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;

  constructor(
    items: T[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    this.items = items;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }

  static create<T>(
    items: T[],
    totalCount: number,
    pagination: PaginationQueryDto,
  ): PaginatedResultDto<T> {
    return new PaginatedResultDto(
      items,
      totalCount,
      pagination.page || API_CONSTANTS.DEFAULT_PAGE,
      pagination.pageSize || API_CONSTANTS.DEFAULT_PAGE_SIZE
    );
  }
}