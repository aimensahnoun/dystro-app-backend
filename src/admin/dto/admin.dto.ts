import { Transform, TransformFnParams } from 'class-transformer';
import { Contains, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  last_name: string;
}

export class AdminRegisterDto extends AdminDto {
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
