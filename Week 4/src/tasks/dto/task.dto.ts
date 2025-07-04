import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement API authentication', description: 'Task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Add JWT authentication to the API endpoints', description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING, description: 'Task status' })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status?: string;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM, description: 'Task priority' })
  @IsOptional()
  @IsIn(Object.values(TaskPriority))
  priority?: string;

  @ApiPropertyOptional({ example: 1, description: 'Project ID this task belongs to' })
  @IsOptional()
  @IsInt()
  projectId?: number;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Implement API authentication', description: 'Task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Add JWT authentication to the API endpoints', description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, description: 'Task status' })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status?: string;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Task priority' })
  @IsOptional()
  @IsIn(Object.values(TaskPriority))
  priority?: string;

  @ApiPropertyOptional({ example: 1, description: 'Project ID this task belongs to' })
  @IsOptional()
  @IsInt()
  projectId?: number;
}

export class TaskFilterDto {
  @ApiPropertyOptional({ enum: TaskStatus, description: 'Filter tasks by status' })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status?: string;

  @ApiPropertyOptional({ enum: TaskPriority, description: 'Filter tasks by priority' })
  @IsOptional()
  @IsIn(Object.values(TaskPriority))
  priority?: string;
}

// Response schema for Swagger documentation
export class TaskResponseDto {
  @ApiProperty({ example: 1, description: 'Task ID' })
  id: number;

  @ApiProperty({ example: 'Implement API authentication', description: 'Task title' })
  title: string;

  @ApiProperty({ example: 'Add JWT authentication to the API endpoints', description: 'Task description' })
  description: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, description: 'Task status' })
  status: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, description: 'Task priority' })
  priority: string;

  @ApiProperty({ example: 1, description: 'User ID of task owner' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Project ID this task belongs to', nullable: true })
  projectId: number | null;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}