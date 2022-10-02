import { Transform, TransformFnParams } from 'class-transformer';
import { IsIn, IsNotEmpty, MinLength } from 'class-validator';
import * as cc from 'currency-codes';

export class CompanyDTO {
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim().toUpperCase())
  @IsIn(cc.codes())
  currency: string;
}
