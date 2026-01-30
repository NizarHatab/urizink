export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
