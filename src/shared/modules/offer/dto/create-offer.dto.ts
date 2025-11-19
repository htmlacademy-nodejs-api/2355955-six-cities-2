import { OfferTypeEnum } from '../../../types/offer.type.enum.js';

export class CreateOfferDto {
  title: string;
  description: string;
  createdDate: Date;
  image: string;
  type: OfferTypeEnum;
  price: number;
  categories: string[];
  userId: string;
}
