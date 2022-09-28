import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { EmployeeDto, NewEmployeeDto } from './dto/employee.dto';
import { EmployeesService } from './employees.service';

@UseGuards(JWTGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private employee: EmployeesService) {}

  @Get('me')
  getMe(@GetUser() user) {
    return this.employee.getEmployee(user);
  }

  @Get()
  getAllEmployees(@GetUser() admin) {
    return this.employee.getEmployees(admin);
  }

  @Get(':id')
  getEmployeeById(@GetUser() admin, @Param('id') id: string) {
    return this.employee.getEmployeeById(admin, id);
  }

  @Post()
  createEmployee(@GetUser() admin, @Body() dto: NewEmployeeDto) {
    return this.employee.createEmployee(admin, dto);
  }

  @Put('me')
  updateEmployee(@GetUser() user, @Body() dto: EmployeeDto) {
    return this.employee.updateEmployee(user, dto);
  }

  @Put(':id')
  updateEmployeeById(
    @GetUser() admin,
    @Param('id') id: string,
    @Body() dto: EmployeeDto,
  ) {
    return this.employee.updateEmployeeById(admin, id, dto);
  }

  @Delete(':id')
  deleteEmployeeById(@GetUser() admin, @Param('id') id: string) {
    return this.employee.deleteEmployee(admin, id);
  }
}
