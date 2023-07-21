import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User, Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompanyDTO } from './dto/company.dto';

@Injectable()
export class CompanyService {
  private logger: Logger = new Logger('CompanyService');
  constructor(private prisma: PrismaService) {}

  async getMyCompany(admin: User & { company: Company }) {
    this.logger.log(`Getting company for admin ${admin.id}`);

    return admin.company;
  }

  async updateCompany(dto: CompanyDTO, admin: User & { company: Company }) {
    this.logger.log(`Updating company for admin ${admin.id}`);

    if (admin.type !== 'OWNER')
      throw new UnauthorizedException('You are not an admin');

    this.prisma.user.update({
      where: { id: admin.id },
      data: {
        is_profile_complete: true,
      },
    });

    if (admin.company) {
      return this.prisma.company.update({
        where: { id: admin.company.id },
        data: {
          name: dto.name,
          currency: dto.currency,
          is_profile_complete: true,
        },
      });
    } else {
      const transactionResult = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: admin.id },
          data: {
            is_profile_complete: true,
          },
        }),
        this.prisma.company.create({
          data: {
            name: dto.name,
            currency: dto.currency,
            is_profile_complete: true,
            owner_id: admin.id,
          },
        }),
      ]);

      return transactionResult[1];
    }
  }
}
