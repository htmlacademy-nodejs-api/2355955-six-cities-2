import { config as configDotenv } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;
  constructor(@inject(Component.Logger) private readonly logger: Logger) {

    configDotenv();
    configRestSchema.load({});
    configRestSchema.validate({
      allowed: 'strict',
      output: this.logger.info,
    });

    this.config = configRestSchema.get();
    this.logger.info('Config successfully loaded from .env file');
  }

  get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
