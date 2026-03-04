import { IsString, IsNotEmpty, IsEmail, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Country calling code', example: '+961' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + and contain 1-4 digits' })
  countryCode!: string; // e.g., "+1", "+44", "+961"

  @ApiProperty({ description: 'Phone number without country code', example: '71234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, { message: 'Phone number must contain 6-15 digits only' })
  phoneNumber!: string; // e.g., "1234567890"

  @ApiProperty({ description: '6-digit OTP code received via SMS', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  code!: string;

}