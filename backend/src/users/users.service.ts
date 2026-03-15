import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { TaskResponseDto } from '../tasks/dto/task-response.dto';
import { Prisma } from '../generated/prisma/client';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  private getSortField(sort: string): string {
    const sortMap: Record<string, string> = {
      created_at: 'createdAt',
      name: 'name',
      email: 'email',
    };
    return sortMap[sort] ?? 'createdAt';
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) throw new ConflictException('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const { confirm_password, ...userData } = createUserDto;

    const user = await this.prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    await this.cacheService.invalidateByPrefix('users');

    return plainToInstance(UserResponseDto, user);
  }

  async getUsers(page = 1, limit = 10, sort = 'name', order = 'asc', search?: string) {
    const skip = (page - 1) * limit;
    const sortField = this.getSortField(sort);
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { [sortField]: order } as Prisma.UserOrderByWithRelationInput,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const result = {
      data: users.map((u) => plainToInstance(UserResponseDto, u)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };

    return result;
  }

  async getUserById(id: string) {
    const cacheKey = `user:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const result = plainToInstance(UserResponseDto, user);
    await this.cacheService.set(cacheKey, result);
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const data = Object.fromEntries(
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined)
    ) as Record<string, any>;

    if (data.password && data.password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password;
    }

    delete data.confirm_password;

    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) throw new ConflictException('Email already exists');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    await this.cacheService.del(`user:${id}`);

    return plainToInstance(UserResponseDto, updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.prisma.user.delete({ where: { id } });

    await this.cacheService.del(`user:${id}`);

    return null;
  }

  async getTasksByUserId(
    userId: string,
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'desc',
    isCompleted?: boolean,
    search?: string,
  ) {
    const cacheKey = `tasks:user:${userId}:${page}:${limit}:${sort}:${order}:${isCompleted ?? ''}:${search ?? ''}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const sortField = this.getSortField(sort);
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(isCompleted !== undefined ? { isCompleted } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [_, tasks, total] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }).then((u) => {
        if (!u) throw new NotFoundException('User not found');
        return u;
      }),
      this.prisma.task.findMany({
        where,
        orderBy: { [sortField]: order } as Prisma.TaskOrderByWithRelationInput,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const result = {
      data: tasks.map((t) => plainToInstance(TaskResponseDto, t)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };

    await this.cacheService.set(cacheKey, result);
    return result;
  }
}
