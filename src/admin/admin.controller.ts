import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JWTGuard)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Put()
  updateAdmin(@Body() dto: AdminDto, @GetUser() admin: User) {
    return this.admin.updateAdmin(dto, admin);
  }

  @Get('me')
  getMe(@GetUser() admin: User) {
    return admin;
  }

  @Get(':id')
  getAdmin(@GetUser() admin: User, @Param('id') id: string) {
    return this.admin.getAdmin(admin, id);
  }
}
