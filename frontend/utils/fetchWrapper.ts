// lib/fetch-wrapper.ts

type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

interface FetchWrapperConfig {
  baseURL?: string;
  headers?: HeadersInit;
  timeout?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

export class FetchWrapper {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor(config: FetchWrapperConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.requestInterceptors = [...(config.requestInterceptors || [])];
    this.responseInterceptors = [...(config.responseInterceptors || [])];
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
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

  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const base = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
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
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  async request<T = unknown>(endpoint: string, config: RequestInit = {}): Promise<T> {
    const url = this.buildURL(endpoint);

    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    let requestConfig: RequestInit = {
      ...config,
      headers,
    };

    requestConfig = await this.executeRequestInterceptors(requestConfig);

    try {
      let response = await this.fetchWithTimeout(url, requestConfig);
      response = await this.executeResponseInterceptors(response);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorBody}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return (await response.text()) as T;
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      throw error;
    }
  }

  get<T = unknown>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  put<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
  }

  patch<T = unknown>(endpoint: string, data?: unknown, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
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

export function addSharedRequestInterceptor(interceptor: RequestInterceptor): void {
  sharedRequestInterceptors.push(interceptor);
  Object.values(apiRegistry).forEach((api) => api.addRequestInterceptor(interceptor));
}

export function addSharedResponseInterceptor(interceptor: ResponseInterceptor): void {
  sharedResponseInterceptors.push(interceptor);
  Object.values(apiRegistry).forEach((api) => api.addResponseInterceptor(interceptor));
}

export function createAPI(name: string, config: FetchWrapperConfig): FetchWrapper {
  const instance = new FetchWrapper({
    ...config,
    requestInterceptors: [...sharedRequestInterceptors, ...(config.requestInterceptors || [])],
    responseInterceptors: [...sharedResponseInterceptors, ...(config.responseInterceptors || [])],
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

// ============================================
// Service Instances
// ============================================

export const authAPI = createAPI('auth', {
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://127.0.0.1:4000/api/v1',
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

addSharedRequestInterceptor((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

addSharedResponseInterceptor((response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${response.status}] ${response.url}`);
  }
  return response;
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

export const api = gatewayAPI;
export default api;