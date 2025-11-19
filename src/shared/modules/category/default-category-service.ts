import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/component.type.js';
import { CategoryService } from './category-service.interface.js';
import { CategoryEntity } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@injectable()
export class DefaultCategoryService implements CategoryService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CategoryModel) private readonly categoryModel: types.ModelType<CategoryEntity>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const result = await this.categoryModel.create(dto);
    this.logger.info(`Category created: ${result.name}`);
    return result;
  }

  async findByCategoryId(categoryId: string): Promise<DocumentType<CategoryEntity> | null> {
    const result = await this.categoryModel.findById(categoryId);
    this.logger.info(`Category found: ${result?.name}`);
    return result;
  }

  async findByCategoryName(categoryName: string): Promise<DocumentType<CategoryEntity> | null> {
    const result = await this.categoryModel.findOne({ name: categoryName });
    this.logger.info(`Category found: ${result?.name}`);
    return result;
  }

  async findByCategoryNameOrCreate(categoryName: string, dto: CreateCategoryDto): Promise<DocumentType<CategoryEntity>> {
    const result = await this.findByCategoryName(categoryName);
    if (result) {
      return result;
    }
    return this.create(dto);
  }
}
