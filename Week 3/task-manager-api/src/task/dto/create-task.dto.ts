import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Write blog post' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A task to write the company blog post' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: 'pending' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  projectId?: number;
}
