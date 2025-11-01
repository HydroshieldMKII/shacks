import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  login(loginDto: { username: string; password: string }) {
    // TODO: Validate username and password against database
    // TODO: Check password hash
    // TODO: Throw UnauthorizedException if invalid
    return {
      session_token: 'COOKIE_HERE_FOR_AUTH',
      user: { id: 1, username: loginDto.username },
    };
  }

  signup(createUserDto: CreateUserDto) {
    // TODO: Validate input (password requirements, username uniqueness)
    // TODO: Hash password
    // TODO: Create user in database
    // TODO: Throw BadRequestException if validation fails
    return {
      session_token: 'COOKIE_HERE_FOR_AUTH',
      user: { id: 1, username: createUserDto.username },
    };
  }
}
