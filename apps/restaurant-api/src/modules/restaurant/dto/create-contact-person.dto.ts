import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactPersonDto {
  @IsString()
  @IsOptional()
  merchant_id?: string;

  @IsOptional()
  @IsString()
  contact_id?: string;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsString()
  role!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  email!: string;
}