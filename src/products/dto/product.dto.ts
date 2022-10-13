import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, MinLength } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
