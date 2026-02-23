import { IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'comment must be a string' })
  @MinLength(5, { message: 'comment must be at least 5 characters' })
  @MaxLength(1024, { message: 'comment must be at most 1024 characters' })
  public comment: string;

  @IsNumber({}, { message: 'rating must be a number' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  public rating: number;

  @IsString({ message: 'userId must be a string' })
  @IsMongoId({ message: 'userId must be a valid MongoDB ObjectId' })
  public userId: string;

  @IsString({ message: 'offerId must be a string' })
  @IsMongoId({ message: 'offerId must be a valid MongoDB ObjectId' })
  public offerId: string;
}
