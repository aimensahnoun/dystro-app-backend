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

      const [user, admin] = await this.prisma.$transaction([
        this.prisma.auth.create({
          data: {
            email: dto.email,
            hash: passwordHash,
            type: 'admin',
          },
        }),
        this.prisma.admin.create({
          data: {
            email: dto.email,
            first_name: '',
            last_name: '',
          },
        }),
      ]);

      await this.prisma.company.create({
        data: {
          name: '',
          currency: '',
          owner_id: admin.id,
        },
      });

      const jwt = await this.signToken(user.email, 'admin');

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

      const jwt = await this.signToken(user.email, user.type);

      delete user.hash;

      await this.prisma.auth.update({
        where: {
          email: user.email,
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

  signToken(email: string, type: string): Promise<string> {
    const payload = {
      email,
      type,
    };

    return this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
