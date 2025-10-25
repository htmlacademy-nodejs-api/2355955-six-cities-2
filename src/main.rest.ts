import { Container } from 'inversify';
import 'reflect-metadata';
import { RestApplication } from './rest/index.js';
import { RestConfig } from './shared/libs/config/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/component.type.js';

async function bootstrap() {
  const container = new Container();
  container.bind(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind(Component.Config).to(RestConfig).inSingletonScope();
  container.bind(Component.RestApplication).to(RestApplication).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
