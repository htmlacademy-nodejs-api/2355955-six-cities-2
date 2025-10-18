
type Capacity = {
  bedrooms: number[];
  maxAdults: number[]
}
export type MockServerData = {
  categories: string[];
  cities: string[];
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  images: string[];
  types: string[];
  goods: string[];
  users: string[];
  emails: string[];
  avatars: string[];
  prices: number[];
  ratings: number[];
  dates: string[];
  isPremium: boolean;
  isFavorite: boolean;
  isPro: boolean;
  capacity: Capacity;
}
