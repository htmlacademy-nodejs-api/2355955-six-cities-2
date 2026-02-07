import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/component.type.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferService } from './offer-service.interface.js';
import { OfferController } from './offer.controller.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export const createOfferContainer = () => {
  const container = new Container();
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<OfferController>(Component.OfferController).to(OfferController).inSingletonScope();
  return container;
};
