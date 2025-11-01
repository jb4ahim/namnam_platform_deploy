import { IsString } from 'class-validator';

export class UpdateDeliveryInstructionsDto {
  @IsString()
  delivery_instructions: string;
}
