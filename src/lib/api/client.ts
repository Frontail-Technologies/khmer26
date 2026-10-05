export interface ApiErrorPayload {
  code: string;
  message: string;
  requestId?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message || 'An unexpected error occurred');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload.code || 'UNKNOWN_ERROR';
    this.requestId = payload.requestId;
    this.details = payload.details;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: ApiErrorPayload;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001/api/v1`
    : 'http://localhost:3001/api/v1');

const CSRF_STORAGE_KEY = 'k26_csrf';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
let csrfTokenCache: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match && match[3] ? decodeURIComponent(match[3]) : null;
}

function getStoredCsrfToken(): string | null {
  if (csrfTokenCache) return csrfTokenCache;
  const cookieToken = getCookie(CSRF_STORAGE_KEY);
  if (cookieToken) {
    csrfTokenCache = cookieToken;
    return cookieToken;
  }
  if (typeof window === 'undefined') return null;
  const storedToken = window.sessionStorage.getItem(CSRF_STORAGE_KEY);
  csrfTokenCache = storedToken;
  return storedToken;
}

function setStoredCsrfToken(token?: string): void {
  if (!token || typeof window === 'undefined') return;
  csrfTokenCache = token;
  window.sessionStorage.setItem(CSRF_STORAGE_KEY, token);
}

function clearStoredCsrfToken(): void {
  csrfTokenCache = null;
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(CSRF_STORAGE_KEY);
  }
}

function csrfFromResponse(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const payload = data as { data?: { csrfToken?: unknown } };
  return typeof payload.data?.csrfToken === 'string' ? payload.data.csrfToken : undefined;
}

function buildApiUrl(endpoint: string): string {
  return endpoint.startsWith('http') ? endpoint : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
}

function csrfRequired(endpoint: string, method: string): boolean {
  if (!UNSAFE_METHODS.has(method.toUpperCase())) return false;
  const path = endpoint.startsWith('http') ? new URL(endpoint).pathname : `/${endpoint.replace(/^\//, '')}`;
  return !['/auth/login', '/auth/register', '/auth/register/verify', '/auth/refresh', '/auth/csrf'].some((publicPath) =>
    path.endsWith(publicPath)
  );
}

function authRefreshAllowed(endpoint: string): boolean {
  const path = endpoint.startsWith('http') ? new URL(endpoint).pathname : `/${endpoint.replace(/^\//, '')}`;
  return !['/auth/login', '/auth/register', '/auth/register/verify', '/auth/refresh', '/auth/logout'].some((authPath) =>
    path.endsWith(authPath)
  );
}

async function refreshAuthSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(buildApiUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      clearStoredCsrfToken();
      return false;
    }

    const data = (await res.json()) as unknown;
    setStoredCsrfToken(csrfFromResponse(data));
    return true;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function ensureCsrfToken(): Promise<string | null> {
  const existingToken = getStoredCsrfToken();
  if (existingToken) return existingToken;

  const res = await fetch(buildApiUrl('/auth/csrf'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as unknown;
  const token = csrfFromResponse(data);
  setStoredCsrfToken(token);
  return token || null;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, body, headers = {}, ...customConfig } = options;

  let url = buildApiUrl(endpoint);

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const method = customConfig.method || 'GET';

  let requestBody: BodyInit | undefined = undefined;
  const baseHeaders = headers as Record<string, string>;
  if (body !== undefined) {
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  const buildRequestConfig = async (): Promise<RequestInit> => {
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...baseHeaders,
    };

    const csrfToken = csrfRequired(endpoint, method) ? await ensureCsrfToken() : getStoredCsrfToken();
    if (csrfToken && !reqHeaders['x-csrf-token'] && !reqHeaders['X-CSRF-Token']) {
      reqHeaders['x-csrf-token'] = csrfToken;
    }

    if (body !== undefined && !(body instanceof FormData)) {
      reqHeaders['Content-Type'] = 'application/json';
    }

    return {
      credentials: 'include',
      headers: reqHeaders,
      body: requestBody,
      ...customConfig,
    };
  };

  try {
    let res = await fetch(url, await buildRequestConfig());
    let isJson = res.headers.get('content-type')?.includes('application/json');
    let data = isJson ? await res.json() : null;

    if (!res.ok) {
      const errorPayload: ApiErrorPayload = data?.error || {
        code: `HTTP_${res.status}`,
        message: data?.message || res.statusText || 'Request failed',
        requestId: data?.requestId,
      };
      if (errorPayload.code === 'CSRF_INVALID') {
        clearStoredCsrfToken();
      }

      if (
        res.status === 401 &&
        authRefreshAllowed(endpoint) &&
        ['AUTHENTICATION_REQUIRED', 'SESSION_EXPIRED'].includes(errorPayload.code)
      ) {
        const refreshed = await refreshAuthSession();
        if (refreshed) {
          res = await fetch(url, await buildRequestConfig());
          isJson = res.headers.get('content-type')?.includes('application/json');
          data = isJson ? await res.json() : null;

          if (res.ok) {
            setStoredCsrfToken(csrfFromResponse(data));
            return data as ApiResponse<T>;
          }
        }
      }

      throw new ApiError(res.status, errorPayload);
    }

    setStoredCsrfToken(csrfFromResponse(data));
    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(499, {
        code: 'REQUEST_ABORTED',
        message: 'Request was cancelled',
      });
    }
    throw new ApiError(500, {
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Network connection failure',
    });
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
