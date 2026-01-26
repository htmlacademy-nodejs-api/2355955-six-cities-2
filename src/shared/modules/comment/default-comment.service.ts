import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { SortType } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

const MAX_COMMENTS_COUNT = 50;
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.comment}`);

    return comment;
  }

  async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    const comment = await this.commentModel.findById(commentId);
    return comment;
  }

  public async find(): Promise<DocumentType<CommentEntity>[] | null> {
    return await this.commentModel.find()
      .limit(MAX_COMMENTS_COUNT)
      .sort({ createdAt: SortType.Down })
      .populate(['userId'])
      .exec();
  }

}
