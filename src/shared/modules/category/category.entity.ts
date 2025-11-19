import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { Category } from '../../types/categoty.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CategoryEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'categories',
    timestamps: true
  }
})
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CategoryEntity extends defaultClasses.TimeStamps implements Category {
  @prop({ required: true, unique: true })
  public name: string;
}

export const CategoryModel = getModelForClass(CategoryEntity);
