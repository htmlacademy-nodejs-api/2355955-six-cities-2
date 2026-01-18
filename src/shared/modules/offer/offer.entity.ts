import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { AmenitiesTypeEnum } from '../../types/offer.amenities.enum.js';
import { Cities } from '../../types/offer.cities.type.js';
import { Coordinates } from '../../types/offer.coordinates.type.js';
import { HousingTypeEnum } from '../../types/offer.housing.type.js';
import { OfferTypeEnum } from '../../types/offer.type.enum.js';
import { Offer } from '../../types/offer.type.js';
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

// Зачем поле createdDate, в модели буду поля класса defaultClasses.TimeStamps
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  commentsCount: number;
  previewImage: string;

  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public createdDate: Date;

  @prop({ required: true })
  public images: string[];

  @prop({ required: true, enum: OfferTypeEnum })
  public type:OfferTypeEnum;

  @prop({ required: true })
  public price: number;

  @prop({ required: true, ref: UserEntity })
  public userId: Ref<UserEntity>;

  @prop({ required: true, enum: Cities })
  public city: Cities;

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public isFavorite: boolean;

  @prop({ required: true, min: 1, max: 8 })
  public roomsCount: number;

  @prop({ required: true, enum: AmenitiesTypeEnum })
  public amenities: AmenitiesTypeEnum[];

  @prop({ required: true, min: 1, max: 10 })
  public visitorsCount: number;

  @prop({ required: true, type: { latitude: Number, longitude: Number } })
  public coordinates: Coordinates;

  @prop({ required: true, enum: HousingTypeEnum })
  public housingType: HousingTypeEnum;

  @prop({ required: true, min: 0, max: 5 })
  public rating: number;


}

export const OfferModel = getModelForClass(OfferEntity);
