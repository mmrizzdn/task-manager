import { Expose, Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Expose({ name: 'created_at' })
  get created_at(): Date {
    return this.createdAt;
  }

  @Exclude()
  updatedAt: Date;

  @Expose({ name: 'updated_at' })
  get updated_at(): Date {
    return this.updatedAt;
  }
}
