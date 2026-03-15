import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @Transform(({ obj }) => obj.is_completed ?? obj.isCompleted)
  @Expose({ name: 'is_completed' })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
