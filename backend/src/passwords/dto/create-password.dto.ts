import { IsInt, IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreatePasswordDto {
  @IsInt()
  userId: number;

  @IsInt()
  folderId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
