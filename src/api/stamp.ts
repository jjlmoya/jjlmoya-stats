import { get, post } from './client';
import type { StatsParams, StatsResponse, FlowResponse, VisitsResponse } from '../types/stamp';
import type { ApiResponse } from '../types/api';

export function getStats(params: StatsParams): Promise<StatsResponse> {
  const query: Record<string, string> = {
    from: params.from,
    to: params.to,
  };
  if (params.pages) query['pages'] = params.pages;
  if (params.token) query['token'] = params.token;
  return get<StatsResponse>('/stamp/stats', query);
}

export function getFlow(visitId: string): Promise<FlowResponse> {
  return get<FlowResponse>('/stamp/flow', { visitId });
}

export function getVisits(params: StatsParams): Promise<VisitsResponse> {
  return get<VisitsResponse>('/stamp/visits', {
    from: params.from,
    to: params.to,
  });
}

export function createStatsToken(
  page: string,
  ttlHours: number,
): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
  return post('/stamp/stats/token', { page, ttlHours });
}
