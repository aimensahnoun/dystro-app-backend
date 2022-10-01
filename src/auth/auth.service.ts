import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import {
  AuthDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  VerifyPasswordDto,
} from './dto/auth.dto';
import { Auth } from '@prisma/client';
import { AdminRegisterDto } from 'src/admin/dto/admin.dto';
import { totp } from 'otplib';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TotpGeneratedEvent } from './events/events';
import * as SendGrid from '@sendgrid/mail';
import { TOTP_MESSAGE } from 'src/consts/send-grid';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private eventEmitter: EventEmitter2,
  ) {
    SendGrid.setApiKey(this.config.get('SEND_GRID'));
  }

  async register(
    dto: AdminRegisterDto,
  ): Promise<{ user: Auth; token: string }> {
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
            first_name: dto.first_name,
            last_name: dto.last_name,
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

      if (user.type === 'employee') {
        const employee = await this.prisma.employee.findUnique({
          where: {
            email: dto.email,
          },
        });

        if (!employee.is_active)
          throw new NotFoundException('User Has been deactivated');
      }

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

  async generateForgotPasswordToken(dto: ForgotPasswordDto): Promise<string> {
    try {
      const doesUserExist = await this.prisma.auth.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!doesUserExist) throw new NotFoundException('User does not exist');

      const doesTotpExist = await this.prisma.tOTP.findFirst({
        where: {
          user_id: dto.email,
        },
      });

      if (
        (doesTotpExist && doesTotpExist.expired) ||
        (doesTotpExist && doesTotpExist.verified)
      ) {
        await this.prisma.tOTP.delete({
          where: {
            id: doesTotpExist.id,
          },
        });
      } else if (doesTotpExist)
        throw new ForbiddenException('Token already exists');

      const totpSecret = this.config.get('TOTP_SECRET');

      const token = totp.generate(totpSecret);

      const totpDb = await this.prisma.tOTP.create({
        data: {
          token: token,
          user_id: doesUserExist.email,
        },
      });

      this.eventEmitter.emit(
        'totp.generated',
        new TotpGeneratedEvent(dto.email, token),
      );

      setTimeout(async () => {
        const doesItStillExist = await this.prisma.tOTP.findUnique({
          where: {
            id: totpDb.id,
          },
        });

        if (!doesItStillExist) return;

        await this.prisma.tOTP.update({
          where: {
            id: totpDb.id,
          },
          data: {
            expired: true,
          },
        });
      }, 180000);

      return token;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.stack);
    }
  }

  async verifyForgotPasswordToken(dto: VerifyPasswordDto): Promise<boolean> {
    try {
      const doesTotpExist = await this.prisma.tOTP.findFirst({
        where: {
          user_id: dto.email,
          AND: {
            token: dto.token,
          },
        },
      });

      if (!doesTotpExist) throw new NotFoundException('Invalid Token');

      if (doesTotpExist.expired) {
        await this.prisma.tOTP.delete({
          where: {
            id: doesTotpExist.id,
          },
        });

        throw new ForbiddenException('Expired Token');
      }

      if (doesTotpExist.verified)
        throw new ForbiddenException('Token already verified');

      await this.prisma.tOTP.update({
        where: {
          id: doesTotpExist.id,
        },
        data: {
          verified: true,
        },
      });

      return true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.stack);
    }
  }

  async changeForgotPassword(dto: ChangePasswordDto): Promise<boolean> {
    try {
      const isVerifiedTotp = await this.prisma.tOTP.findFirst({
        where: {
          user_id: dto.email,
          AND: {
            verified: true,
          },
        },
      });

      if (!isVerifiedTotp)
        throw new NotFoundException('No verified token found');

      const hash = await argon2.hash(dto.password);

      const [newAuth, deletedToken] = await this.prisma.$transaction([
        this.prisma.auth.update({
          where: {
            email: dto.email,
          },
          data: {
            hash,
          },
        }),
        this.prisma.tOTP.deleteMany({
          where: {
            user_id: dto.email,
          },
        }),
      ]);

      return true;
    } catch (err) {
      throw new InternalServerErrorException(err.stack);
    }
  }

  @OnEvent('totp.generated')
  async sendTotpEmail(event: TotpGeneratedEvent) {
    const { email, token } = event;

    await SendGrid.send(TOTP_MESSAGE(token, email));
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
