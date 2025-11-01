import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Session,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@CurrentUser() user: { id: number; username: string }) {
    return user;
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
  ) {
    const result = await this.usersService.login(loginDto);

    // Set session data
    session.userId = result.user.id;
    session.username = result.user.username;
    session.userPassword = loginDto.password; // Store password for encryption/decryption

    return result;
  }

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const result = await this.usersService.signup(createUserDto);

    // Set session data
    session.userId = result.user.id;
    session.username = result.user.username;
    session.userPassword = createUserDto.password; // Store password for encryption/decryption

    return result;
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }
}
