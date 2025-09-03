import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  sectionTitleArabic!: string;

  @IsString()
  @IsNotEmpty()
  sectionTitleEnglish!: string;
}
