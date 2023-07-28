import { Injectable, Logger } from '@nestjs/common';
import { Company, User, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleDto } from './dto/sale.dto';

@Injectable()
export class SaleService {
  private logger: Logger;
  constructor(private prisma: PrismaService) {
    this.logger = new Logger('SaleService');
  }

  async createSale(
    user: User & { company: Company } & {
      ownedCompany: Company;
    },
    dto: SaleDto,
  ) {
    this.logger.debug(
      `Creating sale by : ${user.id} for company: ${
        user.company.id
      } and client: ${dto.client_id} with ${JSON.stringify(dto)} `,
    );

    return this.prisma.$transaction(async (tx: PrismaClient) => {
      let total = 0;

      dto.sale_items.forEach((item) => {
        total += item.price * item.quantity;
      });

      const companyId = user.company?.id
        ? user.company.id
        : user.ownedCompany.id;

      const sale = await tx.sale.create({
        data: {
          client_id: dto.client_id,
          company_id: companyId,
          user_id: user.id,
          total,
        },
      });

      const saleItems = dto.sale_items.map((item) => {
        return {
          ...item,
          sale_id: sale.id,
        };
      });

      await tx.saleItem.createMany({
        data: saleItems,
      });
    });
  }

  async getSales(
    user: User & { company: Company } & {
      ownedCompany: Company;
    },
  ) {
    const companyId = user.company?.id ? user.company.id : user.ownedCompany.id;

    return this.prisma.sale.findMany({
      where: {
        company_id: companyId,
      },
      include: {
        SaleItem: true,
        client: true,
        user: true,
        company: true,
      },
    });
  }
}
