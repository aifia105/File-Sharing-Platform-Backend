import { Injectable } from '@nestjs/common';
import { CreateGrantDto } from './dto/create-grant.dto';
import { UpdateGrantDto } from './dto/update-grant.dto';

@Injectable()
export class GrantService {
  create(createGrantDto: CreateGrantDto) {
    return 'This action adds a new grant';
  }

  findAll() {
    return `This action returns all grant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grant`;
  }

  update(id: number, updateGrantDto: UpdateGrantDto) {
    return `This action updates a #${id} grant`;
  }

  remove(id: number) {
    return `This action removes a #${id} grant`;
  }
}
