import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { getMongoURI } from '../shared/helpers/index.js';
import { Config } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { ExceptionFilter } from '../shared/libs/rest/index.js';
import { OfferController } from '../shared/modules/offer/offer.controller.js';
import { UserController } from '../shared/modules/user/user.controller.js';
import { Component } from '../shared/types/component.type.js';

@injectable()
export class RestApplication {
  private readonly server: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: OfferController,
    @inject(Component.UserController) private readonly userController: UserController,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port, () => {
      this.logger.info(`Server is running on port ${port}`);
    });
  }

  private async _initMiddleware() {
    this.server.use(express.json());
  }


  private async _initControllers() {
    this.logger.info('Init controllers…');
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
  }

  private async _initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    return this.databaseClient.connect(mongoUri);

  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database…');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init middleware…');
    await this._initMiddleware();
    this.logger.info('Middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');


    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server');
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
