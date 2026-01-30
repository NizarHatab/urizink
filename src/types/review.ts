export interface Review {
  id: string;
  userId: string;
  artistId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
