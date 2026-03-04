import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginManagementUserDto {
  @ApiProperty({ description: 'User login email', example: 'admin@management.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User login password', example: 'SecureP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password!: string;
}

