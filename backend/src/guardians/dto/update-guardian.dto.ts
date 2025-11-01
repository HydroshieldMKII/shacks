import { PartialType } from '@nestjs/mapped-types';
import { CreateGuardianDto } from './create-guardian.dto';

export class UpdateGuardianDto extends PartialType(CreateGuardianDto) {}
