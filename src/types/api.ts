export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
