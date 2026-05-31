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
};

export type PaginatedResponse<T> = ApiSuccess<T[]> & {
  meta: PaginatedMeta & Record<string, unknown>;
};

export type PaginationParams = {
  page?: number;
  per_page?: number;
};

export type ListQueryParams<F = Record<string, unknown>> = PaginationParams & {
  search?: string;
} & F;

export type DownloadResult = {
  blob: Blob;
  filename: string;
};

export function isApiError(response: ApiResponse<unknown>): response is ApiError {
  return !response.success;
}

export function getValidationErrors(response: ApiResponse<unknown>): ValidationErrors {
  if (!response.success && response.errors) {
    return response.errors;
  }
  return {};
}

export function getFieldError(errors: ValidationErrors, field: string): string | null {
  const value = errors[field];
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}
