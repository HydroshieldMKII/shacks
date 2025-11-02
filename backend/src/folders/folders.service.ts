import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities/folder.entity';
import { Password } from '../passwords/entities/password.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
  ) {}

  async findAll(userId: number) {
    // Get all folders for the specified userId
    const folders = await this.folderRepository.find({
      where: { userId },
    });

    return folders;
  }

  async create(createFolderDto: CreateFolderDto, userId: number) {
    // Create folder associated with userId
    const folder = this.folderRepository.create({
      name: createFolderDto.name,
      userId: userId,
    });

    const savedFolder = await this.folderRepository.save(folder);

    return savedFolder;
  }

  async update(id: number, updateFolderDto: UpdateFolderDto, userId: number) {
    const folder = await this.folderRepository.findOne({
      where: { id },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // Check ownership
    if (folder.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Update folder
    if (updateFolderDto.name !== undefined) {
      folder.name = updateFolderDto.name;
    }

    const updatedFolder = await this.folderRepository.save(folder);

    return updatedFolder;
  }

  async remove(id: number, userId: number) {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['passwords'], // Load related passwords
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // Check ownership
    if (folder.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Delete folder - passwords will be automatically deleted due to CASCADE
    await this.folderRepository.remove(folder);

    return folder;
  }
}
