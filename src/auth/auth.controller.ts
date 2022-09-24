import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import { Auth } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: AuthDto): Promise<{ user: Auth; token: string }> {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto): Promise<{ user: Auth; token: string }> {
    return this.authService.login(dto);
  }
}
