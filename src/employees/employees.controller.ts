import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { EmployeesService } from './employees.service';

@UseGuards(JWTGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employee: EmployeesService) {}

  @Get('me')
  getMe(@GetUser() user) {
    return user;
  }

  @Post()
  createEmployee(@GetUser() admin) {
    return this.employee.createEmployee(admin);
  }
}
