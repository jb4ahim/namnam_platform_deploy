import { IsOptional, IsString } from 'class-validator';

export class CreateOrderNoteDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  visibility?: 'internal' | 'customer';
}
