export interface ApiResponse<T> {
  success: true;
  timestamp: string;
  data: T;
}

export interface ApiError {
  success: false;
  timestamp: string;
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
