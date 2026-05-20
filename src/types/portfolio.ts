export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  style?: string | null;
  tags?: string[] | null;
  createdAt: string;
  featuredOnHome?: boolean;
  homeSortOrder?: number;
  /** Studio display name (from NEXT_PUBLIC_STUDIO_NAME). */
  studioName?: string;
}
