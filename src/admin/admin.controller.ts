import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { AdminService } from './admin.service';
import { AdminDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(JWTGuard)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Put()
  updateAdmin(@Body() dto: AdminDto, @GetUser() admin: Admin) {
    return this.admin.updateAdmin(dto, admin);
  }
}
