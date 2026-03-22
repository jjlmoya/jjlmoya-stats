import type { ApiResponse } from './api';

export interface StatsParams {
  pages?: string;
  from: string;
  to: string;
  token?: string;
}

export interface PageStatsResult {
  page: string;
  totalViews: number;
  uniqueVisits: number;
}

export interface PageView {
  id: string;
  page: string;
  visitId: string | null;
  createdAt: string;
}

export type StatsResponse = ApiResponse<PageStatsResult[]>;
export type FlowResponse = ApiResponse<PageView[]>;
