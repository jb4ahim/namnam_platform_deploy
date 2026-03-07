import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserListItemDto {
  @ApiProperty({ example: 45 })
  id: number;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  email?: string;

  @ApiProperty({ example: '76123456' })
  phone_number: string;

  @ApiProperty({ example: '2025-10-31T15:21:23.979Z' })
  created_at: string;
}

export class PaginatedUsersDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  page_size: number;

  @ApiProperty({ example: 61 })
  total_count: number;

  @ApiProperty({ example: 4 })
  total_pages: number;

  @ApiProperty({ type: [UserListItemDto] })
  items: UserListItemDto[];
}
