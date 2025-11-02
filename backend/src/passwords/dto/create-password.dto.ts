import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePasswordDto {
  @ApiPropertyOptional({
    description: 'Folder ID to organize the password entry (optional)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  folderId?: number;

  @ApiProperty({
    description: 'Name/title of the password entry',
    example: 'Gmail Account',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Username or email for the account',
    example: 'john@example.com',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password to be encrypted and stored',
    example: 'MySecretPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'URL of the website or service',
    example: 'https://mail.google.com',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the password entry',
    example: 'Recovery email: backup@example.com',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
