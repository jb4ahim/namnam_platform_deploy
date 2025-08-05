import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactPersonDto {
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