import {readFileSync} from 'node:fs';
import {Offer} from '../../types/index.js';
import {resolve} from 'node:path';

export class TsvFileReader {
  private rowData = '';

  constructor(
    readonly filePath: string
  ) {
  }

  public read() {
    this.rowData = readFileSync(resolve(this.filePath), {encoding: 'utf8'});
  }

  public toArray(): Offer[] {
    if (!this.rowData) {
      throw new Error('file wa not read');
    }

    return this.rowData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((row) => row.split('\t'))
      .map(([name, description, publishDate, city, previewImg, apartmentImg, isPremium, isFavourite, rating, type, roomsCount, visitorsCount, rentalCost, facilities, firstName, lastName, email, password, userType, avatarPath]) => ({
        name,
        description,
        publishDate: new Date(publishDate).toISOString(),
        city,
        previewImg,
        apartmentImg,
        isPremium: isPremium === 'true',
        isFavourite: isFavourite === 'true',
        rating,
        type,
        roomsCount,
        visitorsCount,
        rentalCost,
        facilities: facilities.split(','),
        user: {
          firstName,
          lastName,
          userType: userType === 'pro' ? 'pro' : 'default',
          avatarPath,
          password,
          email
        },

      }));
  }
}
