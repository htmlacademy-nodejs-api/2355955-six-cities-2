import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: Partial<CreateOfferDto>): Promise<DocumentType<OfferEntity> | null>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit:number): Promise<DocumentType<OfferEntity>[] | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string, limit: number): Promise<DocumentType<OfferEntity>[] | null>;
  findFavourite(): Promise<DocumentType<OfferEntity>[] | null>;
  addOrRemoveFromFavourite(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getAverageOffersRatingByComments():Promise<DocumentType<OfferEntity>[]>;
}
