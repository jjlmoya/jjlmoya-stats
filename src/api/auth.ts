import { get, post } from './client';
import type {
  OAuthProvider,
  OAuthUrlResponse,
  AuthResponse,
  UserResponse,
} from '../types/auth';
import type { ApiResponse } from '../types/api';

export function getOAuthUrl(provider: OAuthProvider): Promise<OAuthUrlResponse> {
  return get<OAuthUrlResponse>(`/auth/${provider}/authorize`);
}

export function handleOAuthCallback(
  provider: OAuthProvider,
  code: string,
  state: string,
): Promise<AuthResponse> {
  return get<AuthResponse>(`/auth/${provider}/callback`, { code, state });
}

export function getMe(): Promise<UserResponse> {
  return get<UserResponse>('/auth/me');
}

export function logout(refreshToken: string): Promise<ApiResponse<null>> {
  return post<ApiResponse<null>>('/auth/logout', { refreshToken });
}
