import { Injectable } from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class PasswordsService {
  create(createPasswordDto: CreatePasswordDto) {
    return 'This action adds a new password';
  }

  findAll() {
    return `This action returns all passwords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} password`;
  }

  update(id: number, updatePasswordDto: UpdatePasswordDto) {
    return `This action updates a #${id} password`;
  }

  remove(id: number) {
    return `This action removes a #${id} password`;
  }
}
