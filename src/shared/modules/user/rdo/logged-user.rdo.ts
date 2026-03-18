import { Expose, Transform } from 'class-transformer';

export class LoggedUserRdo {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id.toString())
  public id: string;

  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public avatarPath: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;
}
