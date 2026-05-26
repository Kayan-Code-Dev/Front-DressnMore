export type ValidationErrors = Record<string, string | string[]>;

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown> | null;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: ValidationErrors;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type PaginatedMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  total_pages?: number;
};

export type PaginatedResponse<T> = ApiSuccess<T[]> & {
  meta: PaginatedMeta & Record<string, unknown>;
};
