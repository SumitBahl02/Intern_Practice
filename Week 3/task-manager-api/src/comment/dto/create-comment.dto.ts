import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ example: 'This task needs more details.' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  taskId: number;
}
