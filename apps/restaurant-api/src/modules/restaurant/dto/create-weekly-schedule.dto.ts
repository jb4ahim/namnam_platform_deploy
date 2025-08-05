import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DayScheduleDto {
  @IsString()
  day!: string;

  @IsBoolean()
  is_open!: boolean;

  @IsOptional()
  @IsString()
  open?: string;

  @IsOptional()
  @IsString()
  close?: string;
}

export class CreateWeeklyScheduleDto {
  @IsString()
  merchant_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  weeklySchedule!: DayScheduleDto[];
}