import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin } from '@prisma/client';

@Injectable()
export class EmployeesService {
  createEmployee(admin: Admin) {
    if (admin.type !== 'admin')
      return new UnauthorizedException('Only admins are allowed');

    if (!admin.is_profile_complete)
      return new UnauthorizedException('Please complete your profile first');

    return 'This action adds a new employee';
  }

  updateEmployee() {
    return 'This action updates an employee';
  }

  deleteEmployee() {
    return 'This action removes an employee';
  }

  getEmployee() {
    return 'This action returns an employee';
  }

  getEmployees() {
    return 'This action returns all employees';
  }
}
