import { Injectable } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardiansService {
  findAll() {
    // TODO: Validate authentication
    // TODO: Get current user from session/token
    // TODO: Return all guardians for current user
    // TODO: Throw UnauthorizedException if not authenticated
    return [
      {
        id: 1,
        guardedUserId: 2,
        userId: 1,
        guardianKeyValue: 'unique_key_123',
      },
      {
        id: 2,
        guardedUserId: 3,
        userId: 1,
        guardianKeyValue: 'unique_key_456',
      },
    ];
  }

  create(createGuardianDto: CreateGuardianDto) {
    // TODO: Validate authentication
    // TODO: Validate input
    // TODO: Generate or validate guardianKeyValue
    // TODO: Create guardian in database
    // TODO: Throw UnauthorizedException if not authenticated
    // TODO: Throw BadRequestException if validation fails
    return {
      id: 3,
      guardedUserId: createGuardianDto.guardedUserId,
      userId: createGuardianDto.userId,
      guardianKeyValue: createGuardianDto.guardianKeyValue,
    };
  }

  remove(id: number) {
    // TODO: Validate authentication
    // TODO: Check authorization (must be guardian or guarded user)
    // TODO: Delete guardian from database
    // TODO: Throw UnauthorizedException if not authenticated
    // TODO: Throw NotFoundException if not found or not authorized
    return {
      id: id,
      guardedUserId: 2,
      userId: 1,
      guardianKeyValue: 'unique_key_123',
    };
  }
}
