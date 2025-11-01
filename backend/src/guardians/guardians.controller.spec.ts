import { Test, TestingModule } from '@nestjs/testing';
import { GuardiansController } from './guardians.controller';
import { GuardiansService } from './guardians.service';

describe('GuardiansController', () => {
  let controller: GuardiansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardiansController],
      providers: [GuardiansService],
    }).compile();

    controller = module.get<GuardiansController>(GuardiansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
