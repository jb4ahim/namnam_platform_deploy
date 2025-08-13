import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntEnhancedPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (value === undefined || value === null) {
      throw new BadRequestException('Value is required');
    }
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException('Validation failed (numeric string is expected)');
    }
    return parsed;
  }
}


