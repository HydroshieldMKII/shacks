import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { Guardian } from './entities/guardian.entity';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardianRepository: Repository<Guardian>,
  ) {}

  async findAll(userId: number) {
    // Get all guardians where userId is either the guardian or the guarded user
    const guardians = await this.guardianRepository
      .createQueryBuilder('guardian')
      .where('guardian.userId = :userId', { userId })
      .orWhere('guardian.guardedUserId = :userId', { userId })
      .getMany();

    // Split into two categories
    const protecting = guardians
      .filter((guardian) => guardian.userId === userId)
      .map((guardian) => ({
        id: guardian.id,
        userId: guardian.userId,
        guardedEmail: guardian.email,
        guardianKeyValue: guardian.guardianKeyValue, // Show key for people you protect
      }));

    const protectedBy = guardians
      .filter((guardian) => guardian.guardedUserId === userId)
      .map((guardian) => ({
        id: guardian.id,
        userId: guardian.userId,
        guardedEmail: guardian.email,
        // Don't include guardianKeyValue for people protecting you
      }));

    return {
      protecting: protecting, // Users that the current user is protecting (with keys)
      protected: protectedBy, // Users that are protecting the current user (without keys)
    };
  }

  async generateGuardianKey(): Promise<string> {
    return Math.random().toString(36).substring(2, 15);
  }

  async create(createGuardianDto: CreateGuardianDto, userId: number) {
    // Validate that the authenticated userId matches one of the users in the relationship
    if (
      createGuardianDto.userId !== userId &&
      createGuardianDto.guardedUserId !== userId
    ) {
      throw new ForbiddenException(
        'You can only create guardian relationships involving yourself',
      );
    }

    //Check if guarded is myself
    if (userId === createGuardianDto.guardedEmail) {
      throw new BadRequestException('You cannot be your own guardian');
    }

    // TODO generate key here
    createGuardianDto.guardianKeyValue = this.generateGuardianKey();

    // Create guardian relationship
    const guardian = this.guardianRepository.create({
      guardedUserId: createGuardianDto.guardedUserId,
      userId: createGuardianDto.userId,
      guardianKeyValue: createGuardianDto.guardianKeyValue,
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

    // Check authorization - user must be either the guardian or the guarded user
    if (guardian.userId !== userId && guardian.guardedUserId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.guardianRepository.remove(guardian);

    return guardian;
  }
}
