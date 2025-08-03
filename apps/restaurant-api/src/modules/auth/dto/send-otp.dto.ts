import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches, ValidateIf } from 'class-validator';

export class SendOtpDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + and contain 1-4 digits' })
  countryCode?: string; // e.g., "+1", "+44", "+961"

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, { message: 'Phone number must contain 6-15 digits only' })
  phoneNumber?: string; // e.g., "1234567890"

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email?: string; // e.g., "user@example.com"

  // Custom validation to ensure at least one contact method is provided
  @ValidateIf((o) => !o.email && !o.phoneNumber)
  @IsNotEmpty({ message: 'Either email or phone number must be provided' })
  contactMethod?: never;

  // Ensure country code is provided when phone number is provided
  @ValidateIf((o) => !!o.phoneNumber)
  @IsNotEmpty({ message: 'Country code is required when phone number is provided' })
  countryCodeRequired?: never;
}