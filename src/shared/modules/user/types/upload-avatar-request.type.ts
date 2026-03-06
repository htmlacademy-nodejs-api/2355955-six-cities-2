import { Request } from 'express';


export type UploadAvatarRequest = Request & {
  file?: Express.Multer.File;
};
