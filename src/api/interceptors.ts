import {
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/token';
import type { RefreshResponse } from '../types/auth';

const BASE_URL = 'https://api.jjlmoya.es/api/v1';
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  const token = getRefreshToken();
  if (!token) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (!res.ok) return false;

    const data: RefreshResponse = await res.json();
    setTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function handleUnauthorized(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = attemptRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export function redirectToLogin(): void {
  clearTokens();
  window.location.href = '/login';
}
