import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';
import { Password } from './entities/password.entity';
import { EncryptionService } from '../common/services/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([Password])],
  controllers: [PasswordsController],
  providers: [PasswordsService, EncryptionService],
})
export class PasswordsModule {}
