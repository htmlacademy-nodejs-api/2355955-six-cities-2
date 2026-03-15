import { Container } from 'inversify';
import { RestConfig } from '../shared/libs/config/index.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { AppExceptionFilter } from '../shared/libs/rest/app-exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';
import { ValidationExceptionFilter } from '../shared/libs/rest/validation.exception-filter.js';
import { Component } from '../shared/types/component.type.js';
import { RestApplication } from './rest.application.js';

export const createRestApplicationContainer = () => {
  const container = new Container();
  container.bind(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind(Component.Config).to(RestConfig).inSingletonScope();
  container.bind(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  container.bind(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  container.bind(Component.PathTransformer).to(PathTransformer).inSingletonScope();
  return container;
};
