import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  create(@Body() createGuardianDto: CreateGuardianDto) {
    return this.guardiansService.create(createGuardianDto);
  }

  @Get()
  findAll() {
    return this.guardiansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guardiansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuardianDto: UpdateGuardianDto) {
    return this.guardiansService.update(+id, updateGuardianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guardiansService.remove(+id);
  }
}
