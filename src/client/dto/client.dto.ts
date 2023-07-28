import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone_number: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(3)
  address: string;

  @IsNotEmpty()
  @IsLatitude()
  lat: string;

  @IsLongitude()
  @IsNotEmpty()
  long: string;

  @IsNotEmpty()
  @MinLength(2)
  store_name: string;
}
