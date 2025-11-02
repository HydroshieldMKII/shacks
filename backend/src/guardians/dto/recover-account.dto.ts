import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverAccountDto {
  @ApiProperty({
    description: 'Email of the account to recover',
    example: 'lost@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'First guardian key',
    example: 'a1b2c3d4e5f67890abcdef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  guardianKey1: string;

  @ApiProperty({
    description: 'Second guardian key',
    example: 'fedcba0987654321fedcba0987654321',
  })
  @IsString()
  @IsNotEmpty()
  guardianKey2: string;

  @ApiProperty({
    description: 'New password for the recovered account',
    example: 'NewSecurePassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  newPassword: string;
}
