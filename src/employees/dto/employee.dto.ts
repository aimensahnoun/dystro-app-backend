import { Transform, TransformFnParams } from 'class-transformer';
import { Contains, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class EmployeeDto {
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}

export class NewEmployeeDto {
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
