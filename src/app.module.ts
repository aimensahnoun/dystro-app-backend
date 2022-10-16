import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
import { AdminModule } from './admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CompanyModule } from './company/company.module';
import { ClientModule } from './client/client.module';
import { ProductsModule } from './products/products.module';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.prod'],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    EmployeesModule,
    AdminModule,
    CompanyModule,
    ClientModule,
    ProductsModule,
    SaleModule,
  ],
})
export class AppModule {}
