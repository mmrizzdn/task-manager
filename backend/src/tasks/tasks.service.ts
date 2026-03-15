import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { Prisma } from '../generated/prisma/client';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) { }

  private getSortField(sort: string): string {
    const sortMap: Record<string, string> = {
      created_at: 'createdAt',
      title: 'title',
      is_completed: 'isCompleted',
    };
    return sortMap[sort] ?? 'createdAt';
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });

    await this.cacheService.invalidateByPrefix('tasks');

    return plainToInstance(TaskResponseDto, task);
  }

  async getTasks(page = 1, limit = 10, sort = 'created_at', order = 'desc', isCompleted?: boolean, search?: string) {
    const skip = (page - 1) * limit;
    const sortField = this.getSortField(sort);
    const where: Prisma.TaskWhereInput = {
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

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: { [sortField]: order } as Prisma.TaskOrderByWithRelationInput,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((t) => plainToInstance(TaskResponseDto, t)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getMyTasks(
    userId: string,
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'desc',
    isCompleted?: boolean,
    search?: string,
  ) {
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

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: { [sortField]: order } as Prisma.TaskOrderByWithRelationInput,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map((t) => plainToInstance(TaskResponseDto, t)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getTaskById(id: string) {
    const cacheKey = `task:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    const result = plainToInstance(TaskResponseDto, task);
    await this.cacheService.set(cacheKey, result);
    return result;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    if (task.userId !== userId) throw new ForbiddenException('You can only update your own tasks');

    const data = Object.fromEntries(
      Object.entries(updateTaskDto).filter(([_, value]) => value !== undefined)
    );

    const updated = await this.prisma.task.update({
      where: { id },
      data,
    });

    await this.cacheService.del(`task:${id}`);

    return plainToInstance(TaskResponseDto, updated);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('You can only delete your own tasks');

    await this.prisma.task.delete({ where: { id } });

    await this.cacheService.del(`task:${id}`);
    await this.cacheService.invalidateByPrefix(`tasks:user:${userId}`);
    await this.cacheService.invalidateByPrefix('tasks:');

    return null;
  }

  async getMyTaskStats(userId: string) {
    const [total, completed, incomplete] = await Promise.all([
      this.prisma.task.count({ where: { userId } }),
      this.prisma.task.count({ where: { userId, isCompleted: true } }),
      this.prisma.task.count({ where: { userId, isCompleted: false } }),
    ]);

    return { total, completed, incomplete };
  }
}
