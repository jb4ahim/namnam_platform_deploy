import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ description: 'User email address', example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User gender', enum: ['male', 'female', 'other'], example: 'male' })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
  gender?: string;

  @ApiPropertyOptional({ description: 'User birth date in YYYY-MM-DD format', example: '1990-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'Birthday must be a valid date in YYYY-MM-DD format' })
  birthday?: string;

  @ApiPropertyOptional({ description: 'Default currency code (3 letters)', example: 'USD' })
  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'Default currency must be a 3-letter currency code' })
  @Matches(/^[A-Z]{3}$/, { message: 'Default currency must be uppercase 3-letter code (e.g., USD, EUR, LBP)' })
  defaultCurrency?: string;

  @ApiPropertyOptional({ description: 'User account status', enum: ['active', 'inactive', 'suspended'], example: 'active' })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended'], { message: 'Status must be active, inactive, or suspended' })
  status?: string;

  
  @ApiPropertyOptional({ description: 'Referral code from an existing customer', example: 'X7K2PQ3R' })
  @IsOptional()
  @IsString()
  referralCode?: string;

  // Verification token field
  @ApiProperty({ description: 'Verification token received after OTP validation', example: 'eyJhbGciOiJIUzI1Ni...' })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  verifyToken!: string;
}