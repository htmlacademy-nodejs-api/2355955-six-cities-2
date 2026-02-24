import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { HttpError } from '../rest/errors/http-error.js';
import { Middleware } from './middleware.interface.js';
const isObjectIdIsStringType = (offerId:unknown): offerId is string => typeof offerId === 'string';
export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];
    const id = isObjectIdIsStringType(objectId) ? objectId : objectId[0];
    if (Types.ObjectId.isValid(id)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
