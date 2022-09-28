import {
  ConsoleLogger,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin, Company, Employee } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeDto, NewEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(admin: any, dto: NewEmployeeDto) {
    try {
      if (admin.type !== 'admin')
        return new UnauthorizedException('Only admins are allowed');

      if (!admin.is_profile_complete)
        return new UnauthorizedException('Please complete your profile first');

      const passwordHash = await argon2.hash(dto.password);

      const [employeeAuth, employee] = await this.prisma.$transaction([
        this.prisma.auth.create({
          data: {
            email: dto.email,
            hash: passwordHash,
            type: 'employee',
          },
        }),
        this.prisma.employee.create({
          data: {
            first_name: dto.first_name,
            last_name: dto.last_name,
            email: dto.email,
            company_id: admin.company.id,
            is_profile_complete: true,
          },
        }),
      ]);

      return employee;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new InternalServerErrorException(
          'User with that email already exists',
        );
      }
      throw new InternalServerErrorException(err);
    }
  }

  async updateEmployee(
    user: Employee & { company: Company },
    dto: EmployeeDto,
  ) {
    if (user.type !== 'employee')
      return new UnauthorizedException('Only employees are allowed');

    if (dto.email !== user.email) {
      const emailExists = await this.prisma.auth.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) return new UnauthorizedException('Email already exists');
    }

    const [newAuth, newEmployee] = await this.prisma.$transaction([
      this.prisma.auth.update({
        where: { email: user.email },
        data: { email: dto.email },
      }),
      this.prisma.employee.update({
        where: { id: user.id },
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          is_profile_complete: true,
        },
      }),
    ]);

    return newEmployee;
  }

  getEmployee(user: Employee) {
    if (user.type !== 'employee')
      return new UnauthorizedException('Only employees are allowed');

    return user;
  }

  async getEmployees(admin: any) {
    if (admin.type !== 'admin')
      return new UnauthorizedException('Only admins are allowed');

    return this.prisma.employee.findMany({
      where: { company_id: admin.company.id },
    });
  }
  async getEmployeeById(admin: any, id: string) {
    if (admin.type !== 'admin')
      return new UnauthorizedException('Only admins are allowed');

    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { company: true },
    });

    if (employee.company_id !== admin.company.id)
      return new UnauthorizedException(
        'You are not allowed to view this employee',
      );

    return employee;
  }

  async updateEmployeeById(admin: any, id: string, dto: EmployeeDto) {
    if (admin.id === id) return this.updateEmployee(admin, dto);

    const user = await this.getEmployeeById(admin, id);

    if (user instanceof UnauthorizedException)
      return new UnauthorizedException();

    return this.updateEmployee(user, dto);
  }

  deleteEmployee() {
    return 'This action removes an employee';
  }
}
