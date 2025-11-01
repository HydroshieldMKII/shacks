import { Module } from '@nestjs/common';
import { GuardiansService } from './guardians.service';
import { GuardiansController } from './guardians.controller';

@Module({
  controllers: [GuardiansController],
  providers: [GuardiansService],
})
export class GuardiansModule {}
