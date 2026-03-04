import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryInstructionsDto {
  @ApiProperty({ description: 'New delivery instructions', example: 'Call me when you arrive' })
  @IsString()
  delivery_instructions: string;
}
