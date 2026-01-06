import { inject, injectable } from 'inversify';
import { getMongoURI } from '../shared/helpers/index.js';
import { Config } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.type.js';

/**
 * Пример замены реализации логгера через Inversify:
 *
 * Чтобы заменить PinoLogger на другую реализацию (например, ConsoleLogger),
 * достаточно изменить привязку в rest.container.ts:
 *
 * Было:
 * container.bind(Component.Logger).to(PinoLogger).inSingletonScope();
 *
 * Стало:
 * container.bind(Component.Logger).to(ConsoleLogger).inSingletonScope();
 *
 * Класс RestApplication не требует изменений, так как он зависит от интерфейса Logger,
 * а не от конкретной реализации. Это демонстрирует принцип инверсии зависимостей (DIP).
 */
@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

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
  }
}
