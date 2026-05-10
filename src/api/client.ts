import { API_BASE_URL, SERVER_SECRET, API_SERVER_SECRET } from '@/config/env';

export type ApiError = {
  message: string;
  statusCode: number;
  data?: unknown;
};

export class ApiException extends Error {
  statusCode: number;
  data?: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
  responseType?: 'json' | 'blob';
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers as HeadersInit);

    if (!skipAuth) {
      headers.set('server-secret', SERVER_SECRET || '');
      headers.set('api-server-secret', API_SERVER_SECRET || '');
    }

    if (fetchOptions.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, { ...fetchOptions, headers });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiException(
          response.status,
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          data,
        );
      }

      const data = await response.json();
      return data.data as T;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(
        0,
        error instanceof Error ? error.message : 'Unknown error occurred',
        error,
      );
    }
  },

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
