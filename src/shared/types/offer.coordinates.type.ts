import { prop } from '@typegoose/typegoose';
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class Coordinates {
  @prop({ required: true })
  @IsNumber()
  @IsLatitude({ message: 'Latitude must be a valid latitude' })
    latitude: number;

  @prop({ required: true })
  @IsNumber()
  @IsLongitude({ message: 'Longitude must be a valid longitude' })
    longitude: number;
}
