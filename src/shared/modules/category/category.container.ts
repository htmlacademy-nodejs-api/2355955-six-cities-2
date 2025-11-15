import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/component.type.js';
import { CategoryService } from './category-service.interface.js';
import { CategoryEntity, CategoryModel } from './category.entity.js';
import { DefaultCategoryService } from './default-category-service.js';

export const createCategoryContainer = () => {
  const container = new Container();
  container.bind<types.ModelType<CategoryEntity>>(Component.CategoryModel).toConstantValue(CategoryModel);
  container.bind<CategoryService>(Component.CategoryService).to(DefaultCategoryService).inSingletonScope();

  return container;
};
