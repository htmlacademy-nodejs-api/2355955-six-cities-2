import { Config } from 'convict';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/index.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { Logger } from '../../libs/logger/index.js';
import { UploadFileMiddleware } from '../../libs/middleware/upload-file.middleware.js';
import { ValidateDtoMiddleware } from '../../libs/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../libs/middleware/validate-objectid.middleware.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { BaseController } from '../../libs/rest/index.js';
import { CreateUserRequest } from '../../types/create-user-request.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { LoginUserRequest } from '../../types/login-user-request.type.js';
import { CreateUserDto } from './dto/index.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/create-user.rdo.js';
import { UploadAvatarRequest } from './types/index.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create.bind(this), middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login.bind(this), middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public create = async (
    _req: CreateUserRequest,
    _res: Response
  ): Promise<void> => {
    const { body } = _req;
    const isUserExixst = await this.userService.findByEmail(body.email);

    if (isUserExixst) {
      throw new HttpError(
        StatusCodes.CONFLICT
        , `User with email ${body.email} already exists`
        , UserController.name
      );
    }

    const user = await this.userService.create(body, this.config.get('SALT'));
    this.created(_res, fillDTO(UserRdo, user));
  };

  public async login(
    _req: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const { body } = _req;
    console.log('body', body);

    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async uploadAvatar(req: UploadAvatarRequest, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
