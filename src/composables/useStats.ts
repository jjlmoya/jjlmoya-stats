import { ref } from 'vue';
import { getStats } from '../api/stamp';
import type { StatsParams, PageStats } from '../types/stamp';

const data = ref<Record<string, PageStats>>({});
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchStats(params: StatsParams): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    const response = await getStats(params);
    data.value = response.data;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    error.value = err.message ?? 'Failed to load stats';
  }

  loading.value = false;
}

export function useStats() {
  return { data, loading, error, fetchStats };
}
