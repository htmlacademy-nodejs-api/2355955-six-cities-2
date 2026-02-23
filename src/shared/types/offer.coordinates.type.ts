import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class Coordinates {
  @IsNumber()
  @IsLatitude({ message: 'Latitude must be a valid latitude' })
    latitude: number;

  @IsNumber()
  @IsLongitude({ message: 'Longitude must be a valid longitude' })
    longitude: number;
}
