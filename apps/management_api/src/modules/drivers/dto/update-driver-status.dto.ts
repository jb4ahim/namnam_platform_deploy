import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverStatusDto {
  @ApiProperty({ example: 'suspended', enum: ['active', 'inactive', 'suspended'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['active', 'inactive', 'suspended'])
  status!: string;
}
