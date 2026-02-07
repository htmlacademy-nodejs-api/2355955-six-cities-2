import { UserRdo } from '../../user/rdo/create-user.rdo.js';

export class CommentRdo {
  public id: string;
  public comment:string;
  public rating: number;
  public user: UserRdo;
//TODO добавить полe createdDate
}
