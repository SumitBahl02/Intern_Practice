import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsInt({ message: 'Age must be a number' })
  @Min(1, { message: 'Age must be at least 1' })
  @Max(120, { message: 'Age must be at most 120' })
  age: number;
}
