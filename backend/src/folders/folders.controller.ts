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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: { id: number; username: string }) {
    return this.foldersService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createFolderDto: CreateFolderDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.create(createFolderDto, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.findOne(+id, user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.update(+id, updateFolderDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.remove(+id, user.id);
  }

  @Post(':folderId/passwords/:passwordId')
  @HttpCode(HttpStatus.OK)
  addPasswordToFolder(
    @Param('folderId') folderId: string,
    @Param('passwordId') passwordId: string,
    @CurrentUser() user: { id: number; username: string },
  ) {
    return this.foldersService.addPasswordToFolder(
      +folderId,
      +passwordId,
      user.id,
    );
  }
}
