const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const isBrowser = typeof localStorage !== 'undefined';

export function getAccessToken(): string | null {
  return isBrowser ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken(): string | null {
  return isBrowser ? localStorage.getItem(REFRESH_KEY) : null;
}

export function setTokens(access: string, refresh: string): void {
  if (!isBrowser) return;
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  if (!isBrowser) return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function hasTokens(): boolean {
  return getAccessToken() !== null;
}
