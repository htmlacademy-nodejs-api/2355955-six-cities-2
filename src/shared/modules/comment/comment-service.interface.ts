import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  find(limit?: number): Promise<DocumentType<CommentEntity>[] | null>;
  deleteCommetsByOfferId(offerId: string): Promise<number>;
  findCommentsByOfferId(offerId: string, limit?: number): Promise<DocumentType<CommentEntity>[] | null>;
}
