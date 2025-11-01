import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { Folder } from './entities/folder.entity';
import { Password } from '../passwords/entities/password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, Password])],
  controllers: [FoldersController],
  providers: [FoldersService],
})
export class FoldersModule {}
