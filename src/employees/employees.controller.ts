import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JWTGuard)
@Controller('employees')
export class EmployeesController {
  @Get('me')
  getMe(@User() user) {
    return user;
  }
}
