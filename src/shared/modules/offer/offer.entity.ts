import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { OfferTypeEnum } from '../../types/offer.type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { CategoryEntity } from '../category/category.entity.js';
import { UserEntity } from '../user/user.entity.js';
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
@injectable()
//Как правильно здесь реализовать интерфейс Offer
// Зачем поле createdDate, в модели буду поля класса defaultClasses.TimeStamps
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {

  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public createdDate: Date;

  @prop({ required: true })
  public image: string;

  @prop({ required: true, enum: OfferTypeEnum })
  public type:OfferTypeEnum;

  @prop({ required: true })
  public price: number;

  @prop({ required: true, ref: CategoryEntity, default: [], _id: false })
  public categories: Ref<CategoryEntity>[];

  @prop({ required: true, ref: UserEntity, default: [] })
  public userId: Ref<UserEntity>;


}

export const OfferModel = getModelForClass(OfferEntity);
