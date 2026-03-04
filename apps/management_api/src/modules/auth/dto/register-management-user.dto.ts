import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterManagementUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Email address (used as login)', example: 'john.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password (minimum 8 characters)', example: 'SecureP@ssw0rd', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ description: 'Optional phone number', example: '+971501234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Default currency code', example: 'AED' })
  @IsOptional()
  @IsString()
  defaultCurrency?: string;

  @ApiPropertyOptional({ description: 'Country code', example: 'AE' })
  @IsOptional()
  @IsString()
  countryCode?: string;
}

