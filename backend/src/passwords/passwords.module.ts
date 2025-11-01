import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';

@Module({
  controllers: [PasswordsController],
  providers: [PasswordsService],
})
export class PasswordsModule {}
