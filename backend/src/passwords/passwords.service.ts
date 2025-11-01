import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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

  async create(
    createPasswordDto: CreatePasswordDto,
    userId: number,
    userPassword: string,
  ) {
    if (!userPassword) {
      throw new BadRequestException(
        'User password required for encryption',
      );
    }

    // Encrypt password using AES with user's password + master key
    const encryptedPassword = this.encryptionService.encrypt(
      createPasswordDto.password,
      userPassword,
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

  async findAll(userId: number) {
    const passwords = await this.passwordRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });

    return passwords;
  }

  async findOne(id: number, userId: number, userPassword?: string) {
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

    // Decrypt password if userPassword is provided
    if (userPassword) {
      const decryptedPassword = this.encryptionService.decrypt(
        password.password,
        userPassword,
      );
      return { ...password, password: decryptedPassword };
    }

    return password;
  }

  async update(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
    userId: number,
    userPassword?: string,
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
      // Encrypt new password using AES with user's password
      if (!userPassword) {
        throw new BadRequestException(
          'User password required for encryption',
        );
      }
      password.password = this.encryptionService.encrypt(
        updatePasswordDto.password,
        userPassword,
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
