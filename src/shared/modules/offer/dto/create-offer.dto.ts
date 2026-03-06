import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';
import { AmenitiesTypeEnum } from '../../../types/offer.amenities.enum.js';
import { Cities } from '../../../types/offer.cities.type.js';
import { Coordinates } from '../../../types/offer.coordinates.type.js';
import { HousingTypeEnum } from '../../../types/offer.housing.type.js';
import { OfferTypeEnum } from '../../../types/offer.type.enum.js';

export class CreateOfferDto {
  @MinLength(10, { message: 'Minimum title length must be 10' })
  @MaxLength(100, { message: 'Maximum title length must be 100' })
    title: string;

  @MinLength(20, { message: 'Minimum description length must be 20' })
  @MaxLength(1024, { message: 'Maximum description length must be 1024' })
    description: string;

  @IsDateString({}, { message: 'createdDate must be a valid ISO date' })
    createdDate: Date;

  @IsString({ message: 'previewImage must be a string' })
    previewImage: string;

   @IsArray({ message: 'images must be an array of strings' })
   @IsString({ each: true, message: 'each image must be a string' })
     images: string[];

  @IsEnum(OfferTypeEnum, { message: 'type must be one of the OfferTypeEnum values' })
    type: OfferTypeEnum;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(100, { message: 'price must be greater than or equal to 100' })
  @Max(100000, { message: 'price must be less than or equal to 100000' })
    price: number;

  @IsString({ message: 'userId must be a string' })
  @IsMongoId({ message: 'userId must be a valid MongoDB ObjectId' })
    userId: string;

  @IsEnum(Cities, { message: 'city must be one of the Cities type' })
    city: Cities;

  @IsBoolean({ message: 'isPremium must be a boolean' })
    isPremium: boolean;

  @IsBoolean({ message: 'isFavorite must be a boolean' })
    isFavorite: boolean;

  @IsNumber({}, { message: 'roomsCount must be a number' })
  @Min(1, { message: 'roomsCount must be greater than or equal to 0' })
  @Max(8, { message: 'roomsCount must be less than or equal to 8' })
    roomsCount: number;

  @IsNumber({}, { message: 'guestsCount must be a number' })
    commentsCount: number;

  @IsNumber({}, { message: 'visitorsCount must be a number' })
  @Min(1, { message: 'visitorsCount must be greater than or equal to 0' })
  @Max(10, { message: 'visitorsCount must be less than or equal to 10' })
    visitorsCount: number;

  @IsEnum(HousingTypeEnum, { message: 'housingType must be one of the HousingTypeEnum values' })
    housingType: HousingTypeEnum;

  @Type(() => Coordinates)
  @ValidateNested()
    coordinates: Coordinates;

  @IsArray({ message: 'amenities must be an array' })
  @IsEnum(AmenitiesTypeEnum, { each: true, message: 'each amenity must be one of the AmenitiesTypeEnum values' })
    amenities: AmenitiesTypeEnum[];

  @IsNumber({}, { message: 'rating must be a number' })
  @Min(0, { message: 'rating must be greater than or equal to 0' })
  @Max(5, { message: 'rating must be less than or equal to 5' })
    rating: number;
}
