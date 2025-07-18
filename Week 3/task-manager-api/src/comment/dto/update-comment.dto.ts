import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment content.' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
