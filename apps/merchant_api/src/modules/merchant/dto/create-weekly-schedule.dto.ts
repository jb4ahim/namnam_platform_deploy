import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DayScheduleDto {
  @IsString()
  day!: string;

  @IsBoolean()
  isOpen!: boolean;

  @IsOptional()
  @IsString()
  open?: string;

  @IsOptional()
  @IsString()
  close?: string;
}

export class CreateWeeklyScheduleDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  weeklySchedule!: DayScheduleDto[];
}