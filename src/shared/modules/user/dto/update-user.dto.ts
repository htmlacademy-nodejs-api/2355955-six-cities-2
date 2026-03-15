import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { UserAccountType } from '../../../types/user.account.type.js';

export class UpdateUserDto {

  @IsOptional()
  @IsString({ message: 'avatarPath must be a string' })
  public avatarPath?: string;

  @IsOptional()
  @IsString({ message: 'firstName must be a string' })
  @MinLength(1, { message: 'firstName must not be empty' })
  @MaxLength(15, { message: 'firstName must be at most 15 characters' })
  public firstName?: string;

  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @MinLength(1, { message: 'lastName must not be empty' })
  @MaxLength(64, { message: 'lastName must be at most 64 characters' })
  public lastName?: string;

  @IsOptional()
  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @MaxLength(12, { message: 'password must be at most 12 characters' })
  public password?: string;

  @IsOptional()
  @IsIn(['pro', 'base'], { message: 'account must be either "pro" or "base"' })
  public account?: UserAccountType;
}
