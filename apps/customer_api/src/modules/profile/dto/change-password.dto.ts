import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password for verification', example: 'OldPass123' })
  @IsString()
  @MinLength(6)
  current_password: string;

  @ApiProperty({ description: 'New desired password', example: 'NewPass456' })
  @IsString()
  @MinLength(6)
  new_password: string;
}
