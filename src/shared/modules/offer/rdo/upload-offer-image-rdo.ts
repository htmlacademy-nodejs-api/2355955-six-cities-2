import { Expose } from 'class-transformer';

export class UploadOfferImageRdo {
  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];
}
