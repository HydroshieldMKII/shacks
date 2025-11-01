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

  async findOne(id: number, userId: number) {
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

    // Get all passwords in this folder
    const passwords = await this.passwordRepository.find({
      where: { folderId: id, userId: userId },
    });

    return {
      ...folder,
      passwords,
    };
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

  async addPasswordToFolder(
    folderId: number,
    passwordId: number,
    userId: number,
  ) {
    // Check folder exists and user owns it
    const folder = await this.folderRepository.findOne({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.userId !== userId) {
      throw new ForbiddenException('Access denied to folder');
    }

    // Check password exists and user owns it
    const password = await this.passwordRepository.findOne({
      where: { id: passwordId },
    });

    if (!password) {
      throw new NotFoundException('Password not found');
    }

    if (password.userId !== userId) {
      throw new ForbiddenException('Access denied to password');
    }

    // Update password's folderId
    password.folderId = folderId;
    const updatedPassword = await this.passwordRepository.save(password);

    return updatedPassword;
  }
}
