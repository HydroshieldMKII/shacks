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

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPasswordDto: CreatePasswordDto) {
    // TODO: Check authentication
    // TODO: Validate input
    // TODO: Return 401 if not authenticated
    // TODO: Return 400 if validation fails
    return this.passwordsService.create(createPasswordDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.passwordsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.passwordsService.update(+id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.passwordsService.remove(+id);
  }
}
