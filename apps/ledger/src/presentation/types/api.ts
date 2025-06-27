export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

//TODO
export interface ErrorResponse {
  error: string;
  status: number;
}
