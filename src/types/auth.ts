import type { ApiResponse } from './api';

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  emailVerified: boolean;
  locale: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData extends AuthTokens {
  user: User;
}

export type OAuthProvider = 'google' | 'twitch' | 'discord';

export type AuthResponse = ApiResponse<AuthData>;
export type RefreshResponse = ApiResponse<AuthTokens>;
export type UserResponse = ApiResponse<{ user: User }>;
export type OAuthUrlResponse = ApiResponse<{ url: string }>;
