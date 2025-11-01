import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreatePasswordDto {
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

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
