import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ obj }) => obj.is_completed ?? obj.isCompleted)
  @Expose({ name: 'is_completed' })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
