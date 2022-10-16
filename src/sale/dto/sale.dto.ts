import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Sale, SaleItem } from '@prisma/client';

export class SaleDto {
  @IsNotEmpty()
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  company_id: string;

  @IsNotEmpty()
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  client_id: string;

  @IsNotEmpty()
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  user_id: string;

  @IsArray()
  @IsNotEmpty()
  sale_items: SaleItem[];
}
