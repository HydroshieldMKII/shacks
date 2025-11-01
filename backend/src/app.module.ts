import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GuardiansModule } from './guardians/guardians.module';
import { PasswordsModule } from './passwords/passwords.module';
import { FoldersModule } from './folders/folders.module';
import { AuthGuard } from './common/guards/auth.guard';

// Entities
import { User } from './users/entities/user.entity';
import { Guardian } from './guardians/entities/guardian.entity';
import { Password } from './passwords/entities/password.entity';
import { Folder } from './folders/entities/folder.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Guardian, Password, Folder],
      synchronize: true,
    }),
    UsersModule,
    GuardiansModule,
    PasswordsModule,
    FoldersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
