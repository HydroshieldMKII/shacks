import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: { id: number; username: string }) {
    // Authentication is handled by AuthGuard
    return this.guardiansService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createGuardianDto: CreateGuardianDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.guardiansService.create(createGuardianDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.guardiansService.remove(+id, user.id);
  }
}
