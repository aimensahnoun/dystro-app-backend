import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  first_name: string;

  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  last_name: string;

  @IsNotEmpty()
  @IsPhoneNumber()
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

  @IsOptional()
  store_name: string;
}
