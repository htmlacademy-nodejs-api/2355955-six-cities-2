import { Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../modules/offer/offer.entity.js';
import { UserEntity } from '../modules/user/user.entity.js';

export type Comment = {
  comment:string;
  rating: number;
  userId: Ref<UserEntity>
  offerId: Ref<OfferEntity>
}
