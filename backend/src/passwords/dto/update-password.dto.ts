import { PartialType } from '@nestjs/mapped-types';
import { CreatePasswordDto } from './create-password.dto';

export class UpdatePasswordDto extends PartialType(CreatePasswordDto) {}
