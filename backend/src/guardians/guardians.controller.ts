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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('guardians')
@ApiCookieAuth()
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all guardian relationships',
    description:
      'Returns guardian relationships split into two categories: users you are protecting (with keys) and users protecting you (without keys)',
  })
  @ApiResponse({
    status: 200,
    description: 'Guardian relationships grouped by role',
    schema: {
      type: 'object',
      properties: {
        protecting: {
          type: 'array',
          description: 'Users you are protecting (includes guardian keys)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              userId: { type: 'number', example: 1 },
              guardedEmail: {
                type: 'string',
                example: 'protected@example.com',
              },
              guardianKeyValue: {
                type: 'string',
                example: 'a1b2c3d4e5f6...',
              },
            },
          },
        },
        protected: {
          type: 'array',
          description:
            'Users protecting you (guardian keys hidden for security)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              userId: { type: 'number', example: 3 },
              guardedEmail: {
                type: 'string',
                example: 'your@example.com',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { id: number; username: string }) {
    return this.guardiansService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new guardian relationship',
    description:
      'Establish a guardian relationship to protect another user. A guardian key will be automatically generated.',
  })
  @ApiBody({ type: CreateGuardianDto })
  @ApiResponse({
    status: 201,
    description: 'Guardian relationship created with auto-generated key',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        guardedEmail: { type: 'string', example: 'protected@example.com' },
        guardianKeyValue: {
          type: 'string',
          example: 'a1b2c3d4e5f67890abcdef...',
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
    status: 404,
    description: 'Not Found - Guarded user does not exist',
  })
  create(
    @Body() createGuardianDto: CreateGuardianDto,
    @CurrentUser() user: { email: string },
  ) {
    // Use the authenticated user's email as identifier and the guarded user's email from body
    return this.guardiansService.create(createGuardianDto, user.email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete guardian relationship',
    description: 'Remove a guardian relationship. This action is irreversible.',
  })
  @ApiParam({
    name: 'id',
    description: 'Guardian relationship ID',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Guardian relationship deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Guardian relationship deleted successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not your guardian relationship',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Guardian relationship does not exist',
  })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.guardiansService.remove(+id, user.id);
  }
}
