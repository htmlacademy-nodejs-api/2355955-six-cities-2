import { Ref } from '@typegoose/typegoose';
import { UserEntity } from '../modules/user/user.entity.js';

export type Comment = {
  comment:string;
  rating: number;
  userId: Ref<UserEntity>
}
