import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateLocationDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;


  @IsString()
  street!: string;
  @IsString()
  building?: string;

  @IsString()
  notes?: string;

  @IsArray()
  buildingImages!: string[];
}
