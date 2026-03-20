import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Country code with + prefix', example: '+961' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + followed by 1-4 digits' })
  countryCode!: string;

  @ApiProperty({ description: 'Phone number without country code', example: '71234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, { message: 'Phone number must be 6-15 digits' })
  phoneNumber!: string;

  @ApiProperty({ description: '6-digit OTP code', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  code!: string;
}
