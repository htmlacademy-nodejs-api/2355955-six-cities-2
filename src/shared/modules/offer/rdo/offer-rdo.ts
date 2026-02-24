import { Expose } from 'class-transformer';
import { Cities } from '../../../types/index.js';
import { HousingTypeEnum } from '../../../types/offer.housing.type.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public price: number;

  @Expose()
  public housingType: HousingTypeEnum;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public createdDate: Date;

  @Expose()
  public city: Cities;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;


}
