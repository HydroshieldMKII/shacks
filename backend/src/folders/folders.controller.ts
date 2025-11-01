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
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    // TODO: Check authentication
    // TODO: Return all folders for current user
    // TODO: Return 401 if not authenticated
    return this.foldersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFolderDto: CreateFolderDto) {
    // TODO: Check authentication
    // TODO: Validate input
    // TODO: Return 401 if not authenticated
    // TODO: Return 400 if validation fails
    return this.foldersService.create(createFolderDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return folder with all passwords
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.foldersService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.foldersService.update(+id, updateFolderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    // TODO: Check authentication
    // TODO: Verify ownership
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if not found or not owned by user
    return this.foldersService.remove(+id);
  }

  @Post(':folderId/passwords/:passwordId')
  @HttpCode(HttpStatus.OK)
  addPasswordToFolder(
    @Param('folderId') folderId: string,
    @Param('passwordId') passwordId: string,
  ) {
    // TODO: Check authentication
    // TODO: Verify ownership of both folder and password
    // TODO: Update password's folderId
    // TODO: Return 401 if not authenticated
    // TODO: Return 404 if folder or password not found or not owned
    return this.foldersService.addPasswordToFolder(+folderId, +passwordId);
  }
}
