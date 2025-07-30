export type Book = {
  title: string;
  author: string;
  genre: string;
  coverImage?: string;
  summary: string;
  rating: number;
  year?: number;
  dataAiHint?: string;
  reviews?: number;
  ageGroup?: string;
};
