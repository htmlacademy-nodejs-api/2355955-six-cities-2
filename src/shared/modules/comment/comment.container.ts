import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/component.type.js';
import { CommentService } from './comment-service.interface.js';
import { CommentController } from './comment.controller.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';

export const createCommentContainer = () => {
  const container = new Container();
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService);
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentController>(Component.CommentController).to(CommentController).inSingletonScope();
  return container;
};
