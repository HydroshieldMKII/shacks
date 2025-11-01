import { PartialType } from '@nestjs/swagger';
import { CreateGuardianDto } from './create-guardian.dto';

export class UpdateGuardianDto extends PartialType(CreateGuardianDto) {}
