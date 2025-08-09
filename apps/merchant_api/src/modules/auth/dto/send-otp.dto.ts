import { IsString, IsNotEmpty, IsEmail, IsEnum, Length, Matches, ValidateIf, IsOptional } from 'class-validator';

export enum OtpType {
  EMAIL = 'email',
  PHONE = 'phone'
}

export class SendOtpDto {
  @IsEnum(OtpType, { message: 'Type must be either email or phone' })
  @IsNotEmpty()
  type!: OtpType;

  // Email is required when type is EMAIL
  @ValidateIf((o) => o.type === OtpType.EMAIL)
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required when type is email' })
  email?: string;

  // Country code is required when type is PHONE
  @ValidateIf((o) => o.type === OtpType.PHONE)
  @IsString()
  @IsNotEmpty({ message: 'Country code is required when type is phone' })
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + and contain 1-4 digits' })
  countryCode?: string;

  // Phone number is required when type is PHONE
  @ValidateIf((o) => o.type === OtpType.PHONE)
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required when type is phone' })
  @Matches(/^\d{6,15}$/, { message: 'Phone number must contain 6-15 digits only' })
  phoneNumber?: string;

  // NEW: Optional sessionId to add phone to existing email session
  @IsOptional()
  @IsString()
  sessionId?: string;
}