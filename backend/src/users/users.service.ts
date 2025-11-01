import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  checkIfUserConnected() {
    //TODO: Implement actual check, return user details if connected
    return { id: 1, name: 'John Doe' };
  }
}
