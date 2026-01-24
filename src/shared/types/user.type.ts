import { UserAccountType } from './user.account.type.js';
export type User = {
  firstName: string;
  lastName: string;
  email: string;
  avatarPath?: string;
  account: UserAccountType;
}


