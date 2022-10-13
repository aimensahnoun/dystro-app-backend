import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Admin, Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async addClient(admin: Admin & { company: Company }, dto: ClientDto) {
    if (admin.type !== 'admin')
      throw new UnauthorizedException('You are not an admin');

    const client = await this.prisma.client.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        store_name: dto.store_name,
        phone_number: dto.phone_number,
        address: dto.address,
        lat: dto.lat,
        long: dto.long,
        company_id: admin.company.id,
      },
    });

    return client;
  }

  async getClients(admin: Admin & { company: Company }) {
    if (admin.type !== 'admin')
      throw new UnauthorizedException('You are not an admin');

    const clients = await this.prisma.client.findMany({
      where: {
        company_id: admin.company.id,
      },
    });

    return clients;
  }
}
