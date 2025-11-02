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
import { Folder } from '../folders/entities/folder.entity';
import { EncryptionService } from '../common/services/encryption.service';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(
    createPasswordDto: CreatePasswordDto,
    userId: number,
    userPassword: string,
  ) {
    if (!userPassword) {
      throw new BadRequestException('User password required for encryption');
    }

    // Validate folderId if provided
    let folderId: number | null = null;
    
    if (createPasswordDto.folderId !== undefined && createPasswordDto.folderId !== null) {
      // Check if folder exists and belongs to the user
      const folder = await this.folderRepository.findOne({
        where: { id: createPasswordDto.folderId, userId },
      });

      if (!folder) {
        throw new BadRequestException(
          `Folder with ID ${createPasswordDto.folderId} not found or does not belong to you`,
        );
      }
      
      folderId = createPasswordDto.folderId;
    }

    // Store the original password before encryption
    const originalPassword = createPasswordDto.password;

    // Encrypt password using AES with user's password + master key
    const encryptedPassword = this.encryptionService.encrypt(
      createPasswordDto.password,
      userPassword,
    );

    // Create password entry
    const passwordData: Partial<Password> = {
      userId,
      folderId: folderId,
      name: createPasswordDto.name,
      username: createPasswordDto.username,
      password: encryptedPassword,
      url: createPasswordDto.url,
      notes: createPasswordDto.notes,
    };

    const password = this.passwordRepository.create(passwordData);
    const savedPassword = await this.passwordRepository.save(password);

    // Return the saved password with the original unencrypted password
    return {
      ...savedPassword,
      password: originalPassword,
    };
  }

  async findAll(userId: number) {
    // Get all folders for the user
    const folders = await this.folderRepository.find({
      where: { userId },
      order: { id: 'ASC' },
    });

    // Get all passwords for the user
    const passwords = await this.passwordRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });

    // Group passwords by folderId using a Map for O(n) complexity
    const passwordsByFolder = new Map<number | null, Password[]>();
    passwords.forEach((password) => {
      const folderId = password.folderId;
      if (!passwordsByFolder.has(folderId)) {
        passwordsByFolder.set(folderId, []);
      }
      passwordsByFolder.get(folderId)!.push(password);
    });

    // Build folders with their passwords
    const foldersWithPasswords: Array<{
      id: number | null;
      name: string;
      userId: number;
      passwords: Password[];
    }> = folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      userId: folder.userId,
      passwords: passwordsByFolder.get(folder.id) || [],
    }));

    // Add a special folder for passwords without a folder (folderId is null)
    const passwordsWithoutFolder = passwordsByFolder.get(null) || [];

    if (passwordsWithoutFolder.length > 0) {
      foldersWithPasswords.unshift({
        id: null,
        name: 'Uncategorized',
        userId: userId,
        passwords: passwordsWithoutFolder,
      });
    }

    return foldersWithPasswords;
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
        throw new BadRequestException('User password required for encryption');
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
    
    // Store the old folderId before updating
    const oldFolderId = password.folderId;
    
    if (updatePasswordDto.folderId !== undefined) {
      // Validate folderId if provided (not null or undefined)
      if (updatePasswordDto.folderId !== null) {
        const folder = await this.folderRepository.findOne({
          where: { id: updatePasswordDto.folderId, userId },
        });

        if (!folder) {
          throw new BadRequestException(
            `Folder with ID ${updatePasswordDto.folderId} not found or does not belong to you`,
          );
        }
        
        password.folderId = updatePasswordDto.folderId;
      } else {
        // Explicitly setting to null (uncategorized)
        password.folderId = null;
      }
    }

    const updatedPassword = await this.passwordRepository.save(password);

    //check if it was the last password in the previous folder, if so, delete the folder as well
    if (updatePasswordDto.folderId !== undefined && oldFolderId) {
      const remainingPasswords = await this.passwordRepository.find({
        where: { folderId: oldFolderId },
      });

      if (remainingPasswords.length === 0) {
        const folder = await this.folderRepository.findOne({
          where: { id: oldFolderId },
        });
        if (folder) {
          await this.folderRepository.remove(folder);
        }
      }
    }

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

    //check if it was the last password in the folder, if so, delete the folder as well
    if (password.folderId) {
      const remainingPasswords = await this.passwordRepository.find({
        where: { folderId: password.folderId },
      });

      if (remainingPasswords.length === 0) {
        const folder = await this.folderRepository.findOne({
          where: { id: password.folderId },
        });
        if (folder) {
          await this.folderRepository.remove(folder);
        }
      }
    }

    return password;
  }
}
