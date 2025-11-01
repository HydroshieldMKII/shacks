import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsController } from './passwords.controller';
import { PasswordsService } from './passwords.service';

describe('PasswordsController', () => {
  let controller: PasswordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordsController],
      providers: [PasswordsService],
    }).compile();

    controller = module.get<PasswordsController>(PasswordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
