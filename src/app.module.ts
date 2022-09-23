import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.prod'],
    }),
    PrismaModule,
  ],
})
export class AppModule {}
