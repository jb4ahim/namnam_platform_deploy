import { IsBoolean } from 'class-validator';

export class VoteHelpfulDto {
  @IsBoolean()
  is_helpful: boolean;
}
