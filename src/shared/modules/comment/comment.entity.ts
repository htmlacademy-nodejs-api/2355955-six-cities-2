import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { Comment } from '../../types/comment.type.js';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {

  @prop({ required: true })
  public comment: string;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, ref: UserEntity, })
  public userId: Ref<UserEntity>;

  @prop({ required: true, ref: OfferEntity })
    offerId: Ref<OfferEntity>;

}

export const CommentModel = getModelForClass(CommentEntity);
