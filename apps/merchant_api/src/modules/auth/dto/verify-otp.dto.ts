import { IsString, IsNotEmpty, IsEmail, IsEnum, Length, Matches, ValidateIf } from 'class-validator';

export enum OtpType {
  EMAIL = 'email',
  PHONE = 'phone'
}

export class VerifyOtpDto {

  @IsString()
  @IsNotEmpty({ message: 'Country code is required when type is phone' })
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + and contain 1-4 digits' })
  countryCode!: string;

  // Phone number is required when type is PHONE
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required when type is phone' })
  @Matches(/^\d{6,15}$/, { message: 'Phone number must contain 6-15 digits only' })
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  @Length(6, 6, { message: 'OTP code must be exactly 6 characters' })
  code!: string;
}