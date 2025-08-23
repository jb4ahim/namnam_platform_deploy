import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactPersonDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  role!: string;

  @IsString()
  phoneNumber!: string;

  @IsEmail()
  emailAddress!: string;
}