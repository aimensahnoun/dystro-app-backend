import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  providers: [ClientService, JwtStrategy, ConfigService],
  controllers: [ClientController],
})
export class ClientModule {}
