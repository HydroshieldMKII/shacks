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
  Session,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PasswordsService } from './passwords.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('passwords')
@ApiCookieAuth()
@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all password entries for current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of password entries (encrypted)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { id: number; username: string }) {
    return this.passwordsService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new password entry' })
  @ApiResponse({
    status: 201,
    description: 'Password entry created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createPasswordDto: CreatePasswordDto,
    @CurrentUser() user: { id: number; username: string },
    @Session() session: Record<string, any>,
  ) {
    return this.passwordsService.create(
      createPasswordDto,
      user.id,
      session.userPassword,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get password entry by ID (decrypted)' })
  @ApiParam({ name: 'id', description: 'Password entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns decrypted password entry',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Password not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
    @Session() session: Record<string, any>,
  ) {
    return this.passwordsService.findOne(+id, user.id, session.userPassword);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update password entry' })
  @ApiParam({ name: 'id', description: 'Password entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Password entry updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Password not found' })
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: { id: number; username: string },
    @Session() session: Record<string, any>,
  ) {
    return this.passwordsService.update(
      +id,
      updatePasswordDto,
      user.id,
      session.userPassword,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete password entry' })
  @ApiParam({ name: 'id', description: 'Password entry ID' })
  @ApiResponse({
    status: 200,
    description: 'Password entry deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Password not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.remove(+id, user.id);
  }
}
