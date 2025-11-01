import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  create(@Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.create(createPasswordDto);
  }

  @Get()
  findAll() {
    return this.passwordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordsService.update(+id, updatePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordsService.remove(+id);
  }
}
