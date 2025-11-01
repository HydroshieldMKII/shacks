import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateGuardianDto {
  @IsInt()
  guardedEmail: string;
}
