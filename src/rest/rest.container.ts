import { Container } from 'inversify';
import { RestConfig } from '../shared/libs/config/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.type.js';
import { RestApplication } from './rest.application.js';

export const createRestApplicationContainer = () => {
  const container = new Container();
  container.bind(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind(Component.Config).to(RestConfig).inSingletonScope();
  container.bind(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  return container;
};
