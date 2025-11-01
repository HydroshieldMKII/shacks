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

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardianRepository: Repository<Guardian>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: number) {
    // Get all guardians where userId is either the guardian or the guarded user
    const guardians = await this.guardianRepository
      .createQueryBuilder('guardian')
      .where('guardian.userId = :userId', { userId })
      .orWhere('guardian.guardedUserId = :userId', { userId })
      .getMany();

    return guardians;
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

    // Resolve guarded user by email provided in body
    const guardedUser = await this.usersService.findByEmail(
      createGuardianDto.guardedUserEmail,
    );
    if (!guardedUser) {
      throw new NotFoundException('Guarded user not found');
    }

    // Prevent self-guardian relationships
    if (authUser.id === guardedUser.id) {
      throw new BadRequestException(
        'Cannot create a guardian relationship with yourself',
      );
    }

    // Validate that guardianKeyValue is provided
    if (!createGuardianDto.guardianKeyValue) {
      throw new BadRequestException('Guardian key value is required');
    }

    // Create guardian relationship between authUser and guardedUser
    const guardian = this.guardianRepository.create({
      guardedUserId: guardedUser.id,
      userId: authUser.id,
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
