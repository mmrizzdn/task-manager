import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { QueryTaskDto } from '../tasks/dto/query-task.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(@Query() query: QueryUserDto) {
    return this.usersService.getUsers(query.page, query.limit, query.sort, query.order, query.search);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get(':id/tasks')
  getTasksByUserId(@Param('id') id: string, @Query() query: QueryTaskDto) {
    const isCompleted = query.status === 'completed' ? true : query.status === 'incomplete' ? false : undefined;
    return this.usersService.getTasksByUserId(
      id,
      query.page,
      query.limit,
      query.sort,
      query.order,
      isCompleted,
      query.search,
    );
  }
}
