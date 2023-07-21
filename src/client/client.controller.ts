import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { User, Company } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';

@UseGuards(JWTGuard)
@Controller('client')
export class ClientController {
  private logger: Logger;
  constructor(private clientService: ClientService) {
    this.logger = new Logger('ClientController');
  }

  @Post()
  addClient(
    @GetUser() admin: User & { company: Company },
    @Body() dto: ClientDto,
  ) {
    this.logger.log(`Admin ${admin.id} is adding a new client`);
    this.logger.log(dto);
    return this.clientService.addClient(admin, dto);
  }

  @Get()
  getClients(@GetUser() admin: User & { company: Company }) {
    this.logger.log(`Admin ${admin.id} is getting all clients`);
    return this.clientService.getClients(admin);
  }
}
