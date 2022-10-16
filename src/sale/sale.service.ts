import { Injectable, Logger } from '@nestjs/common';
import { Admin, Company, Employee, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleDto } from './dto/sale.dto';

@Injectable()
export class SaleService {
  private logger: Logger;
  constructor(private prisma: PrismaService) {
    this.logger = new Logger('SaleService');
  }

  async createSale(
    user: (Admin | Employee) & { company: Company },
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

      const sale = await tx.sale.create({
        data: {
          client_id: dto.client_id,
          company_id: user.company.id,
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

  async getSales(user: (Admin | Employee) & { company: Company }) {
    return this.prisma.sale.findMany({
      where: {
        company_id: user.company.id,
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
