import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { Auth } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<{ user: Auth; token: string }> {
    try {
      this.logger.log('AUTH HELLO WORLD');

      const passwordHash = await argon2.hash(dto.password);

      const user = await this.prisma.auth.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
      });

      const jwt = await this.signToken(user.id, user.email);

      delete user.hash;

      return {
        user,
        token: jwt,
      };
    } catch (err) {
      this.logger.error(err);
      if (err.code === 'P2002') {
        throw new InternalServerErrorException(
          'User with that email already exists',
        );
      }
      throw new InternalServerErrorException(err);
    }
  }

  async login(dto: AuthDto): Promise<{ user: Auth; token: string }> {
    try {
      // this.logger.log('AUTH HELLO WORLD');

      const user = await this.prisma.auth.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new NotFoundException('User does not exist');

      const passwordMatch = await argon2.verify(user.hash, dto.password);

      if (!passwordMatch) throw new NotFoundException('Invalid credentials');

      const jwt = await this.signToken(user.id, user.email);

      delete user.hash;

      await this.prisma.auth.update({
        where: {
          id: user.id,
        },
        data: {
          last_login: new Date(),
        },
      });

      return {
        user,
        token: jwt,
      };
    } catch (err) {
      this.logger.error(err);

      throw new InternalServerErrorException(err.stack);
    }
  }

  signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
