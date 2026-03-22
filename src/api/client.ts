import { getAccessToken } from '../utils/token';
import { handleUnauthorized, redirectToLogin } from './interceptors';
import type { ApiError } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return url.toString();
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleError(res: Response): Promise<never> {
  const error: ApiError = await res.json();
  throw error;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string>,
  retry = true,
): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    method,
    headers: buildHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.ok) return res.json();

  if (res.status === 401 && retry) {
    const refreshed = await handleUnauthorized();
    if (refreshed) return request<T>(method, path, body, params, false);
    redirectToLogin();
  }

  return handleError(res);
}

export function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  return request<T>('GET', path, undefined, params);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}
