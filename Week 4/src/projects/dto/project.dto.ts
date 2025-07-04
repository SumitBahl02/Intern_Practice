import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export class CreateProjectDto {
  @ApiProperty({ example: 'E-commerce Platform', description: 'Project name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Online shopping platform with user authentication and payment processing', description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.PLANNING, description: 'Project status' })
  @IsOptional()
  @IsIn(Object.values(ProjectStatus))
  status?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'E-commerce Platform v2', description: 'Project name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated project description', description: 'Project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProjectStatus, description: 'Project status' })
  @IsOptional()
  @IsIn(Object.values(ProjectStatus))
  status?: string;
}

// Response schema for Swagger documentation
export class ProjectResponseDto {
  @ApiProperty({ example: 1, description: 'Project ID' })
  id: number;

  @ApiProperty({ example: 'E-commerce Platform', description: 'Project name' })
  name: string;

  @ApiProperty({ example: 'Online shopping platform with user authentication and payment processing', description: 'Project description' })
  description: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.ACTIVE, description: 'Project status' })
  status: string;

  @ApiProperty({ example: 1, description: 'User ID of project owner' })
  userId: number;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}