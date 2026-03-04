import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteHelpfulDto {
  @ApiProperty({ description: 'Whether the review is helpful (true) or not (false)', example: true })
  @IsBoolean()
  is_helpful: boolean;
}
