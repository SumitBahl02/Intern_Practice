import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ enum: ['USER', 'ADMIN'], default: 'USER', description: 'User role' })
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'User password' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ enum: ['USER', 'ADMIN'], description: 'User role' })
  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: string;
}

// Response schema for Swagger documentation
export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'], example: 'USER', description: 'User role' })
  role: string;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-04T20:30:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}