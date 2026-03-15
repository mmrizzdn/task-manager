import { IsEmail, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((obj) => obj.password && obj.password.length > 0)
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  @Transform(({ obj }) => obj.confirm_password ?? obj.confirmPassword)
  confirm_password?: string;
}
