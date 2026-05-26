import { API_CONFIG } from "@/config/api";
import { sessionStore } from "@/shared/lib/auth/session.store";
import type { ApiError, ApiResponse, ApiSuccess } from "@/shared/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const toApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "success" in error) {
    return error as ApiError;
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      errors: {},
    };
  }

  return {
    success: false,
    message: "Unexpected error",
    errors: {},
  };
};

const getAuthHeaders = () => {
  const session = sessionStore.getState();
  return {
    Authorization: session.token ? `Bearer ${session.token}` : "",
    "X-Tenant": session.workspace ?? "",
    Accept: "application/json",
  };
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const url = `${API_CONFIG.baseUrl}${path}`;

  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    signal: options.signal,
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, init);
    const json = (await response.json()) as ApiResponse<T>;

    if (!response.ok) {
      return {
        success: false,
        message: json.message || "Request failed",
        errors: "errors" in json ? json.errors : {},
      };
    }

    return json;
  } catch (error) {
    return toApiError(error);
  }
};

const unwrap = <T>(response: ApiResponse<T>): ApiSuccess<T> => {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
};

export const httpClient = {
  request,
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
  unwrap,
};

export { toApiError as normalizeApiError, unwrap as unwrapApiResponse };
