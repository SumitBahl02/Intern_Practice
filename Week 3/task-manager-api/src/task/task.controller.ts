import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // 🔐 this applies to the whole controller
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @GetUser() user: any) {
    return this.taskService.create(user.userId, dto);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.taskService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.taskService.findOne(user.userId, id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.taskService.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.taskService.remove(user.userId, id);
  }

  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getComments(id);
  }
}
