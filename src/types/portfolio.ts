export interface PortfolioItem {
  id: string;
  artistId: string;
  title: string;
  imageUrl: string;
  style?: string;
  tags?: string[];
  createdAt: string;
}
