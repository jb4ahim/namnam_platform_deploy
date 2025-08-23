import { IsNumber, IsString } from "class-validator";

class CreateLocationDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;


  @IsString()
  addressText!: string;
}
