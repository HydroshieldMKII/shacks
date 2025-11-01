import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateGuardianDto {
  @IsEmail()
  @IsNotEmpty()
  guardedUserEmail: string;

  @IsString()
  @IsNotEmpty()
  guardianKeyValue: string;
}
