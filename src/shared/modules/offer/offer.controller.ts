import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController } from '../../libs/rest/base-controller.abstract.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer-rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }


  public index = (_req: Request, res: Response): void => {
    const offers = this.offerService.find(10);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { body } = req;

    //TODO: добавить проверку на существование предложения с таким же названием
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  };


}
