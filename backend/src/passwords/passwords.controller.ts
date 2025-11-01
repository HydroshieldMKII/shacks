import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPasswordDto: CreatePasswordDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.create(createPasswordDto, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.findOne(+id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.update(+id, updatePasswordDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.remove(+id, user.id);
  }
}
