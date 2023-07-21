import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(admin: User & { company: Company }, dto: ProductDto) {
    if (admin.type !== 'OWNER')
      throw new UnauthorizedException('Only admins can create products');

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        company_id: admin.company.id,
      },
    });

    return product;
  }

  async getProducts(admin: User & { company: Company }) {
    const products = await this.prisma.product.findMany({
      where: {
        company_id: admin.company.id,
      },
    });

    return products;
  }

  async disableProduct(admin: User & { company: Company }, id: string) {
    if (admin.type !== 'OWNER')
      throw new UnauthorizedException('Only admins can disable products');

    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        in_stock: false,
      },
    });

    return product;
  }

  async enableProduct(admin: User & { company: Company }, id: string) {
    if (admin.type !== 'OWNER')
      throw new UnauthorizedException('Only admins can disable products');

    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        in_stock: true,
      },
    });

    return product;
  }

  async deleteProduct(admin: User & { company: Company }, id: string) {
    if (admin.type !== 'OWNER')
      throw new UnauthorizedException('Only admins can delete products');

    const product = await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return product;
  }
}
