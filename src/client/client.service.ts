import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, Company } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async addClient(admin: User & { ownedCompany: Company }, dto: ClientDto) {
    const client = await this.prisma.client.create({
      data: {
        store_name: dto.store_name,
        phone_number: dto.phone_number,
        address: dto.address,
        lat: dto.lat,
        long: dto.long,
        company_id: admin.company_id,
      },
    });

    return client;
  }

  async getClients(user: User & { ownedCompany: Company }) {
    console.log(user);

    const clients = await this.prisma.client.findMany({
      where: {
        company_id: user.company_id,
      },
    });

    return clients;
  }
}
