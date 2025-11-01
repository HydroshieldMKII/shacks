import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardianDto {
  @ApiProperty({
    description: 'Email of the user to be guarded',
    example: 'user@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  guardedEmail: string;
}
