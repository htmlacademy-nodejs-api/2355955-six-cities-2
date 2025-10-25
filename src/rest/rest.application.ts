import { inject, injectable } from 'inversify';
import { Config } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.type.js';
@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  async init () {
    this.logger.info('Application initialization...');
    this.logger.info(`Server started on port ${this.config.get('PORT')}`);
  }
}
