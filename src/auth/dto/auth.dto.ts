import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}

export class VerifyPasswordDto extends ForgotPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  token: string;
}

export class ChangePasswordDto extends ForgotPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
