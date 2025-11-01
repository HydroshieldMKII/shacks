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
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    // TODO: Check authentication
    // TODO: Return all guardians for current user
    // TODO: Return 401 if not authenticated
    return this.guardiansService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGuardianDto: CreateGuardianDto) {
    // TODO: Check authentication
    // TODO: Validate input
    // TODO: Return 401 if not authenticated
    // TODO: Return 400 if validation fails
    return this.guardiansService.create(createGuardianDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    // TODO: Check authentication
    // TODO: Verify authorization (must be guardian or guarded user)
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not authorized
    return this.guardiansService.remove(+id);
  }
}
