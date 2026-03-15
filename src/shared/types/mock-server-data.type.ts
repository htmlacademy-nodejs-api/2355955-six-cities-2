
type Capacity = {
  bedrooms: number[];
  maxAdults: number[]
}
export type MockServerData = {
  cities: string[];
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  images: string[];
  housingTypes: string[];
  amenities: string[];
  coordinates: string[];
  users: string[];
  emails: string[];
  avatars: string[];
  accounts: string[];
  prices: number[];
  ratings: number[];
  dates: string[];
  isPremium: boolean[];
  isFavorite: boolean[];
  isPro: boolean[];
  capacity: Capacity;
}
