import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + and contain 1-4 digits' })
  countryCode!: string; // e.g., "+1", "+44", "+961"

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, { message: 'Phone number must contain 6-15 digits only' })
  phoneNumber!: string; // e.g., "1234567890"

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // NEW: Registration token field added to DTO
  @IsString()
  @IsNotEmpty({ message: 'Registration token is required' })
  registrationToken!: string;
}