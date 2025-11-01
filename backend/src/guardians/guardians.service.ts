import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { Guardian } from './entities/guardian.entity';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardianRepository: Repository<Guardian>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: number) {
    // Get all guardians where current user is the guardian (protecting others)
    const protecting = await this.guardianRepository
      .createQueryBuilder('guardian')
      .where('guardian.userId = :userId', { userId })
      .getMany();

    // Get all guardians where current user is being protected (need to look up by email)
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User doesnt have an email');
    }

    const protectedBy = await this.guardianRepository
      .createQueryBuilder('guardian')
      .where('guardian.guardedEmail = :email', { email: user.email })
      .getMany();

    return {
      protecting: protecting.map((guardian) => ({
        id: guardian.id,
        userId: guardian.userId,
        guardedEmail: guardian.guardedEmail,
        guardianKeyValue: guardian.guardianKeyValue, // Show key for people you protect
      })),
      protected: protectedBy.map((guardian) => ({
        id: guardian.id,
        userId: guardian.userId,
        guardedEmail: guardian.guardedEmail,
        // Don't include guardianKeyValue for people protecting you
      })),
    };
  }

  generateGuardianKey(): string {
    // Use cryptographically secure random generator
    return crypto.randomBytes(16).toString('hex');
  }

  async create(createGuardianDto: CreateGuardianDto, userEmail: string) {
    // Resolve authenticated user by email
    if (!userEmail) {
      throw new UnauthorizedException('Authenticated user email not available');
    }

    const authUser = await this.usersService.findByEmail(userEmail);
    if (!authUser) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    // Verify guarded user exists
    const guardedUser = await this.usersService.findByEmail(
      createGuardianDto.guardedEmail,
    );
    if (!guardedUser) {
      throw new NotFoundException('Guarded user not found');
    }

    // Generate guardian key
    const guardianKeyValue = this.generateGuardianKey();

    // Create guardian relationship between authUser and guardedUser
    const guardian = this.guardianRepository.create({
      userId: authUser.id,
      guardedEmail: createGuardianDto.guardedEmail,
      guardianKeyValue: guardianKeyValue,
    });

    const savedGuardian = await this.guardianRepository.save(guardian);

    return savedGuardian;
  }

  async remove(id: number, userId: number) {
    const guardian = await this.guardianRepository.findOne({
      where: { id },
    });

    if (!guardian) {
      throw new NotFoundException('Guardian relationship not found');
    }

    // Check authorization - user must be the guardian (only guardians can remove relationships)
    if (guardian.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.guardianRepository.remove(guardian);

    return guardian;
  }
}
