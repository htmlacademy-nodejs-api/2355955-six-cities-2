import { Ref } from '@typegoose/typegoose';
import { CategoryEntity } from '../modules/category/category.entity.js';
import { UserEntity } from '../modules/user/user.entity.js';
import { OfferTypeEnum } from './offer.type.enum.js';

export type Offer = {
  title: string;
  description: string;
  createdDate: Date;
  image: string;
  type: OfferTypeEnum;
  price: number;
  categories: Ref<CategoryEntity>[];
  userId: Ref<UserEntity>;
}


