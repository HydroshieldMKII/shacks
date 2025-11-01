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
  ApiBody,
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
  @ApiOperation({
    summary: 'Get all passwords grouped by folders',
    description:
      'Returns an array of folders, each containing an array of password entries. Passwords remain encrypted.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of folders with encrypted password entries',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: true, example: 1 },
          name: { type: 'string', example: 'Work Accounts' },
          userId: { type: 'number', example: 1 },
          passwords: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                folderId: { type: 'number', nullable: true, example: 1 },
                name: { type: 'string', example: 'Gmail Account' },
                username: { type: 'string', example: 'john@example.com' },
                password: {
                  type: 'string',
                  example: 'U2FsdGVkX1+encrypted...',
                },
                url: {
                  type: 'string',
                  nullable: true,
                  example: 'https://mail.google.com',
                },
                notes: {
                  type: 'string',
                  nullable: true,
                  example: 'Recovery email: backup@example.com',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { id: number; username: string }) {
    return this.passwordsService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new password entry',
    description:
      'Create a new password entry. Password will be encrypted. Returns the unencrypted password in response.',
  })
  @ApiBody({ type: CreatePasswordDto })
  @ApiResponse({
    status: 201,
    description: 'Password entry created successfully (returns unencrypted)',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        folderId: { type: 'number', nullable: true, example: 1 },
        name: { type: 'string', example: 'Gmail Account' },
        username: { type: 'string', example: 'john@example.com' },
        password: {
          type: 'string',
          example: 'MySecretPassword123!',
          description: 'Unencrypted password (only returned on creation)',
        },
        url: {
          type: 'string',
          nullable: true,
          example: 'https://mail.google.com',
        },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Recovery email: backup@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error or folder not found',
  })
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
  @ApiOperation({
    summary: 'Get password entry by ID (decrypted)',
    description:
      'Retrieve a single password entry with decrypted password value',
  })
  @ApiParam({
    name: 'id',
    description: 'Password entry ID',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Password entry with decrypted password',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        folderId: { type: 'number', nullable: true, example: 1 },
        name: { type: 'string', example: 'Gmail Account' },
        username: { type: 'string', example: 'john@example.com' },
        password: {
          type: 'string',
          example: 'MySecretPassword123!',
          description: 'Decrypted password',
        },
        url: {
          type: 'string',
          nullable: true,
          example: 'https://mail.google.com',
        },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Recovery email: backup@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Password does not belong to you',
  })
  @ApiResponse({ status: 404, description: 'Not Found - Password not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
    @Session() session: Record<string, any>,
  ) {
    return this.passwordsService.findOne(+id, user.id, session.userPassword);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update password entry',
    description:
      'Update password entry fields. Password will be re-encrypted if changed.',
  })
  @ApiParam({
    name: 'id',
    description: 'Password entry ID',
    example: 1,
    type: 'number',
  })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password entry updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        folderId: { type: 'number', nullable: true, example: 1 },
        name: { type: 'string', example: 'Gmail Account' },
        username: { type: 'string', example: 'john@example.com' },
        password: {
          type: 'string',
          example: 'U2FsdGVkX1+encrypted...',
          description: 'Encrypted password',
        },
        url: {
          type: 'string',
          nullable: true,
          example: 'https://mail.google.com',
        },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Recovery email: backup@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Password does not belong to you',
  })
  @ApiResponse({ status: 404, description: 'Not Found - Password not found' })
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
  @ApiOperation({
    summary: 'Delete password entry',
    description: 'Permanently delete a password entry',
  })
  @ApiParam({
    name: 'id',
    description: 'Password entry ID',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Password entry deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password deleted successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Password does not belong to you',
  })
  @ApiResponse({ status: 404, description: 'Not Found - Password not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.passwordsService.remove(+id, user.id);
  }
}
