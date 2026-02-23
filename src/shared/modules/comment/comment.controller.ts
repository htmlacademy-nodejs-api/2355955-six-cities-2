import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import { ValidateDtoMiddleware } from '../../libs/middleware/validate-dto.middleware.js';
import { BaseController } from '../../libs/rest/base-controller.abstract.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateCommentDto)] });
  }

  public create = async (req: Request<ParamsDictionary, unknown, CreateCommentDto>, res: Response): Promise<void> => {
    //TODO добавить проверку на авторизацию пользователя, который создает комментарий
    const { body } = req;
    const comment = await this.commentService.create(body);

    this.created(res, fillDTO(CommentRdo, comment));
  };
}
