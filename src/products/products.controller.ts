import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User, Company } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';

@UseGuards(JWTGuard)
@Controller('products')
export class ProductsController {
  private logger: Logger;
  constructor(private productsService: ProductsService) {
    this.logger = new Logger('ProductsController');
  }

  @Post()
  createProduct(
    @GetUser() admin: User & { ownedCompany: Company },
    @Body() dto: ProductDto,
  ) {
    this.logger.log(`createProduct: ${JSON.stringify(dto)} by ${admin.id}`);
    return this.productsService.createProduct(admin, dto);
  }

  @Get()
  getProducts(@GetUser() admin: User & { ownedCompany: Company }) {
    this.logger.log(`getProducts by ${admin.id}`);
    return this.productsService.getProducts(admin);
  }

  @Put('disable/:id')
  disableProduct(
    @GetUser() admin: User & { ownedCompany: Company },
    @Param('id') id: string,
  ) {
    this.logger.log(`disableProduct: ${id} by ${admin.id}`);
    return this.productsService.disableProduct(admin, id);
  }

  @Put('enable/:id')
  enableProduct(
    @GetUser() admin: User & { ownedCompany: Company },
    @Param('id') id: string,
  ) {
    this.logger.log(`enableProduct: ${id} by ${admin.id}`);
    return this.productsService.enableProduct(admin, id);
  }

  @Delete(':id')
  deleteProduct(
    @GetUser() admin: User & { ownedCompany: Company },
    @Param('id') id: string,
  ) {
    this.logger.log(`deleteProduct: ${id} by ${admin.id}`);
    return this.productsService.deleteProduct(admin, id);
  }
}
