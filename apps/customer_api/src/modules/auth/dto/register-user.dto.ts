import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches, IsDateString, IsIn } from 'class-validator';

export class RegisterUserDto {



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

  
  // Verification token field
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  verifyToken!: string;
}