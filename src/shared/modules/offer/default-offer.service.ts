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
    const result = await (await this.offerModel.create(dto)).populate(['userId']);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async deleteById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete({
      userId: userId,
      _id: offerId
    }).exec();
  }


  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['userId']).exec();
  }

  public async addImageById(offerId: string, imagePath: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $push: { images: imagePath } },
      { new: true }
    ).populate(['userId']).exec();
  }

  public async addPreviewImageById(offerId: string, imagePath: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { previewImage: imagePath },
      { new: true }
    ).populate(['userId']).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(limit: number = 60): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find()
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
    return this.offerModel.find({ city, isPremium: true, },)
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findFavourite(): Promise<DocumentType<OfferEntity>[] | null> {
    return this.offerModel.find({ isFavorite: true })
      .populate(['userId'])
      .exec();
  }

  public async addOrRemoveFromFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      [{ $set: { isFavorite: { $not: ['$isFavorite'] } } }],
      { new: true }
    ).populate(['userId']).exec();
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
