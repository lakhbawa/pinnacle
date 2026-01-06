// lib/fetch-wrapper.ts

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: APIError) => APIError | Promise<APIError> | never;

interface FetchWrapperConfig {
  baseURL?: string;
  headers?: HeadersInit;
  timeout?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}

// ============================================
// Custom Error Class
// ============================================

export class APIError extends Error {
  public status: number;
  public statusText: string;
  public data: unknown;
  public url: string;
  public isNetworkError: boolean;
  public isTimeout: boolean;
  public originalMessage: string | null;

  constructor(options: {
    status: number;
    statusText: string;
    data: unknown;
    url?: string;
    isNetworkError?: boolean;
    isTimeout?: boolean;
  }) {

    const message = options.isTimeout
      ? `Request timeout`
      : options.isNetworkError
        ? `Network error`
        : `HTTP ${options.status}: ${options.statusText}`;

    super(message);
    this.name = 'APIError';
    this.status = options.status;
    this.statusText = options.statusText;
    this.data = options.data;
    this.url = options.url || '';
    this.isNetworkError = options.isNetworkError || false;
    this.isTimeout = options.isTimeout || false;
    this.originalMessage = options.statusText;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  // Check if this is a validation error (400 or 422)
  isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  // Check if this is an auth error
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  // Check if this is a server error
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  // Check if this is a not found error
  isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Get validation errors in a normalized format
   * Handles multiple common API error formats:
   * - { error: { errors: { field: "message" } } }  -- Your API format
   * - { errors: { field: ["message"] } }
   * - { errors: [{ field: "email", message: "required" }] }
   * - { details: { field: ["message"] } }
   * - { message: "error", errors: {...} }
   * - { field: ["message"] } (direct format)
   */
  getValidationErrors(): Record<string, string[]> | null {
    // Remove the status check - allow getting errors regardless of status code
    if (!this.data || typeof this.data !== 'object') {
      return null;
    }

    const data = this.data as Record<string, unknown>;

    // Format: { error: { errors: { field: "message" } } } -- Your API format
    if (data.error && typeof data.error === 'object') {
      const errorObj = data.error as Record<string, unknown>;
      if (errorObj.errors && typeof errorObj.errors === 'object' && !Array.isArray(errorObj.errors)) {
        return this.normalizeErrorObject(errorObj.errors as Record<string, unknown>);
      }
    }

    // Format: { errors: { field: ["message"] } }
    if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      return this.normalizeErrorObject(data.errors as Record<string, unknown>);
    }

    // Format: { errors: [{ field: "email", message: "required" }] }
    if (Array.isArray(data.errors)) {
      return this.normalizeErrorArray(data.errors);
    }

    // Format: { details: { field: ["message"] } }
    if (data.details && typeof data.details === 'object') {
      return this.normalizeErrorObject(data.details as Record<string, unknown>);
    }

    // Format: { validationErrors: { field: ["message"] } }
    if (data.validationErrors && typeof data.validationErrors === 'object') {
      return this.normalizeErrorObject(data.validationErrors as Record<string, unknown>);
    }

    // Format: Direct field errors at root { field: ["message"] }
    // Check if data looks like field errors (has array or string values)
    const hasFieldErrors = Object.values(data).some(
      (v) =>
        typeof v === 'string' ||
        (Array.isArray(v) && v.every((item) => typeof item === 'string'))
    );
    if (hasFieldErrors) {
      return this.normalizeErrorObject(data);
    }

    return null;
  }

  private normalizeErrorObject(obj: Record<string, unknown>): Record<string, string[]> | null {
    const result: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        result[key] = value.map((v) => String(v));
      } else if (typeof value === 'string') {
        result[key] = [value];
      } else if (typeof value === 'object' && value !== null) {
        // Nested errors like { field: { _errors: ["message"] } } (Zod format)
        const nested = value as Record<string, unknown>;
        if (Array.isArray(nested._errors)) {
          result[key] = nested._errors.map((v) => String(v));
        }
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  private normalizeErrorArray(arr: unknown[]): Record<string, string[]> | null {
    const result: Record<string, string[]> = {};

    for (const item of arr) {
      if (typeof item === 'object' && item !== null) {
        const error = item as Record<string, unknown>;
        const field = (error.field || error.path || error.param || 'general') as string;
        const message = (error.message || error.msg || error.error || 'Invalid') as string;

        if (!result[field]) {
          result[field] = [];
        }
        result[field].push(message);
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Get the first error message (useful for toast notifications)
   */
  getFirstError(): string {
    if (this.originalMessage) {
    return this.originalMessage;
  }
    const errors = this.getValidationErrors();
    if (errors) {
      const firstField = Object.keys(errors)[0];
      if (firstField && errors[firstField]?.[0]) {
        return errors[firstField][0];
      }
    }

    // Try to get message from data (handles nested error object)
    if (this.data && typeof this.data === 'object') {
      const data = this.data as Record<string, unknown>;

      // Format: { error: { message: "..." } }
      if (data.error && typeof data.error === 'object') {
        const errorObj = data.error as Record<string, unknown>;
        if (typeof errorObj.message === 'string') return errorObj.message;
      }

      // Format: { message: "..." }
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }

    return this.message;
  }

  /**
   * Get all error messages as a flat array
   */
  getAllErrors(): string[] {
    const errors = this.getValidationErrors();
    if (errors) {
      return Object.entries(errors).flatMap(([field, messages]) =>
        messages.map((msg) => `${field}: ${msg}`)
      );
    }
    return [this.getFirstError()];
  }

  /**
   * Get the error code from the API response (e.g., "VALIDATION_ERROR")
   */
  getErrorCode(): string | null {
    if (this.data && typeof this.data === 'object') {
      const data = this.data as Record<string, unknown>;

      // Format: { error: { code: "..." } }
      if (data.error && typeof data.error === 'object') {
        const errorObj = data.error as Record<string, unknown>;
        if (typeof errorObj.code === 'string') return errorObj.code;
      }

      // Format: { code: "..." }
      if (typeof data.code === 'string') return data.code;
    }
    return null;
  }

  /**
   * Check if the error matches a specific error code
   */
  hasErrorCode(code: string): boolean {
    return this.getErrorCode() === code;
  }
}

// ============================================
// FetchWrapper Class
// ============================================

export class FetchWrapper {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];
  private errorInterceptors: ErrorInterceptor[];

  constructor(config: FetchWrapperConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.requestInterceptors = [...(config.requestInterceptors || [])];
    this.responseInterceptors = [...(config.responseInterceptors || [])];
    this.errorInterceptors = [...(config.errorInterceptors || [])];
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index > -1) this.requestInterceptors.splice(index, 1);
    };
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index > -1) this.responseInterceptors.splice(index, 1);
    };
  }

  public addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index > -1) this.errorInterceptors.splice(index, 1);
    };
  }

  private async executeRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  private async executeResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  private async executeErrorInterceptors(error: APIError): Promise<APIError> {
    let modifiedError = error;
    for (const interceptor of this.errorInterceptors) {
      modifiedError = await interceptor(modifiedError);
    }
    return modifiedError;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    let url: string;

    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      url = endpoint;
    } else {
      const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      url = `${base}${path}`;
    }

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return url;
  }

  private async fetchWithTimeout(url: string, config: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError({
          status: 0,
          statusText: 'Timeout',
          data: null,
          url,
          isTimeout: true,
        });
      }

      // Network error (offline, CORS, etc.)
      throw new APIError({
        status: 0,
        statusText: 'Network Error',
        data: error instanceof Error ? error.message : 'Unknown error',
        url,
        isNetworkError: true,
      });
    }
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');

    // Empty response
    if (contentLength === '0' || response.status === 204) {
      return null;
    }

    try {
      if (contentType.includes('application/json')) {
        return await response.json();
      }

      if (contentType.includes('text/')) {
        return await response.text();
      }

      if (contentType.includes('application/octet-stream') || contentType.includes('image/')) {
        return await response.blob();
      }

      // Default: try JSON first, fall back to text
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch {
      return null;
    }
  }

  async request<T = unknown>(
    endpoint: string,
    config: RequestInit & { params?: Record<string, string | number | boolean> } = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);

    const headers = new Headers(this.defaultHeaders);
    if (fetchConfig.headers) {
      const configHeaders = new Headers(fetchConfig.headers);
      configHeaders.forEach((value, key) => headers.set(key, value));
    }

    let requestConfig: RequestInit = {
      ...fetchConfig,
      headers,
    };

    requestConfig = await this.executeRequestInterceptors(requestConfig);

    try {
      let response = await this.fetchWithTimeout(url, requestConfig);

      // Clone response before interceptors in case they consume the body
      const responseClone = response.clone();
      response = await this.executeResponseInterceptors(response);

      // Parse body from the clone to ensure we can always read it
      const responseData = await this.parseResponseBody(responseClone);
      let statusText = response.statusText;

      if (
        responseData &&
        typeof responseData === 'object' &&
        'error' in responseData &&
        responseData.error &&
        typeof responseData.error === 'object' &&
        'message' in responseData.error
      ) {
        statusText = String((responseData.error as { message: unknown }).message);
      }

      if (!response.ok) {
        let error = new APIError({
          status: response.status,
          statusText: statusText,
          data: responseData,
          url,
        });


        error = await this.executeErrorInterceptors(error);
        throw error;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof APIError) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`[APIError] ${error.status} ${url}:`, error.data);
        }
        throw error;
      }

      // Unexpected error
      const apiError = new APIError({
        status: 0,
        statusText: 'Unknown Error',
        data: error instanceof Error ? error.message : 'Unknown error',
        url,
        isNetworkError: true,
      });

      if (process.env.NODE_ENV === 'development') {
        console.error(`[APIError] Unexpected error for ${url}:`, error);
      }

      throw apiError;
    }
  }

  get<T = unknown>(
    endpoint: string,
    config?: RequestInit & { params?: Record<string, string | number | boolean> }
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      headers: isFormData
        ? config?.headers // Let browser set Content-Type for FormData
        : {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
    });
  }

  put<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;

    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      headers: isFormData
        ? config?.headers
        : {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
    });
  }

  patch<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;

    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      headers: isFormData
        ? config?.headers
        : {
            'Content-Type': 'application/json',
            ...config?.headers,
          },
    });
  }

  delete<T = unknown>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// ============================================
// Factory & Registry
// ============================================

interface APIRegistry {
  [key: string]: FetchWrapper;
}

const apiRegistry: APIRegistry = {};
const sharedRequestInterceptors: RequestInterceptor[] = [];
const sharedResponseInterceptors: ResponseInterceptor[] = [];
const sharedErrorInterceptors: ErrorInterceptor[] = [];

export function addSharedRequestInterceptor(interceptor: RequestInterceptor): () => void {
  sharedRequestInterceptors.push(interceptor);
  const removers = Object.values(apiRegistry).map((api) => api.addRequestInterceptor(interceptor));
  return () => {
    const index = sharedRequestInterceptors.indexOf(interceptor);
    if (index > -1) sharedRequestInterceptors.splice(index, 1);
    removers.forEach((remove) => remove());
  };
}

export function addSharedResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  sharedResponseInterceptors.push(interceptor);
  const removers = Object.values(apiRegistry).map((api) => api.addResponseInterceptor(interceptor));
  return () => {
    const index = sharedResponseInterceptors.indexOf(interceptor);
    if (index > -1) sharedResponseInterceptors.splice(index, 1);
    removers.forEach((remove) => remove());
  };
}

export function addSharedErrorInterceptor(interceptor: ErrorInterceptor): () => void {
  sharedErrorInterceptors.push(interceptor);
  const removers = Object.values(apiRegistry).map((api) => api.addErrorInterceptor(interceptor));
  return () => {
    const index = sharedErrorInterceptors.indexOf(interceptor);
    if (index > -1) sharedErrorInterceptors.splice(index, 1);
    removers.forEach((remove) => remove());
  };
}

export function createAPI(name: string, config: FetchWrapperConfig): FetchWrapper {
  const instance = new FetchWrapper({
    ...config,
    requestInterceptors: [...sharedRequestInterceptors, ...(config.requestInterceptors || [])],
    responseInterceptors: [...sharedResponseInterceptors, ...(config.responseInterceptors || [])],
    errorInterceptors: [...sharedErrorInterceptors, ...(config.errorInterceptors || [])],
  });

  apiRegistry[name] = instance;
  return instance;
}

export function getAPI(name: string): FetchWrapper {
  const api = apiRegistry[name];
  if (!api) {
    throw new Error(`API "${name}" not found. Did you forget to create it?`);
  }
  return api;
}

export function removeAPI(name: string): boolean {
  if (apiRegistry[name]) {
    delete apiRegistry[name];
    return true;
  }
  return false;
}

// ============================================
// Service Instances
// ============================================

export const authAPI = createAPI('auth', {
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://127.0.0.1:4700/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const outcomeAPI = createAPI('outcome', {
  baseURL: process.env.NEXT_PUBLIC_OUTCOME_URL || 'http://127.0.0.1:4700/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const gatewayAPI = createAPI('gateway', {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ============================================
// Shared Interceptors
// ============================================

// Add auth token to all requests
addSharedRequestInterceptor((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    const headers = new Headers(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

// Log responses in development
addSharedResponseInterceptor((response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${response.status}] ${response.url}`);
  }
  return response;
});

// Global error handling
addSharedErrorInterceptor((error) => {
  // Handle 401 globally - redirect to login
  if (error.status === 401 && typeof window !== 'undefined') {
    // Clear token and redirect (customize as needed)
    localStorage.removeItem('token');
    // window.location.href = '/login';
  }
  return error;
});

// ============================================
// Service-specific Interceptors
// ============================================

authAPI.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    console.warn('Auth token expired');
  }
  return response;
});

// ============================================
// Utility Types for Response Handling
// ============================================

export interface APIResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Export Default
// ============================================

export const api = gatewayAPI;
export default api;