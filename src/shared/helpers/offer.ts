import { OfferTypeEnum } from '../types/offer.type.enum.js';
import { Offer } from '../types/offer.type.js';
import { User } from '../types/user.type.js';

export type OfferData = Omit<Offer,'categories'| 'userId'> & {
  categories: string[];
  user: User;
}
export function createOffer(offer: string): OfferData {
  const [
    title,
    description,
    createdDate,
    image,
    type,
    price,
    categories,
    firstName,
    lastName,
    email,
    avatarPath,

  ] = offer.replace('\n', '').split('\t');

  const user = {
    email,
    firstName,
    lastName,
    avatarPath
  };

  return {
    title,
    description,
    image,
    createdDate: new Date(createdDate),
    type: type as OfferTypeEnum,
    price: Number.parseInt(price, 10),
    categories: categories.split(','),
    user,
  };
}
