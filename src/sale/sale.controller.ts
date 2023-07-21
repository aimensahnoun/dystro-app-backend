import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleDto } from './dto/sale.dto';
import { SaleService } from './sale.service';
import { User, Company } from '@prisma/client';

@UseGuards(JWTGuard)
@Controller('sale')
export class SaleController {
  private logger;
  constructor(private prisma: PrismaService, private saleService: SaleService) {
    this.logger = new Logger('SaleController');
  }

  @Post()
  createSale(
    @GetUser() user: User & { company: Company },
    @Body() dto: SaleDto,
  ) {
    return this.saleService.createSale(user, dto);
  }

  @Get()
  getSales(@GetUser() user: User & { company: Company }) {
    return this.saleService.getSales(user);
  }
}
