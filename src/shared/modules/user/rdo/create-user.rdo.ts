import { Expose } from 'class-transformer';
import { UserAccountType } from '../../../types/user.account.type.js';

export class UserRdo {
  @Expose()
  public email: string ;

  @Expose()
  public name: string;

  @Expose()
  public firstname: string;

  @Expose()
  public account: UserAccountType;
}
