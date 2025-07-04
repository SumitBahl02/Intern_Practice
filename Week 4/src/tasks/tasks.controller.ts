import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, TaskResponseDto, TaskStatus, TaskPriority } from './dto/task.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all tasks with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term', type: String })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Field to sort by', type: String })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc/desc)', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status', enum: TaskStatus })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority', enum: TaskPriority })
  @ApiResponse({ status: 200, description: 'List of tasks with pagination', schema: {
    example: {
      success: true,
      timestamp: '2025-07-04T20:30:00.000Z',
      data: {
        items: [{ id: 1, title: 'Task 1', status: 'PENDING', priority: 'HIGH' }],
        meta: { page: 1, limit: 10, totalItems: 100, totalPages: 10 }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: TaskFilterDto,
    @Request() req,
  ) {
    return this.tasksService.findAll(paginationDto, filterDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Task found', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(+id, req.user.id);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '1' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(+id, updateTaskDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(+id, req.user.id);
  }
}