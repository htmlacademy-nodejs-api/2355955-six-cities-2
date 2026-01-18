import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { createSHA256 } from '../../helpers/index.js';
import { User } from '../../types/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
@injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {

  @prop({ unique: true, required: true, })
  public email: string;

  @prop()
  public avatarPath?: string;

  @prop({ required: true })
  public firstName: string;

  @prop({ required: true })
  public lastName: string;

  @prop({ required: true, minlength: 6, maxlength: 12 })
  private password?: string;

  @prop({ required: true, })
  public account: 'pro' | 'base';

  constructor(userData: CreateUserDto) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}


export const UserModel = getModelForClass(UserEntity);
