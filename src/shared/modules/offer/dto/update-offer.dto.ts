import { AmenitiesTypeEnum } from '../../../types/offer.amenities.enum.js';
import { Cities } from '../../../types/offer.cities.type.js';
import { Coordinates } from '../../../types/offer.coordinates.type.js';
import { HousingTypeEnum } from '../../../types/offer.housing.type.js';
import { OfferTypeEnum } from '../../../types/offer.type.enum.js';

export class UpdateOfferDto {
  title?: string;
  description?: string;
  createdDate?: Date;
  previewImage?: string;
  image?: string;
  type?: OfferTypeEnum;
  price?: number;
  userId?: string;
  city?: Cities;
  isPremium?: boolean;
  isFavorite?: boolean;
  roomsCount?: number;
  commentsCount?: number;
  visitorsCount?: number;
  housingType?: HousingTypeEnum;
  coordinates?: Coordinates;
  amenities?: AmenitiesTypeEnum[];
}
