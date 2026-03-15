import { Request } from 'express';


export type UploadOfferImageRequest = Request & {
  file?: Express.Multer.File;
};
