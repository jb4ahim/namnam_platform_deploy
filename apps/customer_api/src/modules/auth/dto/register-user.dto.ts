import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches, IsDateString, IsIn } from 'class-validator';

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

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Birthday must be a valid date in YYYY-MM-DD format' })
  birthday?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Default currency must be a 3-letter currency code' })
  @Matches(/^[A-Z]{3}$/, { message: 'Default currency must be uppercase 3-letter code (e.g., USD, EUR, LBP)' })
  defaultCurrency?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'], { message: 'Status must be active, inactive, or suspended' })
  status?: string;
}