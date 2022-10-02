import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Admin, Company } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CompanyService } from './company.service';
import { CompanyDTO } from './dto/company.dto';

@UseGuards(JWTGuard)
@Controller('company')
export class CompanyController {
  constructor(private company: CompanyService) {}

  @Get()
  getMyCompany(@GetUser() admin: Admin & { company: Company }) {
    return this.company.getMyCompany(admin);
  }

  @Put()
  updateCompany(
    @GetUser() admin: Admin & { company: Company },
    @Body() dto: CompanyDTO,
  ) {
    return this.company.updateCompany(dto, admin);
  }
}
