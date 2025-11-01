import { Test, TestingModule } from '@nestjs/testing';
import { GuardiansService } from './guardians.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Guardian } from './entities/guardian.entity';
import { UsersService } from '../users/users.service';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

describe('GuardiansService', () => {
  let service: GuardiansService;
  let mockGuardianRepository: any;
  let mockUsersService: any;

  beforeEach(async () => {
    mockGuardianRepository = {
      createQueryBuilder: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuardiansService,
        {
          provide: getRepositoryToken(Guardian),
          useValue: mockGuardianRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<GuardiansService>(GuardiansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recoverAccount', () => {
    it('should successfully recover account with 2 valid guardian keys', async () => {
      const email = 'user@example.com';
      const key1 = 'key1234567890abcdef';
      const key2 = 'keyabcdef1234567890';
      const newPassword = 'NewSecurePassword123!';

      const mockUser = {
        id: 1,
        email,
        username: 'testuser',
        password: 'oldHashedPassword',
      };

      const mockGuardians = [
        { id: 1, userId: 2, guardedEmail: email, guardianKeyValue: key1 },
        { id: 2, userId: 3, guardedEmail: email, guardianKeyValue: key2 },
      ];

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockGuardianRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockGuardians),
      });
      mockUsersService.resetPassword.mockResolvedValue(undefined);

      const result = await service.recoverAccount(
        email,
        key1,
        key2,
        newPassword,
      );

      expect(result).toEqual({
        message: 'Account recovered successfully',
        email: mockUser.email,
        username: mockUser.username,
      });
      expect(mockUsersService.resetPassword).toHaveBeenCalledWith(
        mockUser.id,
        newPassword,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.recoverAccount(
          'nonexistent@example.com',
          'key1',
          'key2',
          'newPassword',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if less than 2 guardians exist', async () => {
      const email = 'user@example.com';
      const mockUser = { id: 1, email, username: 'testuser' };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockGuardianRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]), // Only 1 guardian
      });

      await expect(
        service.recoverAccount(email, 'key1', 'key2', 'newPassword'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if guardian keys are invalid', async () => {
      const email = 'user@example.com';
      const mockUser = { id: 1, email, username: 'testuser' };
      const mockGuardians = [
        {
          id: 1,
          userId: 2,
          guardedEmail: email,
          guardianKeyValue: 'validKey1',
        },
        {
          id: 2,
          userId: 3,
          guardedEmail: email,
          guardianKeyValue: 'validKey2',
        },
      ];

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockGuardianRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockGuardians),
      });

      await expect(
        service.recoverAccount(email, 'invalidKey1', 'invalidKey2', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if both keys are the same', async () => {
      const email = 'user@example.com';
      const sameKey = 'sameKey123';
      const mockUser = { id: 1, email, username: 'testuser' };
      const mockGuardians = [
        { id: 1, userId: 2, guardedEmail: email, guardianKeyValue: sameKey },
        { id: 2, userId: 3, guardedEmail: email, guardianKeyValue: 'key2' },
      ];

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockGuardianRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockGuardians),
      });

      await expect(
        service.recoverAccount(email, sameKey, sameKey, 'newPassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
