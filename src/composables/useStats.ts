import { ref } from 'vue';
import { getStats } from '../api/stamp';
import type { StatsParams, PageStatsResult } from '../types/stamp';

const data = ref<PageStatsResult[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const forbidden = ref(false);

async function fetchStats(params: StatsParams): Promise<void> {
  loading.value = true;
  error.value = null;
  forbidden.value = false;

  try {
    const response = await getStats(params);
    data.value = response.data;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === 'FORBIDDEN' || err.message === 'Forbidden') {
      forbidden.value = true;
    } else {
      error.value = err.message ?? 'Failed to load stats';
    }
  }

  loading.value = false;
}

export function useStats() {
  return { data, loading, error, forbidden, fetchStats };
}
