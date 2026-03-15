import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req: { user: { id: string } }) {
    return this.tasksService.createTask(createTaskDto, req.user.id);
  }

  @Get('my-stats')
  @UseGuards(JwtAuthGuard)
  getMyTaskStats(@Request() req: { user: { id: string } }) {
    return this.tasksService.getMyTaskStats(req.user.id);
  }

  @Get()
  getTasks(@Query() query: QueryTaskDto) {
    const isCompleted = query.status === 'completed' ? true : query.status === 'incomplete' ? false : undefined;
    return this.tasksService.getTasks(query.page, query.limit, query.sort, query.order, isCompleted, query.search);
  }

  @Get('my-tasks')
  @UseGuards(JwtAuthGuard)
  getMyTasks(@Request() req: { user: { id: string } }, @Query() query: QueryTaskDto) {
    const isCompleted = query.status === 'completed' ? true : query.status === 'incomplete' ? false : undefined;
    return this.tasksService.getMyTasks(
      req.user.id,
      query.page,
      query.limit,
      query.sort,
      query.order,
      isCompleted,
      query.search,
    );
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req: { user: { id: string } }) {
    return this.tasksService.updateTask(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTask(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.tasksService.deleteTask(id, req.user.id);
  }
}

@Controller('users')
export class UserTasksController {
  constructor(private readonly tasksService: TasksService) {}
}
