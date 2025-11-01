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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('folders')
@ApiCookieAuth()
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new folder',
    description: 'Create a new folder to organize password entries',
  })
  @ApiBody({ type: CreateFolderDto })
  @ApiResponse({
    status: 201,
    description: 'Folder created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Work Accounts' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createFolderDto: CreateFolderDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.create(createFolderDto, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update folder',
    description: 'Update folder name',
  })
  @ApiParam({
    name: 'id',
    description: 'Folder ID',
    example: 1,
    type: 'number',
  })
  @ApiBody({ type: UpdateFolderDto })
  @ApiResponse({
    status: 200,
    description: 'Folder updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        userId: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Updated Folder Name' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your folder' })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Folder does not exist',
  })
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.update(+id, updateFolderDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete folder',
    description: 'Delete folder and all associated passwords (CASCADE delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'Folder ID',
    example: 1,
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Folder and associated passwords deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Folder deleted successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your folder' })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Folder does not exist',
  })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.remove(+id, user.id);
  }
}
