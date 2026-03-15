import { Expose } from 'class-transformer';
import { UserAccountType } from '../../../types/user.account.type.js';

export class UserRdo {
  @Expose()
  public email: string ;

  @Expose()
  public lastName: string;

  @Expose()
  public firstName: string;

  @Expose()
  public account: UserAccountType;

  @Expose()
  public avatarPath: string;
}
