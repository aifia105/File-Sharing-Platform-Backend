import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GrantService } from './grant.service';
import { CreateGrantDto } from './dto/create-grant.dto';
import { UpdateGrantDto } from './dto/update-grant.dto';

@Controller('grant')
export class GrantController {
  constructor(private readonly grantService: GrantService) {}

  @Post()
  create(@Body() createGrantDto: CreateGrantDto) {
    return this.grantService.create(createGrantDto);
  }

  @Get()
  findAll() {
    return this.grantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrantDto: UpdateGrantDto) {
    return this.grantService.update(+id, updateGrantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grantService.remove(+id);
  }
}
