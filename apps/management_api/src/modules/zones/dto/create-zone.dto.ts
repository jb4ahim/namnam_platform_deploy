import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  zoneName: string;

  @IsString()
  @IsOptional()
  zoneDescription?: string;
}
