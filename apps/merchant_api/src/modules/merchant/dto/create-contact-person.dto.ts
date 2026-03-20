import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactPersonDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  role!: string;

  @IsString()
  @IsPhoneNumber()
  phoneNumber!: string;

  @IsEmail()
  emailAddress!: string;
}
