import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsLatitude, IsLongitude } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  customerId!: number;

  @IsString()
  @IsOptional()
  label?: string; // e.g., home, work

  @IsString()
  @IsNotEmpty()
  addressLine1!: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsString()
  @IsOptional()
  status?: string;
}
