import { API_CONFIG } from "@/config/api";
import { sessionStore } from "@/shared/lib/auth/session.store";
import type { ApiError, ApiResponse, ApiSuccess, DownloadResult, ValidationErrors } from "@/shared/types/api";

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

const parseValidationErrors = (json: Record<string, unknown>): ValidationErrors => {
  if (json.errors && typeof json.errors === "object" && !Array.isArray(json.errors)) {
    return json.errors as ValidationErrors;
  }
  return {};
};

const getTenantHeaders = () => {
  const session = sessionStore.getState();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  if (session.workspace) {
    headers["X-Tenant"] = session.workspace;
  }

  return headers;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const url = `${API_CONFIG.baseUrl}${path}`;

  const headers: Record<string, string> = {
    ...getTenantHeaders(),
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
    const json = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      if (response.status === 401 && !path.includes("/login")) {
        sessionStore.clearSession();
      }

      return {
        success: false,
        message: (json.message as string) || `Request failed (${response.status})`,
        errors: parseValidationErrors(json),
      };
    }

    return json as ApiResponse<T>;
  } catch (error) {
    return toApiError(error);
  }
};

const download = async (path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<DownloadResult> => {
  const url = `${API_CONFIG.baseUrl}${path}`;

  const headers: Record<string, string> = {
    ...getTenantHeaders(),
    ...options?.headers,
  };

  const init: RequestInit = {
    method: "GET",
    headers,
    signal: options?.signal,
  };

  const response = await fetch(url, init);

  if (!response.ok) {
    let message = `Export failed (${response.status})`;
    try {
      const json = (await response.json()) as Record<string, unknown>;
      if (json.message) message = json.message as string;
    } catch {
      // response body is not JSON — use the default message
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const filenameMatch = disposition.match(/filename[^;=\n]*=["']?([^"';\n]+)/);
  const filename = filenameMatch?.[1] ?? "export.csv";

  return { blob, filename };
};

const unwrap = <T>(response: ApiResponse<T>): ApiSuccess<T> => {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response;
};

export function triggerDownload(result: DownloadResult): void {
  const url = URL.createObjectURL(result.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = result.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

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
  download,
  unwrap,
};

export { toApiError as normalizeApiError, unwrap as unwrapApiResponse };
