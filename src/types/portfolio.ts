export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  categoryId?: string | null;
  categoryName?: string | null;
  /** @deprecated Use categoryName — kept for older clients during transition */
  style?: string | null;
  tags?: string[] | null;
  createdAt: string;
  featuredOnHome?: boolean;
  homeSortOrder?: number;
  studioName?: string;
}
