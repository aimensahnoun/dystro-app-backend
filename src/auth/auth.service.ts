import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly logger: Logger, private prisma: PrismaService) {}

  register(): string {
    this.logger.log('AUTH HELLO WORLD');
    return 'Hello World!';
  }
}
