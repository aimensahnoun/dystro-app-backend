import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Admin, Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyDTO } from './dto/company.dto';

@Injectable()
export class CompanyService {
  private logger: Logger = new Logger('CompanyService');
  constructor(private prisma: PrismaService) {}

  async getMyCompany(admin: Admin & { company: Company }) {
    this.logger.log(`Getting company for admin ${admin.id}`);

    if (admin.type !== 'admin')
      throw new UnauthorizedException('You are not an admin');

    return admin.company;
  }

  async updateCompany(dto: CompanyDTO, admin: Admin & { company: Company }) {
    this.logger.log(`Updating company for admin ${admin.id}`);

    if (admin.type !== 'admin')
      throw new UnauthorizedException('You are not an admin');

    return this.prisma.company.update({
      where: { id: admin.company.id },
      data: {
        name: dto.name,
        currency: dto.currency,
        is_profile_complete: true,
      },
    });
  }
}
