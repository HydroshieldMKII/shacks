import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardiansService } from './guardians.service';
import { GuardiansController } from './guardians.controller';
import { Guardian } from './entities/guardian.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guardian])],
  controllers: [GuardiansController],
  providers: [GuardiansService],
})
export class GuardiansModule {}
