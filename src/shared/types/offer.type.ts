import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  createdDate: Date;
  image: string;
  type: string;
  price: number;
  categories: string[];
  user: User;
}


