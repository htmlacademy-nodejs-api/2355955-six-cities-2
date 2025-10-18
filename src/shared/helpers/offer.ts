import { Offer } from '../types/offer.type.js';

export function createOffer(offerData: string): Offer {
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
    avatarPath
  ] = offerData.replace('\n', '').split('\t');

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
    user,
    createdDate: new Date(createdDate),
    type,
    price: Number.parseInt(price, 10),
    categories: categories.split(',')

  };
}
