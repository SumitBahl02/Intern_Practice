import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This task needs more details.' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  taskId: number;
}
