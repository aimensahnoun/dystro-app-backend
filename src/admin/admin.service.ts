import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async updateAdmin(dto: AdminDto, admin: Admin) {
    if (admin.type !== 'admin')
      return new UnauthorizedException('You are not an admin');

    return await this.prisma.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        is_profile_complete: this.isProfileComplete(dto),
      },
    });
  }

  async getAdmin(admin: Admin, id: string) {
    return await this.prisma.admin.findUnique({
      where: {
        id,
      },
    });
  }

  async getMe(admin: Admin) {
    console.log(admin);
  }

  isProfileComplete(dto: AdminDto): boolean {
    return dto.email !== '' && dto.first_name !== '' && dto.last_name !== '';
  }
}
