import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  VerifyPasswordDto,
} from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Auth } from '@prisma/client';
import { AdminRegisterDto } from 'src/admin/dto/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  @Post('register')
  register(
    @Body() dto: AdminRegisterDto,
  ): Promise<{ user: Auth; token: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto): Promise<{ user: Auth; token: string }> {
    return this.authService.login(dto);
  }

  @Post('forgot/token')
  @HttpCode(HttpStatus.OK)
  generatePasswordResetToken(@Body() dto: ForgotPasswordDto) {
    return this.authService.generateForgotPasswordToken(dto);
  }

  @Post('forgot/verifyToken')
  @HttpCode(HttpStatus.OK)
  checkPasswordResetToken(@Body() dto: VerifyPasswordDto) {
    return this.authService.verifyForgotPasswordToken(dto);
  }

  @Put('forgot/password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changeForgotPassword(dto);
  }
}
