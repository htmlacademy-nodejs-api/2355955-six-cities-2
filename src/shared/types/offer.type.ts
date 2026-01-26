import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';
import { AmenitiesTypeEnum } from './offer.amenities.enum.js';
import { Cities } from './offer.cities.type.js';
import { Coordinates } from './offer.coordinates.type.js';
import { HousingTypeEnum } from './offer.housing.type.js';
import { OfferTypeEnum } from './offer.type.enum.js';

export type Offer = {
  title: string;
  description: string;
  createdDate: Date;
  previewImage: string;
  images: string[];
  type: OfferTypeEnum;
  price: number;
  userId: Ref<UserEntity>;
  city: Cities;
  isPremium: boolean;
  isFavorite: boolean;
  roomsCount: number;
  commentsCount: number;
  visitorsCount: number;
  coordinates: Coordinates;
  amenities: AmenitiesTypeEnum[]
  housingType: HousingTypeEnum;
  rating: number;
}


