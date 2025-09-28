import {User} from './user.type.js';

export type Offer = {
  name: string;
  description: string;
  publishDate: string;
  city: string;
  previewImg: string;
  apartmentImg: string;
  isPremium: boolean;
  isFavourite: boolean;
  rating: string;
  type: string;
  roomsCount: string;
  visitorsCount: string;
  rentalCost: string;
  facilities: string[];
  user: User;
}
