import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  getCurrentUser() {
    // TODO: Get current user from session/token
    // TODO: Return 401 if not authenticated
    return this.usersService.getCurrentUser();
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: { username: string; password: string }) {
    // TODO: Validate credentials
    // TODO: Return 401 if invalid
    return this.usersService.login(loginDto);
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto) {
    // TODO: Validate input
    // TODO: Return 400 if validation fails
    return this.usersService.signup(createUserDto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    // TODO: Clear session/token
    // TODO: Return 401 if not authenticated
    return this.usersService.logout();
  }
}
