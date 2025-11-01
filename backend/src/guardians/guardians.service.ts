import { Injectable } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardiansService {
  findAll(userId: number) {
    // TODO: Get all guardians where userId matches (either as guardian or guarded user)
    // TODO: Return from database
    return [
      {
        id: 1,
        guardedUserId: 2,
        userId: userId,
        guardianKeyValue: 'unique_key_123',
      },
      {
        id: 2,
        guardedUserId: 3,
        userId: userId,
        guardianKeyValue: 'unique_key_456',
      },
    ];
  }

  create(createGuardianDto: CreateGuardianDto, userId: number) {
    // TODO: Validate that userId matches one of the users in the relationship
    // TODO: Generate or validate guardianKeyValue
    // TODO: Create guardian in database
    // TODO: Throw BadRequestException if validation fails
    return {
      id: 3,
      guardedUserId: createGuardianDto.guardedUserId,
      userId: createGuardianDto.userId,
      guardianKeyValue: createGuardianDto.guardianKeyValue,
    };
  }

  remove(id: number, userId: number) {
    // TODO: Check authorization - user must be either guardian or guarded user
    // TODO: Delete guardian from database
    // TODO: Throw NotFoundException if not found or not authorized
    return {
      id: id,
      guardedUserId: 2,
      userId: userId,
      guardianKeyValue: 'unique_key_123',
    };
  }
}
