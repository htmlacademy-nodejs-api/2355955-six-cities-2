type UserType = 'default' | 'pro';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  avatarPath: string;
}

