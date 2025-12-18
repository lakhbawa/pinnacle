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

class FetchWrapper {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor(config: FetchWrapperConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.requestInterceptors = config.requestInterceptors || [];
    this.responseInterceptors = config.responseInterceptors || [];
  }

  // Add interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
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

  async request<T = any>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<T> {
    const url = this.buildURL(endpoint);

    // Merge headers
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    let requestConfig: RequestInit = {
      ...config,
      headers,
    };

    // Execute request interceptors
    requestConfig = await this.executeRequestInterceptors(requestConfig);

    try {
      let response = await this.fetchWithTimeout(url, requestConfig);

      // Execute response interceptors
      response = await this.executeResponseInterceptors(response);

      // Handle non-OK responses
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}\n${errorBody}`
        );
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // Return text for non-JSON responses
      return (await response.text()) as T;
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      throw error;
    }
  }

  // Convenience methods
  get<T = any>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T = any>(endpoint: string, data?: any, config?: RequestInit): Promise<T> {
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

  put<T = any>(endpoint: string, data?: any, config?: RequestInit): Promise<T> {
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

  patch<T = any>(endpoint: string, data?: any, config?: RequestInit): Promise<T> {
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

  delete<T = any>(endpoint: string, config?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Create default instance
export const api = new FetchWrapper({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add default request interceptor for authentication
api.addRequestInterceptor((config) => {
  // Get token from localStorage or cookies
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

// Add default response interceptor for logging
api.addResponseInterceptor((response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Response from ${response.url}: ${response.status}`);
  }
  return response;
});

export default api;