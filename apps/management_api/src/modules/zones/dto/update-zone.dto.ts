import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  zoneName?: string;

  @IsString()
  @IsOptional()
  zoneDescription?: string;
}
