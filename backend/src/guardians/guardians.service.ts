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
        guardianKeyValue: guardian.guardianKeyValue,
      })),
      protectedBy: protectedBy.map((guardian) => ({
        id: guardian.id,
        userId: guardian.userId,
        guardedEmail: guardian.guardedEmail,
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

    // Verify guardian user exists (the person who will protect the authenticated user)
    const guardianUser = await this.usersService.findByEmail(
      createGuardianDto.email,
    );
    if (!guardianUser) {
      throw new NotFoundException('Guardian user not found');
    }

    // Verify if it is not a duplicate guardian relationship
    const existingGuardian = await this.guardianRepository.findOne({
      where: {
        userId: guardianUser.id,
        guardedEmail: authUser.email,
      },
    });
    if (existingGuardian) {
      throw new BadRequestException(
        'Guardian relationship already exists',
      );
    }

    // Generate guardian key
    const guardianKeyValue = this.generateGuardianKey();

    // Create guardian relationship: guardianUser protects authUser
    const guardian = this.guardianRepository.create({
      userId: guardianUser.id,
      guardedEmail: authUser.email,
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

    // Check authorization - must be the guardian or the guarded user
    const guardedUser = await this.usersService.findByEmail(
      guardian.guardedEmail,
    );

    if (guardian.userId !== userId && guardedUser?.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to remove this guardian relationship',
      );
    }

    await this.guardianRepository.remove(guardian);

    return guardian;
  }

  async recoverAccount(
    email: string,
    guardianKey1: string,
    guardianKey2: string,
    newPassword: string,
  ) {

    console.log('Starting account recovery process for email:', email);
    console.log('Using guardian keys:', guardianKey1, guardianKey2);
    console.log('New password provided:', newPassword);

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all guardians for this user
    const guardians = await this.guardianRepository
      .createQueryBuilder('guardian')
      .where('guardian.guardedEmail = :email', { email })
      .getMany();

    //print all guardians table
    console.log('All guardian in table:', await this.guardianRepository.find());

    if (guardians.length < 2) {
      throw new BadRequestException(
        'Account recovery requires at least 2 guardians',
      );
    }

    // Verify that both keys are valid and belong to different guardians
    const validGuardians = guardians.filter(
      (g) => g.guardianKeyValue === guardianKey1 || g.guardianKeyValue === guardianKey2,
    );

    if (validGuardians.length < 2) {
      throw new UnauthorizedException('Invalid guardian keys provided');
    }

    // Update user password
    await this.usersService.resetPassword(user.id, newPassword);

    return {
      message: 'Account recovered successfully',
      email: user.email,
      username: user.username,
    };
  }
}
