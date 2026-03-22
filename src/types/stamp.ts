import type { ApiResponse } from './api';

export interface StatsParams {
  pages?: string;
  from: string;
  to: string;
  token?: string;
}

export interface PageStats {
  count: number;
}

export interface FlowNode {
  page: string;
  count: number;
}

export interface FlowEdge {
  from: string;
  to: string;
  count: number;
}

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export type StatsResponse = ApiResponse<Record<string, PageStats>>;
export type FlowResponse = ApiResponse<FlowData>;
