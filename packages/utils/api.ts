export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  total?: number;
  pagination?: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Helper function to format Zod validation errors
export const formatZodErrors = (zodError: any): ValidationError[] => {
  return (
    zodError.errors?.map((err: any) => ({
      field: err.path.join("."),
      message: err.message,
    })) || []
  );
};

// Helper function to create success response
export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  pagination?: PaginationInfo
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  pagination,
  total: pagination?.total,
});

// Helper function to create error response
export const createErrorResponse = (
  message: string,
  error?: string,
  errors?: ValidationError[]
): ApiResponse => ({
  success: false,
  message,
  error,
  errors,
});

// Helper function to create pagination info
export const createPaginationInfo = (
  page: number,
  limit: number,
  total: number
): PaginationInfo => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

// Helper function to parse pagination params
export const parsePaginationParams = (query: any): PaginationParams => {
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;

  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 10, // Max 100 items per page
  };
};
