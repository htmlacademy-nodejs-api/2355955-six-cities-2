import { Config } from 'convict';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { Logger } from '../../libs/logger/index.js';
import { PrivateRouteMiddleware } from '../../libs/middleware/private-route.middleware.js';
import { UploadFileMiddleware } from '../../libs/middleware/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/middleware/validate-objectid.middleware.js';
import { BaseController } from '../../libs/rest/base-controller.abstract.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/rdo/comment.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { isIdIsStringType, } from './helpers/index.js';
import { OfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { UploadOfferImageRdo } from './rdo/upload-offer-image-rdo.js';
import { ParamOfferId } from './types/param-offerid.type.js';
import { RequestQuery } from './types/request-query.type.js';
import { UploadOfferImageRequest } from './types/upload-image-request.type.js';
@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremiumOffersByCity });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.toggleFavorite, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getById, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.deleteById, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.updateById, middlewares:[new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto)] });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getCommentsByOfferId, middlewares: [new ValidateObjectIdMiddleware('offerId')] });
    this.addRoute({ path: '/:offerId/images', method: HttpMethod.Post, handler: this.uploadImage, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'image')] });
    this.addRoute({ path: '/:offerId/preview-image', method: HttpMethod.Post, handler: this.uploadPreviewImage, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'previewImage')] });
  }


  public getPremiumOffersByCity = async (req: Request, res: Response): Promise<void> => {
    const { city } = req.params;
    const cityName = Array.isArray(city) ? city[0] : city;
    const offers = await this.offerService.findPremiumByCity(cityName, 3);
    this.ok(res, fillDTO(OfferRdo, offers));
  };

  public getFavorites = async (_req: Request, res: Response): Promise<void> => {
    const offers = await this.offerService.findFavourite();
    this.ok(res, fillDTO(OfferRdo, offers));
  };

  public toggleFavorite = async (req: Request<ParamOfferId>, res: Response): Promise<void> => {
    const { offerId } = req.params;
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];

    const offer = await this.offerService.findById(id);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    const updatedOffer = await this.offerService.addOrRemoveFromFavourite(id);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  };

  public index = async(_req: Request, res: Response): Promise<void> => {
    const offers = await this.offerService.find(10);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { body, tokenPayload } = req;
    const offer = await this.offerService.create({ ...body, userId: tokenPayload.id });
    this.created(res, fillDTO(OfferRdo, offer));
  };


  public getById = async (req: Request<ParamOfferId>, res: Response): Promise<void> => {
    const { offerId } = req.params;
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];
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

    const { offerId } = req.params;
    const { tokenPayload } = req;
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN ,
        'Not authorized',
        OfferController.name
      );
    }
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];

    const offer = await this.offerService.findById(id);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    if (offer.userId.toString() !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${tokenPayload.id} is not allowed to delete offer with id ${id }.`,
        OfferController.name,
      );
    }
    const deletedOffer = await this.offerService.deleteById(id, tokenPayload.id);
    await this.commentService.deleteCommetsByOfferId(offer.id);
    this.ok(res, fillDTO(OfferRdo, deletedOffer));
  };


  public updateById = async ({ params, body, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> => {
    const { offerId } = params;

    const id = isIdIsStringType(offerId) ? offerId : offerId[0];
    const offer = await this.offerService.findById(id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    if (offer.userId.toString() !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User with id ${tokenPayload.id} is not allowed to update offer with id ${id}.`,
        OfferController.name,
      );
    }

    const updatedOffer = await this.offerService.updateById(id, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  };


  public getCommentsByOfferId = async (req: Request<ParamOfferId,unknown, unknown, RequestQuery>, res: Response): Promise<void> => {

    const { offerId } = req.params;
    const { limit } = req.query;
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];
    const offer = await this.offerService.findById(id);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    const comments = await this.commentService.findCommentsByOfferId(id, limit);
    this.ok(res, fillDTO(CommentRdo, comments));
  };


  public uploadImage = async ({ params, file }: UploadOfferImageRequest, res: Response): Promise<void> => {
    const { offerId } = params as ParamOfferId;
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];

    if (!file?.path) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Image file is required.',
        OfferController.name,
      );
    }

    const updatedOffer = await this.offerService.addImageById(id, file.filename);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    this.created(res, fillDTO(UploadOfferImageRdo, updatedOffer));
  };

  public uploadPreviewImage = async ({ params, file }: UploadOfferImageRequest, res: Response): Promise<void> => {
    const { offerId } = params as ParamOfferId;
    const id = isIdIsStringType(offerId) ? offerId : offerId[0];

    if (!file?.path) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Preview image file is required.',
        OfferController.name,
      );
    }

    const updatedOffer = await this.offerService.addPreviewImageById(id, file.filename);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${id} not found.`,
        OfferController.name,
      );
    }

    this.created(res, fillDTO(UploadOfferImageRdo, updatedOffer));
  };
}
