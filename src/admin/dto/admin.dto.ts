import { Contains, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Contains('admin' || 'employee')
  type: 'admin' | 'employee';

  @IsNotEmpty()
  @MinLength(2)
  first_name: string;

  @IsNotEmpty()
  @MinLength(2)
  last_name: string;
}
