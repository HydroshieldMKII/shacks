import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateGuardianDto {
  @IsInt()
  guardedUserId: number;

  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  guardianKeyValue: string;
}
