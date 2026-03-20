import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDriverDto {
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

  @ApiProperty({ description: 'Password (temporary on first login)', example: 'Xk9#mP2@qL4!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
