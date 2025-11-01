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
      'Returns two arrays: "protecting" (users you are protecting) and "protected" (users protecting you)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns guardian relationships split by role',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: { id: number; username: string }) {
    return this.guardiansService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new guardian relationship' })
  @ApiResponse({
    status: 201,
    description: 'Guardian relationship created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  create(
    @Body() createGuardianDto: CreateGuardianDto,
    @CurrentUser() user: { email: string },
  ) {
    // Use the authenticated user's email as identifier and the guarded user's email from body
    return this.guardiansService.create(createGuardianDto, user.email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete guardian relationship' })
  @ApiParam({ name: 'id', description: 'Guardian relationship ID' })
  @ApiResponse({
    status: 200,
    description: 'Guardian relationship deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 404, description: 'Guardian relationship not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.guardiansService.remove(+id, user.id);
  }
}
