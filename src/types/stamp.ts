import type { ApiResponse } from './api';

export interface TimeSeriesParams {
  page: string;
  from: string;
  to: string;
  granularity?: 'day' | 'hour';
}

export interface TimeSeriesPoint {
  date: string;
  totalViews: number;
  uniqueVisits: number;
}

export type TimeSeriesResponse = ApiResponse<TimeSeriesPoint[]>;

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

export interface VisitSummary {
  visitId: string;
  pageCount: number;
  firstPage: string;
  startedAt: string;
}

export type StatsResponse = ApiResponse<PageStatsResult[]>;
export type FlowResponse = ApiResponse<PageView[]>;
export type VisitsResponse = ApiResponse<VisitSummary[]>;
