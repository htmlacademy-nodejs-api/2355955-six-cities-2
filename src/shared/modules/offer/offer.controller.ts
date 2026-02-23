import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import { ValidateDtoMiddleware } from '../../libs/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/middleware/validate-objectid.middleware.js';
import { BaseController } from '../../libs/rest/base-controller.abstract.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { ParamOfferId } from './types/param-offerid.type.js';
import { RequestQuery } from './types/request-query.type.js';
const USER_ID = '507f1f77bcf86cd799439011'; //TODO получить id юзера из токена
const isOfferIdIsStringType = (offerId:unknown): offerId is string => typeof offerId === 'string';
@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getById, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteById, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.updateById, middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto)] });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getCommentsByOfferId, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
  }


  public index = (_req: Request, res: Response): void => {
    const offers = this.offerService.find(10);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    //TOOD добавить проверку на авторизацию пользователя, который создает оффер
    const { body } = req;

    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  };


  public getById = async (req: Request<ParamOfferId>, res: Response): Promise<void> => {
    const { offerId } = req.params;
    const id = isOfferIdIsStringType(offerId) ? offerId : offerId[0];
    const offer = await this.offerService.findById(id);

    if (!offer) {

      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id } not found.`,
        OfferController.name,
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));

  };

  public deleteById = async (req: Request<ParamOfferId>, res: Response): Promise<void> => {
    //TODO добавить проверку на авторизацию пользователя, который удаляет оффер
    const { offerId } = req.params;
    const id = isOfferIdIsStringType(offerId) ? offerId : offerId[0];

    const offer = await this.offerService.findById(id);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    if (offer.userId.toString() !== USER_ID) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${USER_ID} is not allowed to delete offer with id ${id }.`,
        OfferController.name,
      );
    }
    const deletedOffer = await this.offerService.deleteById(id, USER_ID);
    await this.commentService.deleteCommetsByOfferId(offer.id);
    this.noContent(res, deletedOffer);
  };


  public updateById = async ({ params, body }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> => {
    //TODO добавить проверку на авторизацию пользователя, который обновляет оффер
    const { offerId } = params;
    const id = isOfferIdIsStringType(offerId) ? offerId : offerId[0];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    if (offer.userId.toString() !== USER_ID) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${USER_ID} is not allowed to update offer with id ${id}.`,
        OfferController.name,
      );
    }

    const updatedOffer = await this.offerService.updateById(id, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  };


  public getCommentsByOfferId = async (req: Request<ParamOfferId,unknown, unknown, RequestQuery>, res: Response): Promise<void> => {

    const { offerId } = req.params;
    const { limit } = req.query;
    const id = isOfferIdIsStringType(offerId) ? offerId : offerId[0];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    const comments = await this.commentService.findCommentsByOfferId(id, limit);
    this.ok(res, comments);
  };


}
