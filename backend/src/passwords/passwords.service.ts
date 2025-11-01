import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Password } from './entities/password.entity';
import { EncryptionService } from '../common/services/encryption.service';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createPasswordDto: CreatePasswordDto, userId: number) {
    // Encrypt password using AES (reversible encryption for password manager)
    const encryptedPassword = this.encryptionService.encrypt(
      createPasswordDto.password,
    );

    // Create password entry
    const passwordData: Partial<Password> = {
      userId,
      folderId: createPasswordDto.folderId,
      name: createPasswordDto.name,
      username: createPasswordDto.username,
      password: encryptedPassword,
      url: createPasswordDto.url,
      notes: createPasswordDto.notes,
    };

    const password = this.passwordRepository.create(passwordData);
    const savedPassword = await this.passwordRepository.save(password);

    return savedPassword;
  }

  async findOne(id: number, userId: number) {
    const password = await this.passwordRepository.findOne({
      where: { id },
    });

    if (!password) {
      throw new NotFoundException('Password not found');
    }

    // Check ownership
    if (password.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return password;
  }

  async update(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
    userId: number,
  ) {
    const password = await this.passwordRepository.findOne({
      where: { id },
    });

    if (!password) {
      throw new NotFoundException('Password not found');
    }

    // Check ownership
    if (password.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Update fields
    if (updatePasswordDto.name !== undefined) {
      password.name = updatePasswordDto.name;
    }
    if (updatePasswordDto.username !== undefined) {
      password.username = updatePasswordDto.username;
    }
    if (updatePasswordDto.password !== undefined) {
      // Encrypt new password using AES
      password.password = this.encryptionService.encrypt(
        updatePasswordDto.password,
      );
    }
    if (updatePasswordDto.url !== undefined) {
      password.url = updatePasswordDto.url;
    }
    if (updatePasswordDto.notes !== undefined) {
      password.notes = updatePasswordDto.notes;
    }
    if (updatePasswordDto.folderId !== undefined) {
      password.folderId = updatePasswordDto.folderId;
    }

    const updatedPassword = await this.passwordRepository.save(password);

    return updatedPassword;
  }

  async remove(id: number, userId: number) {
    const password = await this.passwordRepository.findOne({
      where: { id },
    });

    if (!password) {
      throw new NotFoundException('Password not found');
    }

    // Check ownership
    if (password.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.passwordRepository.remove(password);

    return password;
  }
}
