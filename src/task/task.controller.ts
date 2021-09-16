import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Task } from 'src/entity/task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: Task) {
    const user = this.taskService.create(body);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('getall')
  async getAll() {
    const tasks = this.taskService.getAll();
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Body() body: Task) {
    const tasks = this.taskService.update(body);
    return tasks;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    const tasks = this.taskService.delete(id);
    return tasks;
  }
}
