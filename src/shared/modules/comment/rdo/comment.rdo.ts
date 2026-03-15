import { Expose, Transform, Type } from 'class-transformer';
import { OfferRdo } from '../../offer/rdo/offer-rdo.js';
import { UserRdo } from '../../user/rdo/create-user.rdo.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public comment:string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose({ name: 'createdAt' })
  @Transform(({ obj }) => obj.createdAt.toISOString())
  public createdDate: Date;

  @Expose({ name: 'offerId' })
  @Type(() => OfferRdo)
  public offer: OfferRdo;
}
