import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'AI Assistant' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Build a smart assistant using NestJS and ML' })
  @IsNotEmpty()
  description: string;
}
