export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ReviewListItem {
  id: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  timeAgo: string;
}

export interface ReviewDistributionRow {
  star: number;
  count: number;
  percent: number;
}

export interface ReviewMonthlyRow {
  label: string;
  count: number;
}

export interface ReviewStats {
  averageRating: number | null;
  totalCount: number;
  newThisWeek: number;
  positivePercent: number | null;
  distribution: ReviewDistributionRow[];
  monthlyVolume: ReviewMonthlyRow[];
}

export interface ReviewsPayload {
  reviews: ReviewListItem[];
  stats: ReviewStats;
}
