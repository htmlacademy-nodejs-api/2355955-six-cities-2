import { OfferTypeEnum } from '../types/offer.type.enum.js';
import { Cities } from '../types/offer.cities.type.js';
import { HousingTypeEnum } from '../types/offer.housing.type.js';
import { AmenitiesTypeEnum } from '../types/offer.amenities.enum.js';
import { UserAccountType } from '../types/user.account.type.js';
import { User } from '../types/user.type.js';
import { Coordinates } from '../types/offer.coordinates.type.js';

export type ParsedComment = {
  comment: string;
  rating: number;
  user: User;
}

export type ParsedOffer = {
  title: string;
  description: string;
  createdDate: Date;
  previewImage: string;
  images: string[];
  type: OfferTypeEnum;
  price: number;
  city: Cities;
  isPremium: boolean;
  isFavorite: boolean;
  roomsCount: number;
  commentsCount: number;
  visitorsCount: number;
  coordinates: Coordinates;
  amenities: AmenitiesTypeEnum[];
  housingType: HousingTypeEnum;
  rating: number;
  user: User;
  comments: ParsedComment[];
}

export function createOffer(offer: string): ParsedOffer {
  const [
    title,
    description,
    createdDate,
    previewImage,
    images,
    type,
    price,
    city,
    isPremium,
    isFavorite,
    roomsCount,
    commentsCount,
    visitorsCount,
    coordinates,
    amenities,
    housingType,
    rating,
    firstName,
    lastName,
    email,
    avatarPath,
    account,
    commentsData,
  ] = offer.replace('\n', '').split('\t');

  const [latitude, longitude] = coordinates.split(',').map(Number);

  const user = {
    email,
    firstName,
    lastName,
    avatarPath,
    account: account as UserAccountType
  };

  // Парсинг комментариев: формат "текст|рейтинг|имя|фамилия|email|аватар|аккаунт~текст2|рейтинг2|..."
  const comments: ParsedComment[] = commentsData
    ? commentsData.split('~').map((commentStr) => {
      const [commentText, commentRating, commentFirstName, commentLastName, commentEmail, commentAvatarPath, commentAccount] = commentStr.split('|');
      return {
        comment: commentText,
        rating: Number.parseFloat(commentRating),
        user: {
          email: commentEmail,
          firstName: commentFirstName,
          lastName: commentLastName,
          avatarPath: commentAvatarPath,
          account: commentAccount as UserAccountType
        }
      };
    })
    : [];

  return {
    title,
    description,
    createdDate: new Date(createdDate),
    previewImage,
    images: images.split(';'),
    type: type as OfferTypeEnum,
    price: Number.parseInt(price, 10),
    city: city as Cities,
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    roomsCount: Number.parseInt(roomsCount, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    visitorsCount: Number.parseInt(visitorsCount, 10),
    coordinates: { latitude, longitude },
    amenities: amenities.split(';').map((a) => a as AmenitiesTypeEnum),
    housingType: housingType as HousingTypeEnum,
    rating: Number.parseFloat(rating),
    user,
    comments,
  };
}
