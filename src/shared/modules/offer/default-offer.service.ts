import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { SortType } from '../../types/sort-type.enum.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    //TOOD добавить проверку на существование юзера, который создает оффер
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async deleteById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    //TOOD корренто ли проверку на принадлежность оффера юзеру делать здесь или в контроллере?
    return this.offerModel.findByIdAndDelete({
      userId: userId,
      _id: offerId
    }).exec();
  }


  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['userId']).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  public async find(limit: number = 60): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({}, { amenities: 0, coordinates: 0, visitorsCount: 0, images: 0, roomsCount: 0, description: 0 })
      .sort({ createdAt: SortType.Down })
      .limit(limit).populate(['userId']).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    ).exec();
  }


  public async findPremiumByCity(city: string, limit: number): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ city, isPremium: true, }, { amenities: 0, coordinates: 0, visitorsCount: 0, images: 0, roomsCount: 0, description: 0 })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findFavourite(): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ isFavorite: true }, { amenities: 0, coordinates: 0, visitorsCount: 0, images: 0, roomsCount: 0, description: 0 })
      .populate(['userId'])
      .exec();
  }

  public async addOrRemoveFromFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $bit: { isFavorite: { xor: 1 } } },
      { new: true }
    ).exec();
  }

  public async getAverageOffersRatingByComments(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'offerId',
          as: 'comments'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $round: [{ $avg: '$comments.rating' }, 1] },
              else: null
            }
          },
          commentsCount: { $size: '$comments' }
        }
      },
      {
        $project: {
          comments: 0
        }
      }
    ]);
  }
}
