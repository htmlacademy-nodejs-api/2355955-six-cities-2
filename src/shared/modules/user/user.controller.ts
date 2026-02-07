import { Config } from 'convict';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../helpers/index.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { BaseController } from '../../libs/rest/index.js';
import { CreateUserRequest } from '../../types/create-user-request.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Component } from '../../types/index.js';
import { LoginUserRequest } from '../../types/login-user-request.type.js';
import { UserRdo } from './rdo/create-user.rdo.js';
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

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create.bind(this) });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login.bind(this) });
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
        , 'UserController'
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
}
