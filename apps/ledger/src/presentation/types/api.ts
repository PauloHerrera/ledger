export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

//TODO
export interface ErrorResponse {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}
