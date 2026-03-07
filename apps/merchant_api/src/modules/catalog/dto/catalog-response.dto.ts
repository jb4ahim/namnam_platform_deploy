import { ApiProperty } from '@nestjs/swagger';

export class CatalogSectionDto {
  @ApiProperty({ example: 21 })
  sectionId: number;

  @ApiProperty({ example: 'sweet' })
  sectionTitleEn: string;

  @ApiProperty({ example: 'حلو' })
  sectionTitleAr: string;

  @ApiProperty({ example: false })
  isDisabled: boolean;

  @ApiProperty({ example: 4 })
  numberOfProducts: number;
}
