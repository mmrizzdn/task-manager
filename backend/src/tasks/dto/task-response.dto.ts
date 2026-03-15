import { Expose, Exclude, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class TaskResponseDto {
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string | null;

  @Exclude({ toPlainOnly: true })
  isCompleted: boolean;

  @Expose({ name: 'is_completed' })
  get is_completed(): boolean {
    return this.isCompleted;
  }

  userId: string;

  @Expose({ name: 'user_id' })
  get user_id(): string {
    return this.userId;
  }

  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @Expose({ name: 'created_at' })
  get created_at(): Date {
    return this.createdAt;
  }

  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @Expose({ name: 'updated_at' })
  get updated_at(): Date {
    return this.updatedAt;
  }

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;
}
